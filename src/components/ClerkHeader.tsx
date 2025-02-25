"use client";

import dynamic from "next/dynamic";

const SignedIn = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedIn), {
  ssr: false,
});
const SignedOut = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignedOut), {
  ssr: false,
});
const UserButton = dynamic(() => import("@clerk/nextjs").then((mod) => mod.UserButton), {
  ssr: false,
});

const SignInButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignInButton),
  { ssr: false }
);
const SignUpButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignUpButton),
  { ssr: false }
);


export default function ClerkHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 flex flex-col md:flex-row justify-start md:justify-between items-center max-w-[1440px] w-full mx-auto mb:mr-4 p-2">
      <h1 className='text-2xl font-bold mb:mt-0 mb-4 md:mb-0 md:text-nowrap'>Job Applications Tracker</h1>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>

  );
}
