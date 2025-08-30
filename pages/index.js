import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import WeddingInviteBook from "../components/WeddingInviteBook";
<div>
  <link rel="preconnect" href="https://fonts.googleapis.com"></link>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
  <link
    href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
    rel="stylesheet"
  ></link>
</div>;

export default function Home() {
  return <WeddingInviteBook />;
}
