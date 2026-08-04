import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="bg-[#fefdfd] shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between h-20">
                <Link href="/" className="inline-block m-2">
                    <div className="h-12.5 w-30 bg-gray-200 flex items-center justify-center text-xs">
                        <Image
                            src="/images/logo.png"
                            alt="Company logo"
                            width={500}
                            height={500}
                            className="h-12.5 w-30 object-cover"
                        />
                    </div>
                </Link>

                <div className="hidden md:flex space-x-6">
                    <Link
                        className="text-gray-600 hover:text-[#164d77] font-medium"
                        href="/#about"
                        scroll={true}
                    >
                        About
                    </Link>
                    <Link
                        className="text-gray-600 hover:text-[#164d77] font-medium"
                        href="/#services"
                        scroll={true}
                    >
                        Services
                    </Link>
                    <Link
                        className="text-gray-600 hover:text-[#164d77] font-medium"
                        href="/books"
                        scroll={true}
                    >
                        Books
                    </Link>
                    <Link
                        className="text-gray-600 hover:text-[#164d77] font-medium"
                        href="/#contact"
                        scroll={true}
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
