"use server"

import path from "node:path";
import fs from "node:fs/promises";
import {prisma} from "@/prisma/prisma";
import {booksCreateInput} from "@/app/generated/prisma/models/books";
import {logger} from "@/utils/logger";
import sharp from "sharp";

export interface BookData {
    title: string;
    price: string;
    description: string;
    slug? : string;
}

export async function uploadDocument(document: File | null, image: File | null, info: BookData, local = 1): Promise<string | boolean> {
    if (!document) throw new Error("Document required for upload.")
    if (!image) throw new Error("Book cover image is required")

    try{
        if (local) {
            const documentArrayBuffer = await document.arrayBuffer();
            const documentBuffer = Buffer.from(documentArrayBuffer);

            const imageArrayBuffer = await image.arrayBuffer();
            const imageBuffer = Buffer.from(imageArrayBuffer);

            const webPImageBuffer = await sharp(imageBuffer).webp({ quality: 80 }).toBuffer();

            const fileExt = document.name.lastIndexOf(".") === 0 || -1 ? ".pdf" :
                document.name.slice(document.name.lastIndexOf(".")).toLowerCase();

            const uploadDir = path.parse("public/uploads");
            const coverDir = path.parse("public/covers");
            const imagePath = path.join(path.format(coverDir), `${info.title.trim().toLowerCase().replaceAll(" ", "_")}.webp`)
            const filePath = path.join(path.format(uploadDir), `${info.title.trim().toLowerCase().replaceAll(" ", "_")}${fileExt}`);

            await fs.mkdir(path.format(uploadDir), {recursive: true});
            await fs.mkdir(path.format(coverDir), {recursive: true});

            await fs.writeFile(imagePath, webPImageBuffer);
            await fs.writeFile(filePath, documentBuffer);

            const book: booksCreateInput = {
                TITLE: info.title.trim(),
                DESCRIPTION: info.description.trim(),
                PRICE: Number(info.price),
                SLUG: info.title.trim().toLowerCase().replaceAll(" ", "_"),
                FILE_PATH: filePath
            }

            const bookSlug = await recordBook(book);
            logger.info(`Inserted record for ${book.TITLE} successfully.`)
            if (!bookSlug) {
                return false;
            }
            return bookSlug;
        } else {
            // uploads to an online datastore e.g. S3
            return false;
        }
    }catch(error){
        logger.error(`Could not save book information: ${error}`)
        return false;
    }
}

export async function recordBook(book: booksCreateInput) {
    try {
        const newBook = await prisma.books.create({
            data: book
        })
        return newBook.SLUG;
    } catch (error) {
        logger.error(`Could not save record to db: ${error}`);
        return false
    }
}

export async function fetchBook(slug: string): Promise<BookData | false> {
    try {
        const book = await prisma.books.findUniqueOrThrow({
            where: {SLUG: slug},
            select: {
                TITLE: true,
                DESCRIPTION: true,
                PRICE: true,
                SLUG: true
            }
        })

        logger.info(`${book.TITLE} record fetched.`)
        return {
            title: book.TITLE,
            price: String(book.PRICE),
            description: book.DESCRIPTION,
            slug: book.SLUG
        }
    } catch (error) {
        logger.error(`Could not get book record: ${error}.`);
        return false
    }
}

export async function fetchAllBooks(): Promise<BookData[] | false> {
    try {
        const books = await prisma.books.findMany({
            select: {
                TITLE: true,
                DESCRIPTION: true,
                PRICE: true
            }
        })

        return books.map((book) => ({
            title: book.TITLE,
            price: String(book.PRICE),
            description: book.DESCRIPTION
        })) as BookData[];
    } catch (error) {
        logger.error(`Unable to fetch book records. ${error}`);
        return false;
    }
}

export async function createOrder(){

}