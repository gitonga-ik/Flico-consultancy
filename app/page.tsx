import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Books from "./components/Books";
import Booking from "./components/Booking";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Books />
      <Booking />
      <Footer />
    </main>
  );
}
