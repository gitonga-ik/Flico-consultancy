"use server"

import "server-only";
import mupdf from "mupdf";
import sharp from "sharp";
import {readFileSync, mkdirSync} from "node:fs";
import path from "node:path";

export default async function generatePreviews(pdfPath: string): Promise<void> {
    const previewDirectory = path.resolve("uploads", "images", "previews");

    const buffer = readFileSync(pdfPath);
    const doc = mupdf.Document.openDocument(buffer, "application/pdf");
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

    const bookName = path.basename(pdfPath, path.extname(pdfPath));
    const bookDirectory = path.join(previewDirectory, bookName);
    mkdirSync(bookDirectory, {recursive: true});

    uniquePages.forEach((pageNum, i) => {
        const page = doc.loadPage(pageNum);

        const scale = 150 / 72;
        const pixmap = page.toPixmap(
            mupdf.Matrix.scale(scale, scale),
            mupdf.ColorSpace.DeviceRGB,
            false,
            true
        );

        const pngBuffer: Buffer = Buffer.from(pixmap.asPNG());
        const fileName = path.join(bookDirectory, `page_${i + 1}.webp`);

        sharp(pngBuffer)
            .webp({quality: 90})
            .toFile(fileName)
            .then(() => {
                console.log(`Saved: ${fileName} (Source PDF Page: ${pageNum + 1})`);
            })
            .catch((err: unknown) => {
                console.error(`Failed to save ${fileName}:`, err);
            });

        pixmap.destroy();
        page.destroy();
    });

    doc.destroy();
}