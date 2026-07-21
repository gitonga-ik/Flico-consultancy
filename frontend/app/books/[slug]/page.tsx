import BookDetails from "@/app/components/BookDetails";
import { notFound } from "next/navigation";
import {fetchBook} from "@/utils/actions";

interface PathParams {
  params: Promise<{ slug: string }>;
}

const bookInfo = async ({ params }: PathParams) => {
  const { slug } = await params;

  const book = await fetchBook(slug)

  if (!book) notFound();

  return (
    <BookDetails book={book}/>
  );
};

export default bookInfo;
