import React, {useState} from "react";

export function MpesaLogo() {
    return (
        <div className="flex h-8 w-14 items-center justify-center rounded bg-[#4CAF3D] text-[10px] font-bold leading-none text-white">
            M-PESA
        </div>
    );
}

export function VisaLogo() {
    return (
        <div className="flex h-8 w-14 items-center justify-center rounded bg-[#1A1F71] text-xs font-bold italic leading-none text-white">
            VISA
        </div>
    );
}

export function VisaComingSoon() {
    return (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-base-300 py-8 text-center">
            <span className="badge badge-neutral">Coming soon</span>
            <p className="text-sm text-base-content/50">
                Card payments aren&apos;t available yet. Use M-Pesa for now.
            </p>
        </div>
    );
}
