"use client";

import { OrderDetails } from "@/utils/interfaces";
import { getTransactionStatus } from "@/utils/mpesa";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";

type PaymentResult = "idle" | "submitting" | "error" | "success";

interface MpesaPaymentProps {
  onSuccess: () => void;
  order: OrderDetails;
}

interface MpesaResponse {
  message: string;
  transactionId?: string;
}

async function processMpesaPayment(
  phone: string,
  orderId: string,
  amount: number,
): Promise<
  | {
      success: true;
      message: string;
      transactionId: string;
    }
  | {
      success: false;
      message: string;
    }
> {
  try {
    console.log(phone);
    const response = await fetch("/mpesa/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        id: orderId,
        amount,
      }),
    });

    const data: MpesaResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "We couldn't initiate the M-Pesa payment.",
      };
    }

    if (!data.transactionId) {
      return {
        success: false,
        message: "Payment was initiated but no transaction ID was returned.",
      };
    }

    return {
      success: true,
      message: data.message,
      transactionId: data.transactionId,
    };
  } catch {
    return {
      success: false,
      message: "We couldn't reach the payment service. Please try again.",
    };
  }
}

async function pollTransactionStatus(
  transactionId: string,
): Promise<string | null> {
  try {
    const status = await getTransactionStatus(transactionId);

    if (!status) return null;

    return status;
  } catch {
    return null;
  }
}

export default function MpesaForm({ onSuccess, order }: MpesaPaymentProps) {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<PaymentResult>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const POLLING_INTERVAL = 8000;
  const MAX_POLL_ATTEMPTS = 6;
  const REFRESH_DELAY = 5000;

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef(0);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPolling = (transactionId: string) => {
    stopPolling();

    pollCountRef.current = 0;

    pollingRef.current = setInterval(async () => {
      pollCountRef.current += 1;

      const status = await pollTransactionStatus(transactionId);

      // If the status request itself failed, don't count it
      // as a transaction failure. Try again on the next poll.
      if (!status) {
        return;
      }

      if (status === "COMPLETED") {
        stopPolling();

        setResult("success");
        setMessage("Payment confirmed.");

        setTimeout(() => {
          onSuccess();
        }, 900);

        return;
      }

      // If the transaction has reached a known non-success state,
      // stop immediately and refresh after displaying the failure.
      if (
        status === "FAILED" ||
        status === "CANCELLED" ||
        status === "EXPIRED"
      ) {
        stopPolling();

        setResult("error");
        setMessage("Your M-Pesa payment could not be completed.");

        setTimeout(() => {
          window.location.reload();
        }, REFRESH_DELAY);

        return;
      }

      // If we've used all six attempts without COMPLETED,
      // consider the transaction failed/timed out.
      if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
        stopPolling();

        setResult("error");
        setMessage(
          "We couldn't confirm your M-Pesa payment. The transaction has timed out.",
        );

        setTimeout(() => {
          window.location.reload();
        }, REFRESH_DELAY);
      }
    }, POLLING_INTERVAL);
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (!phone.trim() || result === "submitting" || result === "success") {
      return;
    }

    setResult("submitting");
    setMessage(null);

    const response = await processMpesaPayment(
      `254${phone}`,
      order.id,
      order.book.price,
    );

    if (!response.success) {
      setResult("error");
      setMessage(response.message);
      return;
    }

    // Payment request was successfully initiated.
    setMessage(response.message);
    setResult("success");

    // Start the 6 × 8-second polling cycle.
    startPolling(response.transactionId);
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">M-Pesa phone number</span>
        </div>

        {/* Phone input */}
        <div className="input input-bordered flex w-full items-center gap-2 px-3">
          <span className="shrink-0 text-base-content/60">+254</span>

          <input
            type="tel"
            inputMode="tel"
            placeholder="7XX XXX XXX"
            className="min-w-0 flex-1 bg-transparent outline-none"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);

              if (result === "error" || result === "success") {
                setResult("idle");
                setMessage(null);
              }
            }}
            disabled={result === "submitting" || result === "success"}
            required
          />
        </div>
      </label>

      {/* Error banner */}
      {result === "error" && message && (
        <div role="alert" className="alert alert-error py-2">
          <XCircle className="h-5 w-5 shrink-0" />

          <span className="text-sm">{message}</span>
        </div>
      )}

      {/* Success / processing banner */}
      {result === "success" && message && (
        <div role="status" className="alert alert-success py-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <span className="text-sm">{message}</span>
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
        ) : result === "success" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Waiting for payment…
          </>
        ) : (
          "Pay with M-Pesa"
        )}
      </button>
    </form>
  );
}
