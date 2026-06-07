import { Suspense } from "react";
import ShopArea from "@/components/shop/ShopArea";

export const metadata = {
  title: "Shop | Norex Fashion",
  description: "Browse our premium ready-to-wear fashion collections.",
};

export default function ShopPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <Suspense fallback={
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading Collection...</p>
        </div>
      }>
        <ShopArea />
      </Suspense>
    </div>
  );
}