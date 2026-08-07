"use server"

import "server-only"
import mupdf from "mupdf";
import sharp from "sharp";
import path from "node:path";
import cloudinary from "./cloudinary";

function uploadBufferToCloudinary(
  buffer: Buffer,
  folderPath: string,
  publicId: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        public_id: publicId,
        format: "webp",
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        reject(new Error("Cloudinary upload failed without error details."));
      },
    );

    uploadStream.end(buffer);
  });
}

export async function generatePreviews(
  title: string,
  pdf: File | null,
): Promise<string[] | false> {
  if (!pdf) return false;
  try {
    const documentBuffer = await pdf.arrayBuffer();
    const doc = mupdf.Document.openDocument(documentBuffer, "application/pdf");
    const totalPages = doc.countPages();
  
    const requestedPages: number[] = [0, 1, 2, -2, -1];
    const resolvedPages: number[] = [];
  
    for (const p of requestedPages) {
      const actualIndex = p >= 0 ? p : totalPages + p;
      if (actualIndex >= 0 && actualIndex < totalPages) {
        resolvedPages.push(actualIndex);
      }
    }
  
    const uniquePages = [...new Set(resolvedPages)];
  
    const rawBookName = path.basename(pdf.name, path.extname(pdf.name));
    const bookSlug = title.trim().toLowerCase().replaceAll(" ", "_");
  
    const cloudinaryFolder = `images/previews/${bookSlug}`;
  
    const uploadPromises = uniquePages.map(async (pageNum, i) => {
      const page = doc.loadPage(pageNum);
  
      const scale = 150 / 72;
      const pixmap = page.toPixmap(
        mupdf.Matrix.scale(scale, scale),
        mupdf.ColorSpace.DeviceRGB,
        false,
        true,
      );
  
      const pngBuffer: Buffer = Buffer.from(pixmap.asPNG());
  
      pixmap.destroy();
      page.destroy();
  
      const webpBuffer = await sharp(pngBuffer).webp({ quality: 90 }).toBuffer();
  
      const publicId = `page_${i + 1}`;
  
      const secureUrl = await uploadBufferToCloudinary(
        webpBuffer,
        cloudinaryFolder,
        publicId,
      );
  
      return secureUrl;
    });
  
    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    } catch (error) {
      throw error;
    } finally {
      doc.destroy();
    }
  } catch (error) {
    return false;
  }
}

export async function uploadCover(image: any | null): Promise<string | false> {
    if (!image) return false;
    try {
      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      const coverDir = "images/covers/";

      const cloudinaryResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: coverDir }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(imageBuffer);
      });

      return cloudinaryResponse.secure_url;
    } catch (error) {
      return false;
    }
  }