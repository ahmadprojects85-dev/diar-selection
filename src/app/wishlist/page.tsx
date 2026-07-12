import { Metadata } from "next";
import { WishlistClient } from "./WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist | Diar Selection",
  description: "View your saved premium coffee tools and equipment.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
