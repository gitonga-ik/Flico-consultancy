import BookDetails from "@/app/components/BookDetails";
import {notFound} from "next/navigation";
import {fetchBook} from "@/utils/actions";
import BookPreviewCarousel from "@/app/components/BookCarousel";

interface PathParams {
    params: Promise<{ slug: string }>;
}

const bookInfo = async ({params}: PathParams) => {
    const {slug} = await params;

    const book = await fetchBook(slug)
    if (!book) notFound();

    return (
        <>
            <BookDetails book={book}/>
            {book.previews && book.slug ? <BookPreviewCarousel bookTitle={book.title} previewUrls={book.previews}/> : null}
        </>
    );
};

export default bookInfo;
