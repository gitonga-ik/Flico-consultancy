import Link from "next/link";

const Hero = () => {
  return (
    <section
      className="relative py-30 px-5 text-center bg-cover bg-center text-white scroll-mt-16"
      style={{
        backgroundImage: `linear-gradient(rgba(86, 139, 179, 0.85), rgba(22, 77, 119, 0.85)), url(images/hero.jpeg)`,
      }}
    >
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-white text-3xl md:text-5xl font-semibold leading-tight">
          Supporting Recovery, Purpose & Healthy Living
        </h1>
        <p className="mt-4 text-lg text-gray-100">
          Counselling, mentorship and training programs focused on addiction
          recovery, stress management and life purpose.
        </p>
        <Link
          className="inline-block mt-6 px-6 py-2.5 border-2 border-[#f4cd2a] text-[#f4cd2a] rounded font-medium hover:bg-[#f4cd2a] hover:text-gray-900 transition-colors"
          href="#contact"
        >
          Get in Touch With us
        </Link>
      </div>
    </section>
  );
};

export default Hero;
