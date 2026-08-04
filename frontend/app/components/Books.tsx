"use client";

import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {BookData} from "@/utils/interfaces"

interface PageInfo {
    title: string;
    books: false | BookData[];
}

const Books = ({title, books}: PageInfo) => {
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    let search = true;

    if(books == false){
        return (
        <section id="books" className="py-8 px-5 scroll-mt-8">
            <div className="container mx-auto max-w-6xl">
                <h2 className="text-center text-[#164d77] text-3xl font-semibold mb-5">
                    {title}
                </h2>
                <p className="text-center text-[#164d77] text-xl font-semibold mb-5">
                    No books to display for now. Come back later ^_~
                </p>
            </div>
        </section>
        )
    }

    if (pathname == "/") {
        books = books.slice(0, 3);
        search = false;
    }

    const filtered = books.filter((book) => {
        const target = query.toLowerCase();

        return (
            book.title.toLowerCase().includes(target) ||
            (book.description ?? "").toLowerCase().includes(target)
        );
    });

    return (
        <>
            {filtered && (
                <section id="books" className="py-8 px-5 scroll-mt-8">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-center text-[#164d77] text-3xl font-semibold mb-5">
                            {title}
                        </h2>

                        {search ? (
                            <input
                                type="text"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search using title..."
                                className="w-full border border-[#d6cfc5] rounded-xl px-4 py-4 mb-8
                   font-dm-sans text-sm bg-white focus:outline-none
                   focus:ring-2 focus:ring-[#a3d3d0] transition"
                            />
                        ) : null}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                            {filtered && filtered.length > 0 ? (filtered?.map((book, index) => (
                                <div
                                    key={index}
                                    className="card bg-base-100 w-90 shadow-sm flex justify-center"
                                >
                                    <figure className="w-full max-w-sm">
                                        <Image
                                            src={`uploads/covers/${book.title.toLowerCase().replaceAll(" ", "_")}.webp`}
                                            alt={book.title}
                                            width={500}
                                            height={500}
                                            className="w-full h-auto object-cover"
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title">{book.title}</h2>
                                        <p>{book.description}</p>
                                        <div className="card-actions justify-end">
                                            <Link
                                                href={`/books/${book.title.toLowerCase().replaceAll(" ", "_")}`}
                                                className="inline-block btn hover:bg-[#a3d3d0] py-2"
                                            >
                                                View book
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))) :
                                <p className="text-center text-[#164d77] text-md font-semibold mb-5">
                                    No books match your search. Come back later ^_~
                                </p>}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default Books;
