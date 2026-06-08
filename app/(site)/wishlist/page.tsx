import WishlistArea from "@/components/wishlist/WishlistArea";

export const metadata = {
  title: "Wishlist | Norex Fashion",
  description: "Your saved premium fashion pieces.",
};

export default function WishlistPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <WishlistArea />
    </div>
  );
}