import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Talkify",
  description: "A end to end chat application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
