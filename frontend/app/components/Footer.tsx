import Link from "next/link";
import FooterYear from "./FooterYear";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-[#111a21] text-white py-7.5 px-5 mt-2 text-center">
            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 text-center md:text-left">
                    <div className="flex justify-center md:justify-start">
                        <Image
                            src="/images/favicon.png"
                            loading="eager"
                            alt="Company logo"
                            width={500}
                            height={500}
                            className="h-37.5 w-37.5 object-contain"
                        />
                    </div>

                    <div className="space-y-2">
                        <p>
                            <Link
                                href="#"
                                className="hover:underline flex items-center justify-center md:justify-start gap-2 text-white"
                            >
                                <i className="bi bi-telephone"></i> +254 727 787 083
                            </Link>
                        </p>
                        <p>
                            <Link
                                href="tel:+254 762 607 860"
                                className="hover:underline flex items-center justify-center md:justify-start gap-2 text-white"
                            >
                                <i className="bi bi-telephone"></i> +254 762 607 860
                            </Link>
                        </p>
                        <p>
                            <Link
                                href="mailto:flico2ironfx@gmail.com"
                                className="hover:underline flex items-center justify-center md:justify-start gap-2 text-white"
                            >
                                <i className="bi bi-envelope-at"></i> flico2ironfx@gmail.com
                            </Link>
                        </p>

                        <div className="pt-2 flex justify-center md:justify-start gap-4">
                            <Link
                                href="#"
                                className="text-[#f4cd2a] hover:underline font-medium"
                            >
                                Facebook
                            </Link>
                            <Link
                                href="#"
                                className="text-[#f4cd2a] hover:underline font-medium"
                            >
                                Instagram
                            </Link>
                            <Link
                                href="#"
                                className="text-[#f4cd2a] hover:underline font-medium"
                            >
                                TikTok
                            </Link>
                        </div>
                    </div>

                    <FooterYear/>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
