import type { Metadata } from "next";
// import favicon from "./favicon.ico";

import "./globals.css";

export const metadata: Metadata = {
  title: "ARTventure",
  description: "Organize your art events",
  icons: {
    icon: '/icon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background-50"
      >
        
        {children}
      </body>
    </html>
  );
}
