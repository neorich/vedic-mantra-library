import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Vedic Mantras | Sacred Sanskrit Chants",
  description: "Explore the largest library of ancient Sanskrit mantras with translations, benefits, and interactive jaap counting.",
  openGraph: {
    title: "Vedic Mantras | Sacred Sanskrit Chants",
    description: "Explore the largest library of ancient Sanskrit mantras with translations, benefits, and interactive jaap counting.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vedic-mantra-library-neorich.netlify.app',
    siteName: 'Vedic Mantras',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vedic Mantras | Sacred Sanskrit Chants',
    description: 'Explore the largest library of ancient Sanskrit mantras with translations, benefits, and interactive jaap counting.',
    images: ['/og.png'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vedic-mantra-library-neorich.netlify.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9182214608135331"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${cinzel.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/50 via-background to-background dark:from-orange-950/20" />
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
