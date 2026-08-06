"use server";

import path from "node:path";
import fs from "node:fs/promises";
import { prisma } from "@/prisma/prisma";
import { booksCreateInput } from "@/generated/prisma/models/books";
import { logger } from "@/utils/logger";
import sharp from "sharp";
import generatePreviews from "@/utils/generatePreviews";
import { SignJWT } from "jose";
import { sendVerificationMail } from "@/Mail/comm";
import { BookData, BookInfo, OrderDetails } from "@/utils/interfaces";
import cloudinary from "@/utils/cloudinary";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function uploadDocument(
  document: File | null,
  image: File | null,
  info: BookData,
  local = 1,
): Promise<string | boolean> {
  if (!document) throw new Error("Document required for upload.");
  if (!image) throw new Error("Book cover image is required");

  try {
    if (local) {
      const documentArrayBuffer = await document.arrayBuffer();
      const documentBuffer = Buffer.from(documentArrayBuffer);

      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      const webPImageBuffer = await sharp(imageBuffer)
        .webp({ quality: 80 })
        .toBuffer();

      const fileExt =
        document.name.lastIndexOf(".") === 0 || -1
          ? ".pdf"
          : document.name.slice(document.name.lastIndexOf(".")).toLowerCase();

      const uploadDir = path.parse("uploads/docs");
      const filePath = path.join(
        path.format(uploadDir),
        `${info.title.trim().toLowerCase().replaceAll(" ", "_")}${fileExt}`,
      );
      await fs.mkdir(path.format(uploadDir), { recursive: true });
      await fs.writeFile(filePath, documentBuffer);

      const coverDir = "images/covers/";

      const cloudinaryResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: coverDir }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(webPImageBuffer);
      });

      const uploadedUrls: string[] = await generatePreviews(filePath);

      const book: booksCreateInput = {
        TITLE: info.title.trim(),
        DESCRIPTION: info.description.trim(),
        PRICE: Number(info.price),
        SLUG: info.title.trim().toLowerCase().replaceAll(" ", "_"),
        FILE_PATH: filePath,
        COVER_PATH: cloudinaryResponse.secure_url,
        PREVIEW_PATH: uploadedUrls,
      };

      const bookSlug = await recordBook(book);
      if (!bookSlug) {
        return false;
      }
      logger.info(`Inserted record for ${book.TITLE} successfully.`);
      return bookSlug;
    } else {
      // uploads to an online datastore e.g. S3
      return false;
    }
  } catch (error) {
    logger.error(`Could not save book information: ${error}`);
    return false;
  }
}

export async function recordBook(book: booksCreateInput) {
  try {
    const newBook = await prisma.books.create({
      data: book,
    });
    return newBook.SLUG;
  } catch (error) {
    logger.error(`Could not save record to db: ${error}`);
    return false;
  }
}

export async function fetchBook(slug: string): Promise<BookData | false> {
  try {
    const book = await prisma.books.findUniqueOrThrow({
      where: { SLUG: slug },
      select: {
        ID: true,
        TITLE: true,
        DESCRIPTION: true,
        PRICE: true,
        SLUG: true,
        COVER_PATH: true,
        PREVIEW_PATH: true,
      },
    });

    logger.info(`${book.TITLE} record fetched.`);
    return {
      id: book.ID,
      title: book.TITLE,
      price: String(book.PRICE),
      description: book.DESCRIPTION,
      slug: book.SLUG,
      cover_path: book.COVER_PATH,
      previews: book.PREVIEW_PATH,
    } as unknown as BookData;
  } catch (error) {
    logger.error(`Could not get book record: ${error}.`);
    return false;
  }
}

export async function fetchAllBooks(): Promise<BookData[] | false> {
  try {
    const books = await prisma.books.findMany({
      select: {
        TITLE: true,
        DESCRIPTION: true,
        PRICE: true,
        COVER_PATH: true,
      },
    });

    return books.map((book) => ({
      title: book.TITLE,
      price: String(book.PRICE),
      description: book.DESCRIPTION,
      cover_path: book.COVER_PATH,
    })) as BookData[];
  } catch (error) {
    logger.error(`Unable to fetch book records. ${error}`);
    return false;
  }
}

export async function createOrder(
  book: BookInfo["book"],
  email: string,
): Promise<boolean> {
  try {
    const order = await prisma.orders.create({
      data: {
        EMAIL: email,
        books: {
          connect: {
            ID: book.id,
          },
        },
      },
    });
    logger.info(`Order for ${book.title} by ${email} created`);

    const payload = { order_id: order.ID };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("6h")
      .sign(SECRET_KEY);

    return sendVerificationMail(order.EMAIL, encodeURI(token));
  } catch (error) {
    logger.error(`Error creating order for ${book.title}: ${error}`);
    return false;
  }
}

export async function fetchOrder(id: string): Promise<false | OrderDetails> {
  try {
    const order = await prisma.orders.findUniqueOrThrow({
      select: {
        ID: true,
        EMAIL: true,
        books: {
          select: {
            TITLE: true,
            PRICE: true,
            SLUG: true,
          },
        },
      },
      where: {
        ID: id,
      },
    });

    // TODO:Activate order upon fetching

    return {
      id: Buffer.from(order.ID).toString("hex"),
      email: order.EMAIL,
      book: {
        title: order.books.TITLE,
        price: order.books.PRICE,
        slug: order.books.SLUG,
      },
    };
  } catch (error) {
    logger.error(`Error fetching order with ID:${id}:${error}`);
    return false;
  }
}
