import Link from "next/link";

export const metadata = {title: "Page Not Found"};

export default function NotFound() {
    return (
        <>
            <section
                id="not-found"
                className="min-h-[70vh] py-20 px-5 flex items-center justify-center scroll-mt-16"
            >
                <div className="container mx-auto max-w-lg text-center flex flex-col items-center justify-center">
                    <h1 className="text-8xl font-black text-[#164d77] tracking-tight mb-4">
                        404
                    </h1>
          
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Page Not Found
                    </h2>

                    <p className="text-gray-600 text-base mb-8 max-w-sm leading-relaxed">
                        Sorry, the page you&#39;re looking for doesn&#39;t exist or has been moved.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center bg-[#164d77] hover:bg-[#0f3b5c] text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#164d77] focus:ring-offset-2"
                    >
                        Go Home
                    </Link>
                </div>
            </section>
        </>
    );
}
