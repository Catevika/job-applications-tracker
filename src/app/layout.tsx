import "@/app/globals.css";
import ClerkHeader from '@/components/ClerkHeader';
import TanStackProvider from '@/components/providers/TanStack-Provider';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description: "Job Application Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} appearance={{
      baseTheme: dark,
      variables: {
        colorPrimary: "hsl(223, 48%, 11%)",
        colorText: "hsl(210, 40%, 98%)",
      }
    }}>
      <html lang="en">
        <body
          className={`${notoSans.variable} ${notoMono.variable} antialiased relative`}
        >
          <ClerkHeader />
          <TanStackProvider>
            <main className='mt-37 md:mt-16'>{children}</main>
          </TanStackProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
