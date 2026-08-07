"use client";

import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import {
  Field,
  Input,
  SubmitButton,
  Textarea,
} from "@/app/components/FormFields";
import { useRouter } from "next/navigation";
import { recordBook } from "@/utils/actions";
import imageCompression from "browser-image-compression";
import { BookData } from "@/utils/interfaces";
import { booksCreateInput } from "@/generated/prisma/models/books";
import { supaClient } from "@/utils/supabase";
import { generatePreviews, uploadCover } from "@/utils/uploads";
interface FormErrors {
  title: string | null;
  price: string | null;
  description: string | null;
  doc: string | null;
  form: string | null;
  img: string | null;
}

const Page = () => {
  const router = useRouter();
  const [form, setForm] = useState<BookData>({
    title: "",
    price: "",
    description: "",
  });
  const [doc, setDoc] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    description: null,
    form: null,
    price: null,
    doc: null,
    title: null,
    img: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [img, setImg] = useState<File | null>(null);

function getStorage() {
  const { storage } = supaClient();
  return storage;
}

  function clearErrors(prev: FormErrors): FormErrors {
    return Object.fromEntries(
      Object.keys(prev).map((key) => [key, null]),
    ) as unknown as FormErrors;
  }

  function validate(): boolean {
    setErrors(clearErrors);
    if (!doc) {
      setErrors((previous) => ({
        ...previous,
        doc: "Provide document for upload.",
      }));
      return false;
    }
    return true;
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous: FormErrors) => ({
      ...previous,
      [name]: null,
    }));
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImg(file);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setDoc(file);
  }

  async function uploadDoc(doc: File | null): Promise<string | false> {
  if (!doc) return false

  try {
    // 1. Ensure title exists and fallback if empty
    const rawTitle = form?.title || doc.name.split('.')[0] || 'untitled'

    // 2. Extract file extension cleanly
    const fileExtension = doc.name.substring(doc.name.lastIndexOf('.')).toLowerCase()

    // 3. Sanitize filename
    const filename = rawTitle
      .trim()
      .toLowerCase()
      .replace(/[/\\?%*:|"<>]/g, '')
      .replace(/\s+/g, '_')
      .replace(/^_+|_+$/g, '')

    const filepath = `docs/${filename}${fileExtension}`

    // 4. Convert browser File to ArrayBuffer
    const docBuffer = await doc.arrayBuffer()

    const storage = getStorage()

    // 5. Upload to Supabase Storage
    const { data, error } = await storage
      .from("docs")
      .upload(filepath, docBuffer, {
        contentType: doc.type,
        upsert: true,
      })

    if (error) {
      console.error("Supabase Storage Upload Error:", error.message)
      throw error
    }

    // 6. Retrieve public URL
    const { data: urlData } = storage.from("docs").getPublicUrl(filepath)
    return urlData.publicUrl

  } catch (error) {
    console.error("Failed to upload document:", error)
    return false
  }
}

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (!img) return;

      const compressedImage = await imageCompression(img, {
        maxSizeMB: 1,
        useWebWorker: true,
      });

      const previewUrls: string[] | false = await generatePreviews(form.title, doc);
      const coverUrl: string | false = await uploadCover(compressedImage);
      const docUrl: string | false = await uploadDoc(doc);

      if (!previewUrls || !coverUrl || !docUrl) throw new Error();

      const book: booksCreateInput = {
        TITLE: form.title.trim(),
        DESCRIPTION: form.description.trim(),
        PRICE: Number(form.price),
        SLUG: form.title.trim().toLowerCase().replaceAll(" ", "_"),
        FILE_PATH: docUrl,
        COVER_PATH: coverUrl,
        PREVIEW_PATH: previewUrls,
      };

      const uploadRes = await recordBook(book);
      if (!uploadRes) {
        setErrors((previous) => ({
          ...previous,
          doc: "Unable to upload document.",
        }));
      }
      router.refresh();
      router.push(`/books/${uploadRes}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload book";
      setErrors((previous) => ({
        ...previous,
        form: message,
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="books"
      className="py-15 px-5 scroll-mt-16 min-h-150 flex flex-col items-center justify-center"
    >
      <h2 className="text-center text-[#164d77] text-3xl font-semibold mb-5">
        Book Upload
      </h2>
      <div className="container mx-auto max-w-6xl flex justify-center">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors?.form && (
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
              <span>{errors.form}</span>
            </div>
          )}
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
            <legend className="fieldset-legend text-xl">BOOK DETAILS</legend>

            <Field label="Title" error={errors.title}>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Add book title"
                required
              />
            </Field>

            <Field label="Price" error={errors.price}>
              <Input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="1000"
                min="1"
                required
              />
            </Field>

            <Field label="Description" error={errors.description}>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Add book description"
                required
              />
            </Field>

            <Field label={"Document"} error={errors.doc}>
              <input
                name="doc"
                type="file"
                className="file-input flex flex-col items-center justify-center w-full h-10
                            border-2 border-dashed border-[#abdbd8] rounded-xl
                            cursor-pointer bg-[#d0f5f3]
                            hover:border-[#a3d3d0] hover:bg-[#abdbd8]
                            transition-colors duration-200 overflow-hidden relative"
                accept=".pdf, .docx"
                onChange={handleFile}
              />
            </Field>

            <Field label={"Cover Image"} error={errors.img}>
              <input
                name="img"
                type="file"
                className="file-input flex flex-col items-center justify-center w-full h-10
                            border-2 border-dashed border-[#abdbd8] rounded-xl
                            cursor-pointer bg-[#d0f5f3]
                            hover:border-[#a3d3d0] hover:bg-[#abdbd8]
                            transition-colors duration-200 overflow-hidden relative"
                accept="image/*"
                onChange={handleImage}
              />
            </Field>

            <div className="flex items-center gap-3 pt-2">
              <SubmitButton loading={loading}>{"Upload book"}</SubmitButton>
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm text-[#888] hover:text-[#2b2b2b] transition-colors bg-transparent border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
};

export default Page;
