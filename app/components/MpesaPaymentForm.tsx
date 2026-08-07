"use client"

import {CheckCircle2, Loader2, XCircle} from "lucide-react";
import React, {SyntheticEvent, useState} from "react";

type PaymentResult = "idle" | "submitting" | "error" | "success";

async function processMpesaPayment(phone: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Simple stand-in rule so both states are reachable while testing the UI:
    // numbers ending in an even digit "succeed", odd digit "fail".
    const lastDigit = phone.trim().slice(-1);
    return Number(lastDigit) % 2 === 0;
}

export default function MpesaForm({ onSuccess }: { onSuccess: () => void }) {
    const [phone, setPhone] = useState("");
    const [result, setResult] = useState<PaymentResult>("idle");

    async function handleSubmit(event: SyntheticEvent) {
        event.preventDefault();
        if (!phone.trim()) return;

        setResult("submitting");
        const ok = await processMpesaPayment(phone);

        if (ok) {
            setResult("success");
            // brief pause so the success state is visible before advancing
            setTimeout(onSuccess, 900);
        } else {
            setResult("error");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text">M-Pesa phone number</span>
                </div>
                <input
                    type="tel"
                    inputMode="tel"
                    placeholder="07XX XXX XXX"
                    className="input input-bordered w-full"
                    value={phone}
                    onChange={(e) => {
                        setPhone(e.target.value);
                        if (result === "error" || result === "success") setResult("idle");
                    }}
                    disabled={result === "submitting" || result === "success"}
                    required
                />
            </label>

            {result === "error" && (
                <div className="alert alert-error py-2">
                    <XCircle className="h-5 w-5 shrink-0" />
                    <span className="text-sm">
            We couldn&apos;t reach that number. Check it and try again.
          </span>
                </div>
            )}

            {result === "success" && (
                <div className="alert alert-success py-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-sm">Payment confirmed. Redirecting…</span>
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary"
                disabled={result === "submitting" || result === "success"}
            >
                {result === "submitting" ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing…
                    </>
                ) : (
                    "Pay with M-Pesa"
                )}
            </button>
        </form>
    );
}