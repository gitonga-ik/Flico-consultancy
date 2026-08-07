import Books from "../components/Books";
import { Suspense } from "react";
import {fetchAllBooks} from "@/utils/actions";

const books = async () => {
  const books = await fetchAllBooks();
  return (
    <>
      <section>
        <div className="container mx-auto px-4">
          <Suspense>
            <Books title={"Explore our collection"} books={books} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default books;
