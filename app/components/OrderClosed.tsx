import { ArrowLeft, Clock3, ShoppingBag } from "lucide-react";
import Link from "next/link";

type ClosedOrderPageProps = {
  orderId?: string;
};

export default function ClosedOrderPage({ orderId }: ClosedOrderPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#a3d3d0]/50 bg-white p-8 text-center shadow-[0_12px_40px_rgba(163,211,208,0.18)] sm:p-10">
            {/* Decorative top accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#a3d3d0]" />

            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#a3d3d0]/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a3d3d0]/30">
                <Clock3 className="h-7 w-7 text-[#5f9f9b]" />
              </div>
            </div>

            {/* Content */}
            <div className="mt-7">
              <p className="text-sm font-medium uppercase tracking-wider text-[#5f9f9b]">
                Checkout unavailable
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                This order has been closed
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                This order is no longer available for checkout. It may have
                already been completed, cancelled, or expired.
              </p>
            </div>

            {/* Order reference */}
            {orderId && (
              <div className="mt-7 rounded-xl border border-[#a3d3d0]/40 bg-[#a3d3d0]/10 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Order reference
                </p>

                <p className="mt-1 font-mono text-sm font-semibold text-gray-800">
                  {orderId}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:border-[#a3d3d0] hover:bg-[#a3d3d0]/10 focus:outline-none focus:ring-2 focus:ring-[#a3d3d0]/50"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>

              <Link
                href="/books"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#a3d3d0] px-5 text-sm font-semibold text-gray-800 transition hover:bg-[#8fc5c1] focus:outline-none focus:ring-2 focus:ring-[#a3d3d0]/50"
              >
                <ShoppingBag className="h-4 w-4" />
                Back to Catalogue
              </Link>
            </div>
          </div>

          {/* Small footer message */}
          <p className="mt-6 text-center text-xs text-gray-400">
            If you believe this order should still be available, please contact
            support.
          </p>
        </div>
      </div>
    </main>
  );
}
