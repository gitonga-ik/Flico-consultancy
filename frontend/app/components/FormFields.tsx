import React, {
    ReactNode,
    InputHTMLAttributes,
    TextareaHTMLAttributes,
    SelectHTMLAttributes,
    ButtonHTMLAttributes
} from "react";

interface FieldProps {
    label: string;
    error?: string | null;
    children: ReactNode;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
    className?: string;
}

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    loading?: boolean;
}

interface CardProps {
    children: ReactNode;
    className?: string;
}

interface SectionTitleProps {
    children: ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#555]">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
    );
}

export function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            className={`w-full border border-[#d6cfc5] rounded-lg px-4 py-2.5 text-sm
        bg-white text-[#2b2b2b] placeholder-[#bbb]
        focus:outline-none focus:ring-2 focus:ring-[#6fe3dc] focus:border-transparent
        transition ${className}`}
            {...props}
        />
    );
}

export function Textarea({ className = "", ...props }: TextareaProps) {
    return (
        <textarea
            rows={4}
            className={`w-full border border-[#d6cfc5] rounded-lg px-4 py-2.5 text-sm
        bg-white text-[#2b2b2b] placeholder-[#bbb] resize-y
        focus:outline-none focus:ring-2 focus:ring-[#6fe3dc] focus:border-transparent
        transition ${className}`}
            {...props}
        />
    );
}

export function Select({ children, className = "", ...props }: SelectProps) {
    return (
        <select
            className={`w-full border border-[#d6cfc5] rounded-lg px-4 py-2.5 text-sm
        bg-white text-[#2b2b2b]
        focus:outline-none focus:ring-2 focus:ring-[#6fe3dc] focus:border-transparent
        transition ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export function SubmitButton({ children, loading = false, ...props }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#abdbd8] text-white
        px-7 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider
        hover:bg-[#6fe3dc] transition-colors duration-200
        disabled:opacity-60 disabled:cursor-not-allowed"
            {...props}
        >
            {loading ? (
                <>
                    <span className="loading loading-spinner loading-xl"></span>
                    Saving…
                </>
            ) : (
                children
            )}
        </button>
    );
}

export function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`bg-white rounded-2xl border border-[#e8e0d5] p-6 md:p-8 ${className}`}>
            {children}
        </div>
    );
}

export function SectionTitle({ children }: SectionTitleProps) {
    return (
        <h2 className="font-playfair text-2xl font-semibold text-[#2b2b2b] mb-6">
            {children}
        </h2>
    );
}