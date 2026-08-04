import Hero from "./components/Hero";
import About from "./components/About";
import Books from "./components/Books";
import Booking from "./components/Booking";
import {fetchAllBooks} from "@/utils/actions";

export default async function Home() {
  const books = await fetchAllBooks();

  return (
    <main>
      <Hero />
      <About />
      <Books title={"Books"} books={books} />
      <Booking />
    </main>
  );
}
