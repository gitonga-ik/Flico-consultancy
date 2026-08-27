"use client";

import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createOrder } from "@/utils/actions";
import { BookInfo } from "@/utils/interfaces";
import { SubmitButton } from "@/app/components/FormFields";

const BookDetails = ({ book }: BookInfo) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim()))
      setError("Provide a valid email address.");

    const result = await createOrder(book, email);

    if (!result) setError("Please try again");
    setMessage("Payment link sent successfully");
    setLoading(false);
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
                  <div className="modal-box max-w-md rounded-2xl bg-white p-0 shadow-xl">
                    {error ? (
                      /* Error state */
                      <div className="p-6">
                        <div
                          role="alert"
                          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mt-0.5 h-6 w-6 shrink-0 stroke-current"
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

                          <span className="text-sm font-medium">{error}</span>
                        </div>

                        <div className="modal-action mt-6">
                          <button
                            type="button"
                            onClick={() =>
                              (
                                document.getElementById(
                                  "purchase-email-modal",
                                ) as HTMLDialogElement | null
                              )?.close()
                            }
                            className="btn btn-ghost rounded-xl text-slate-600 hover:bg-slate-100"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ) : message ? (
                      /* Success state */
                      <div className="p-8 text-center">
                        {/* Success icon */}
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#a3d3d0]/25">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a3d3d0]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Heading */}
                        <h3 className="mt-6 text-2xl font-bold text-slate-800">
                          Payment Link Sent!
                        </h3>

                        {/* Message */}
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          {message}
                        </p>

                        {/* Additional information */}
                        <div className="mt-6 rounded-xl bg-[#a3d3d0]/10 px-4 py-3 text-left">
                          <p className="text-sm font-medium text-slate-700">
                            Check your inbox
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            We&apos;ve sent the payment link to your email
                            address. Follow the link to complete your purchase
                            securely.
                          </p>
                        </div>

                        {/* Close */}
                        <div className="mt-7">
                          <button
                            type="button"
                            onClick={() =>
                              (
                                document.getElementById(
                                  "purchase-email-modal",
                                ) as HTMLDialogElement | null
                              )?.close()
                            }
                            className="btn w-full rounded-xl border-0 bg-[#a3d3d0] text-slate-800 hover:bg-[#8fc5c1]"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Purchase form */
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-800">
                          Complete Your Purchase
                        </h3>

                        <p className="py-4 text-sm leading-relaxed text-slate-500">
                          Please enter a valid, active email address below. We
                          will use this email to send your secure payment link
                          and deliver your book download instantly once payment
                          is complete.
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
                              className="input input-bordered w-full rounded-xl focus:border-[#3674a3] focus:outline-none"
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

                            <SubmitButton loading={loading}>
                              Get Payment Link
                            </SubmitButton>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Click backdrop to close */}
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
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
