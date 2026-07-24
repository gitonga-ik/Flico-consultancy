import BookDetails from "@/app/components/BookDetails";
import {notFound} from "next/navigation";
import {fetchBook} from "@/utils/actions";
import BookPreviewCarousel from "@/app/components/BookCarousel";
import path from "node:path";
import fs from "fs";

interface PathParams {
    params: Promise<{ slug: string }>;
}

export function previewExists(title: string): boolean {
    const imagePath = path.join(process.cwd(), "public", "images", "previews", title, "page_1.webp");
    return fs.existsSync(imagePath);
}

const bookInfo = async ({params}: PathParams) => {
    const {slug} = await params;

    const book = await fetchBook(slug)
    const hasPreview = previewExists(slug);

    if (!book) notFound();

    return (
        <>
            <BookDetails book={book}/>
            {hasPreview && book.slug ? <BookPreviewCarousel bookTitle={book.slug}/> : null}
        </>
    );
};

export default bookInfo;
