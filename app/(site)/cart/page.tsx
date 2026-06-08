import CartArea from "@/components/cart/CartArea";

export const metadata = {
  title: "Shopping Cart | Norex Fashion",
  description: "Review your selected premium fashion pieces.",
};

export default function CartPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <CartArea />
    </div>
  );
}