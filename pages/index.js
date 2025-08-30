import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import WeddingInviteBook from "../components/WeddingInviteBook";
<div>
  <link rel="preconnect" href="https://fonts.googleapis.com"></link>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
  <link
    href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
    rel="stylesheet"
  ></link>
</div>;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return <WeddingInviteBook />;
}
