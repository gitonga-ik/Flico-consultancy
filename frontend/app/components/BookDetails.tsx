"use client";

import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createOrder } from "@/utils/actions";
import { BookInfo } from "@/utils/interfaces";

const BookDetails = ({ book }: BookInfo) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim()))
      setError("Provide a valid email address.");

    const result = await createOrder(book, email);

    if (!result) setError("Please try again");
    return true;
  }

  return (
    <section id="book-details" className="py-12 px-4 sm:px-6 lg:px-8">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1" />
        <span>Back to catalogue</span>
      </Link>
      <div className="mx-auto max-w-5xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-112.5">
          <div className="w-full md:w-2/5 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative w-48 sm:w-60 md:w-full max-w-70 aspect-3/4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-gray-100">
              <Image
                src={book.cover_path ?? "/images/default_cover.png"}
                alt={book.title}
                width={500}
                height={500}
                loading="eager"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
                {book.title}
              </h1>

              <div className="prose prose-sm text-gray-600 space-y-4 mb-6 leading-relaxed">
                <p>{book.description}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Price
                  </span>
                  <span className="text-3xl font-extrabold text-[#164d77]">
                    Ksh. {book.price}
                  </span>
                </div>

                <button
                  className="inline-flex items-center justify-center bg-[#3674a3] hover:bg-[#198796] text-white font-medium px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0 transition-all duration-200 text-center cursor-pointer"
                  onClick={() =>
                    (
                      document.getElementById(
                        "purchase-email-modal",
                      ) as HTMLDialogElement | null
                    )?.showModal()
                  }
                >
                  Purchase Now
                </button>

                <dialog id="purchase-email-modal" className="modal">
                  <div className="modal-box max-w-md rounded-2xl">
                    {error ? (
                      <div role="alert" className="alert alert-error">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 shrink-0 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{error}</span>
                      </div>
                    ) : null}
                    <h3 className="font-bold text-xl text-slate-800">
                      Complete Your Purchase
                    </h3>

                    <p className="py-4 text-sm text-slate-500 leading-relaxed">
                      Please enter a valid, active email address below. We will
                      use this email to send your secure payment link and
                      deliver your book download instantly once payment is
                      complete.
                    </p>

                    <form method="dialog" onSubmit={handleSubmit}>
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-medium text-slate-700">
                            Email Address
                          </span>
                        </label>
                        <input
                          type="email"
                          name="customer_email"
                          placeholder="you@example.com"
                          onChange={(event) => setEmail(event.target.value)}
                          required
                          className="input input-bordered w-full rounded-xl focus:outline-none focus:border-[#3674a3]"
                        />
                      </div>

                      <div className="modal-action mt-6 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            (
                              document.getElementById(
                                "purchase-email-modal",
                              ) as HTMLDialogElement | null
                            )?.close()
                          }
                          className="btn btn-ghost rounded-xl text-slate-500 hover:bg-slate-100"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="btn bg-[#3674a3] hover:bg-[#198796] text-white font-medium border-none rounded-xl px-6"
                        >
                          Get Payment Link
                        </button>
                      </div>
                    </form>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetails;
