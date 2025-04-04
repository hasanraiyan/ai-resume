// src/components/SiteHeader.tsx (or similar path)
import React from 'react';
import { Button } from '../ui/button';

import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet"; // Import Sheet components
import { Menu, X } from 'lucide-react'; // Icons for mobile menu

// Define navigation links data for easier management
const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#sample-report", label: "What You Get" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Note: Replaced specific bg-white/90, shadow, border-gray-200 with shadcn theme variables */}
      <nav className="container flex items-center h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Use container class for consistency */}
        {/* Logo */}
        <div className="mr-4 flex items-center">
          <a href="/" className="flex items-center space-x-2">
            {/* Using your exact SVG */}
            <svg
              className="h-8 w-auto text-primary" // Use theme's primary color
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="text-2xl font-bold text-primary"> {/* Use theme primary */}
              Resume<span className="font-light text-foreground/80">Analyser</span> {/* Use theme foreground */}
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center space-x-1">
          {navLinks.map((link) => (
            // Replace <a> with <Link> from your router if needed
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-3 py-2 rounded-md" // Use theme colors
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Replace <a> with <Link> from your router if needed */}
          <a href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Log in
          </a>
          {/* Use shadcn Button */}
          <Button asChild size="sm" className="rounded-full font-semibold transition duration-200 ease-in-out transform hover:scale-105">
             {/* Use asChild if the link needs router capabilities */}
            <a href="#upload-section">
              Analyze Resume Free
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button & Sheet */}
        <div className="md:hidden flex items-center ml-auto"> {/* Use ml-auto to push to the right */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]"> {/* Adjust width as needed */}
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center space-x-2">
                 {/* Optional: Repeat logo in sheet header */}
                 <svg className="h-6 w-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                 </svg>
                 <span className="text-xl font-bold text-primary">Resume<span className="font-light text-foreground/80">Analyser</span></span>
                </SheetTitle>
                {/* Optional: Add close button inside header if preferred */}
                 {/* <SheetClose asChild>
                     <Button variant="ghost" size="icon" className="absolute top-3 right-3">
                         <X className="h-5 w-5" />
                         <span className="sr-only">Close menu</span>
                     </Button>
                 </SheetClose> */}
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2 mb-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    {/* Replace <a> with <Link> from your router if needed */}
                    <a
                      href={link.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent" // Use theme colors/accent
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </div>

              {/* Mobile Action Buttons */}
              <SheetFooter className="flex flex-col sm:flex-col sm:justify-start sm:space-x-0 space-y-2 pt-4 border-t border-border/40">
                <SheetClose asChild>
                  {/* Replace <a> with <Link> from your router if needed */}
                  <a href="/login" className="text-base font-medium text-muted-foreground hover:text-primary text-center py-2">
                    Log in
                  </a>
                </SheetClose>
                 <SheetClose asChild>
                  <Button asChild className="w-full rounded-full font-semibold">
                     {/* Use asChild if the link needs router capabilities */}
                    <a href="#upload-section">
                      Analyze Resume Free
                    </a>
                  </Button>
                </SheetClose>
              </SheetFooter>
                {/* Default close button usually at top-right by SheetContent */}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}