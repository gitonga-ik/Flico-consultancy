import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[#fefdfd] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        <div className="h-12.5 w-30 bg-gray-200 m-2 flex items-center justify-center text-xs">
          <img
            src="images/logo.png"
            id="logo"
            alt="Company logo"
            className="h-15 w-30 object-cover"
          />
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            className="text-gray-600 hover:text-[#164d77] font-medium"
            href="#about"
            scroll={true}
          >
            About
          </Link>
          <Link
            className="text-gray-600 hover:text-[#164d77] font-medium"
            href="#services"
            scroll={true}
          >
            Services
          </Link>
          <Link
            className="text-gray-600 hover:text-[#164d77] font-medium"
            href="#books"
            scroll={true}
          >
            Books
          </Link>
          <Link
            className="text-gray-600 hover:text-[#164d77] font-medium"
            href="#contact"
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
