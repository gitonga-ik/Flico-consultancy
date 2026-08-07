"use server";

import { prisma } from "@/prisma/prisma";
import { booksCreateInput } from "@/generated/prisma/models/books";
import { SignJWT } from "jose";
import { sendVerificationMail } from "@/Mail/comm";
import { BookData, BookInfo, OrderDetails } from "@/utils/interfaces";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function recordBook(book: booksCreateInput) {
  try {
    const newBook = await prisma.books.create({
      data: book,
    });

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "info",
        message: `Inserted record for ${book.TITLE} successfully.`,
      }),
    );
    return newBook.SLUG;
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Could not save book record to db: ${error}`,
      }),
    );
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
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "info",
        message: `${book.TITLE} record fetched.`,
      }),
    );
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
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Could not get book record: ${error}.`,
      }),
    );
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
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Unable to fetch book records: ${error}`,
      }),
    );
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
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "info",
        message: `Order for ${book.title} by ${email} created`,
      }),
    );
    const payload = { order_id: order.ID };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("6h")
      .sign(SECRET_KEY);

    return sendVerificationMail(order.EMAIL, encodeURI(token));
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Error creating order for ${book.title}: ${error}`,
      }),
    );
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
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Error fetching order with ID:${id}:${error}`,
      }),
    );
    return false;
  }
}
