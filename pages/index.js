import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import WeddingInviteBook from "../components/WeddingInviteBook";
<link
  href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script:wght@400;700&display=swap"
  rel="stylesheet"
></link>;
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
