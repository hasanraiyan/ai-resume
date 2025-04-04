// src/components/custom/SiteHeader.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import Link and NavLink for routing
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
import { Menu } from 'lucide-react'; // Icons for mobile menu
import { cn } from "../../lib/utils"; // cn utility for conditional classes

// Define navigation links data for easier management
// Ensure hash links start with '/' if they should always go to the home page first
const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#sample-report", label: "What You Get" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#faq", label: "FAQ" },
  { href: "/developer", label: "Developers" }, // Link to the new developer page
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Using theme variables for background, border, blur */}
      <nav className="container flex items-center h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Container for consistent padding/max-width */}

        {/* Logo Section */}
        <div className="mr-4 flex items-center">
          {/* Use Link for internal navigation to the home page */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo SVG */}
            <svg
              className="h-8 w-auto text-primary" // Use theme's primary color
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true" // Decorative icon
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            {/* Brand Name */}
            <span className="text-2xl font-bold text-primary"> {/* Use theme primary */}
              Resume<span className="font-light text-foreground/80">Analyser</span> {/* Use theme foreground */}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-1 items-center space-x-1">
          {navLinks.map((link) => (
            // Use NavLink to automatically apply active styles if desired
            <NavLink
              key={link.href}
              to={link.href} // Use 'to' prop for navigation target
              className={({ isActive }) => // Optional: Add styling for the active link
                cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-3 py-2 rounded-md",
                  isActive ? "text-primary" : "" // Example: change text color if active
                  // isActive ? "text-primary bg-accent" : "" // Example: change text and background if active
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Log in Link (assuming it goes to a separate page/modal) */}
          {/* Replace with appropriate route if/when login page exists */}
          {/* <Link to="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Log in
          </Link> */}
          {/* Primary CTA Button linking to upload section on home page */}
          <Button asChild size="sm" className="rounded-full font-semibold transition duration-200 ease-in-out transform hover:scale-105">
             {/* Use asChild to make the Button behave like the Link */}
            <Link to="/#upload-section"> {/* Ensure hash links start with '/' */}
              Analyze Resume Free
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button & Sheet (Drawer) */}
        <div className="md:hidden flex items-center ml-auto"> {/* Use ml-auto to push to the right on mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" aria-hidden="true" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col"> {/* Use flex-col for layout */}
              <SheetHeader className="mb-4">
                <SheetTitle>
                  {/* Repeat logo inside sheet header, linked to home */}
                  <SheetClose asChild>
                    <Link to="/" className="flex items-center space-x-2">
                     <svg className="h-6 w-auto text-primary" /* ... logo svg path ... */ aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                     <span className="text-xl font-bold text-primary">Resume<span className="font-light text-foreground/80">Analyser</span></span>
                    </Link>
                  </SheetClose>
                </SheetTitle>
                {/* Default close button is usually included by SheetContent */}
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <div className="flex-grow flex flex-col space-y-2 mb-4"> {/* flex-grow allows footer to stick bottom */}
                {navLinks.map((link) => (
                  // SheetClose wraps Link to close the sheet on navigation
                  <SheetClose asChild key={link.href}>
                    <Link
                      to={link.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent" // Use theme colors/accent
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              {/* Mobile Action Buttons */}
              {/* Use SheetFooter to group buttons at the bottom */}
              <SheetFooter className="flex flex-col sm:flex-col sm:justify-start sm:space-x-0 space-y-2 pt-4 border-t border-border/40 mt-auto"> {/* mt-auto pushes footer down */}
                <SheetClose asChild>
                  <Link to="/login" className="text-base font-medium text-muted-foreground hover:text-primary text-center py-2">
                    Log in
                  </Link>
                </SheetClose>
                 <SheetClose asChild>
                  <Button asChild className="w-full rounded-full font-semibold">
                    <Link to="/#upload-section">
                      Analyze Resume Free
                    </Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}