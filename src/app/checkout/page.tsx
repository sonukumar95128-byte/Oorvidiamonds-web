"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { dummyProducts, formatRupee, priceToNumber } from "@/lib/dummy-images";
import { useCart } from "@/lib/cart-store";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const countryCodes = ["+91", "+1", "+44", "+971", "+65"];
const countries = ["India", "United States", "United Kingdom", "United Arab Emirates", "Singapore"];

type Address = {
  fullName: string;
  countryCode: string;
  phone: string;
  line1: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

const emptyAddress: Address = {
  fullName: "",
  countryCode: "+91",
  phone: "",
  line1: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CheckoutPage() {
  const { items: cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [payError, setPayError] = useState("");
  const orderSavedRef = useRef(false);
  const orderIdRef = useRef<string | null>(null);

  const cartItems = cart
    .map((line) => {
      const product = dummyProducts.find((p) => p.slug === line.slug);
      return product ? { product, quantity: line.quantity } : null;
    })
    .filter((i): i is NonNullable<typeof i> => !!i);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + priceToNumber(i.product.price) * i.quantity, 0),
    [cartItems]
  );
  const discount = cartItems.length > 0 ? 1200 : 0;
  const total = subtotal - discount;

  const addressValid =
    address.fullName && address.phone && address.line1 && address.city && address.state && address.pincode;

  // Save order to DB once when moving to step 2
  const saveOrder = async () => {
    if (orderSavedRef.current) return;
    orderSavedRef.current = true;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: address.fullName,
          phone: `${address.countryCode} ${address.phone}`,
          address: `${address.line1}${address.landmark ? `, near ${address.landmark}` : ""}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country}`,
          items: cartItems.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: priceToNumber(i.product.price),
          })),
          total,
        }),
      });
      const data = await res.json();
      if (data.orderId) {
        setOrderId(data.orderId);
        orderIdRef.current = data.orderId;
      }
    } catch {
      // silently ignore — order capture optional
    }
  };

  const handlePayWithRazorpay = async () => {
    setPayError("");
    setPlacing(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) {
        setPayError("Couldn't load the payment gateway. Check your connection and try again.");
        setPlacing(false);
        return;
      }

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInPaise: total * 100, receipt: orderIdRef.current ?? undefined }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setPayError(orderData.error === "Razorpay not configured"
          ? "Online payment isn't set up yet — please contact us to complete your order."
          : "Couldn't start payment. Please try again.");
        setPlacing(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Oorvi Diamonds",
        description: `${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`,
        prefill: {
          name: address.fullName,
          contact: `${address.countryCode}${address.phone}`,
        },
        theme: { color: "#40080D" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, orderId: orderIdRef.current }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.ok) {
              clearCart();
              setPlaced(true);
            } else {
              setPayError("Payment could not be verified. If money was deducted, please contact us with your payment ID.");
            }
          } catch {
            setPayError("Payment could not be verified. If money was deducted, please contact us with your payment ID.");
          }
          setPlacing(false);
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });
      razorpay.open();
    } catch {
      setPayError("Something went wrong starting payment. Please try again.");
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gold-light/30 text-3xl text-gold">✓</div>
        <h1 className="font-heading italic text-3xl text-brand mb-2">Order placed!</h1>
        <p className="text-ink/60 text-sm mb-1">Thank you, {address.fullName}!</p>
        <p className="text-ink/60 text-sm">Our team will confirm your order and delivery within 24 hours.</p>
        {orderId && <p className="mt-3 text-xs text-ink/40">Order ID: {orderId}</p>}
        <Link href="/jewellery" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <p className="text-ink/60 mb-4">Your bag is empty — add something before checking out.</p>
        <Link href="/jewellery" className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading italic text-3xl text-brand">Checkout</h1>
        <span className="flex items-center gap-1.5 text-xs text-ink/50">🔒 Secure checkout</span>
      </div>

      <div className="mb-8">
        <CheckoutStepper current={step} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1 — Address */}
          {step === 1 && (
            <div>
              <h2 className="text-sm font-medium text-brand mb-3">Shipping address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  placeholder="Full name"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <div className="flex gap-2">
                  <select
                    value={address.countryCode}
                    onChange={(e) => setAddress({ ...address, countryCode: e.target.value })}
                    className="rounded-lg border border-beige px-2 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {countryCodes.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    placeholder="Mobile number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="flex-1 rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <input
                  placeholder="Address line (house no., street, area)"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className="sm:col-span-2 rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="Nearby landmark (optional)"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className="sm:col-span-2 rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <select
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button
                disabled={!addressValid}
                onClick={async () => { await saveOrder(); setStep(2); }}
                className="mt-5 rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue to payment →
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div>
              <h2 className="text-sm font-medium text-brand mb-1">Payment</h2>
              <p className="text-xs text-ink/50 mb-5">Pay securely by card, UPI, netbanking, or wallet via Razorpay</p>

              <div className="rounded-xl border border-beige bg-white p-6 max-w-sm">
                <p className="text-xs text-ink/50 mb-1">Amount to pay</p>
                <p className="text-2xl font-semibold text-brand mb-5">{formatRupee(total)}</p>

                <button
                  onClick={handlePayWithRazorpay}
                  disabled={placing}
                  className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-gold-light hover:bg-brand-secondary disabled:opacity-60 transition-colors"
                >
                  {placing ? "Opening payment…" : `Pay ${formatRupee(total)} securely`}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink/40">🔒 Powered by Razorpay</p>
              </div>

              {payError && (
                <p className="mt-4 max-w-sm rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {payError}
                </p>
              )}

              <button
                onClick={() => setStep(1)}
                className="mt-5 rounded-full border border-beige px-6 py-3 text-sm text-ink/70 hover:border-gold transition-colors"
              >
                ← Back
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="rounded-xl border border-beige p-5 h-fit">
          <p className="text-sm font-medium text-brand mb-3">{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</p>
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item.product.slug} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-beige border border-beige">
                  <Image src={item.product.image} alt={item.product.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-ink/50">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-brand shrink-0">
                  {formatRupee(priceToNumber(item.product.price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <dl className="space-y-2 text-sm border-t border-beige pt-3">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="text-ink/80">{formatRupee(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-gold">
              <dt>Discount</dt>
              <dd>− {formatRupee(discount)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-brand border-t border-beige pt-2 mt-2">
              <dt>Total</dt>
              <dd className="text-lg">{formatRupee(total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
