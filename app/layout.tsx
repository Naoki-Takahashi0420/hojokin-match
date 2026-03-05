import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "補助金マッチングAI | 最適な補助金を即座に診断",
  description:
    "企業情報を入力するだけで、AIが最適な補助金・助成金をスコアリングします。申請書の下書きも自動生成。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
