"use server";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supaClient } from "@/utils/supabase";
import { OrderDetails } from "./interfaces";
import { base } from "next/dist/build/webpack/config/blocks/base";

function getStorage() {
  const { storage } = supaClient();
  return storage;
}

export default async function addPdfWatermark(
  order: OrderDetails,
): Promise<false | string> {
  try {
    const storage = getStorage();
    if (!order.book.link) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "info",
          message: `Could not fetch book order`,
        }),
      );
      return false;
    }

    const response = await fetch(order.book.link);
    const baseDoc = await response.blob();

    if (!response.ok || !baseDoc) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          message: `Could not fetch object from storage`,
        }),
      );
      return false;
    }

    const docBuffer: ArrayBuffer = await baseDoc.arrayBuffer();

    const pdfDoc = await PDFDocument.load(docBuffer);

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width } = page.getSize();

      const fontSize = 6;
      const text = `DOWNLOADED BY ${order.email}`;
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: 30,
        size: fontSize,
        font,
        color: rgb(0.4, 0.4, 0.4),
        opacity: 1,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const customerDocBuffer = Buffer.from(pdfBytes);
    const filepath = `customer_docs/${Buffer.from(order.id, "hex").toString("utf-8")}_${Date.now()}.pdf`;
    const { data, error: uploadError } = await storage
      .from("customer_docs")
      .upload(filepath, customerDocBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          message: `Supabase Storage Upload Error:, ${uploadError.message}`,
        }),
      );
      throw uploadError;
    }

    const { data: urlData } = storage
      .from("customer_docs")
      .getPublicUrl(filepath);
    return urlData.publicUrl;
  } catch (error: any) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Could not watermark document for order ${order.id}: ${error.message}`,
      }),
    );

    return false;
  }
}
