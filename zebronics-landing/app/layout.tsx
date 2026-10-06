import type { Metadata } from "next";
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kailash Electronics | Next-Gen 3D Electronics & Appliances Distributor",
  description:
    "Official Central India distributor for Zebronics, GEM, Intex, Takara, and Crockery. Experience interactive 3D WebGL product inspection, B2B wholesale pricing with GST Input Tax Credit, and 1-Click UPI checkout.",
  keywords: [
    "Kailash Electronics",
    "Zebronics Distributor",
    "GEM Appliances Wholesale",
    "Intex TV Distributor",
    "Takara Refrigerator",
    "B2B Electronics Wholesale India",
    "Jabalpur Electronics Distributor",
    "3D Ecommerce India"
  ],
  authors: [{ name: "Kailash Electronics" }],
  openGraph: {
    title: "Kailash Electronics | 3D Electronics & Appliances Distributor",
    description: "Explore audio, televisions, refrigerators, washing machines, and crockery in real-time WebGL 3D with direct distributor pricing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#050505] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
