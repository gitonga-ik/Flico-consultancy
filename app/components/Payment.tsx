import React, {useState} from "react";
import {MpesaLogo, VisaComingSoon, VisaLogo} from "@/app/components/PaymentLogos";
import MpesaForm from "@/app/components/MpesaPaymentForm";

type PaymentMethod = "mpesa" | "visa";

export default function PaymentStep({onSuccess}: { onSuccess: () => void }) {
    const [method, setMethod] = useState<PaymentMethod>("mpesa");

    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body gap-6">
                <h2 className="card-title text-xl">Choose a payment method</h2>

                <div className="flex flex-col gap-3">
                    <PaymentOption
                        id="mpesa"
                        selected={method === "mpesa"}
                        onSelect={() => setMethod("mpesa")}
                        label="M-Pesa"
                        logo={<MpesaLogo/>}
                    />
                    <PaymentOption
                        id="visa"
                        selected={method === "visa"}
                        onSelect={() => setMethod("visa")}
                        label="Visa"
                        logo={<VisaLogo/>}
                    />
                </div>

                <div className="pt-2">
                    {method === "mpesa" ? (
                        <MpesaForm onSuccess={onSuccess}/>
                    ) : (
                        <VisaComingSoon/>
                    )}
                </div>
            </div>
        </div>
    );
}

function PaymentOption({
                           id,
                           selected,
                           onSelect,
                           label,
                           logo,
                       }: {
    id: string;
    selected: boolean;
    onSelect: () => void;
    label: string;
    logo: React.ReactNode;
}) {
    return (
        <label
            htmlFor={id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                selected
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-base-content/30"
            }`}
        >
            <div className="flex items-center gap-3">
                {logo}
                <span className="font-medium">{label}</span>
            </div>
            <input
                id={id}
                type="radio"
                name="payment-method"
                className="radio radio-primary"
                checked={selected}
                onChange={onSelect}
            />
        </label>
    );
}