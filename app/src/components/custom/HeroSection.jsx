// src/components/HeroSection.tsx (or similar path)
import React from 'react';
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight } from 'lucide-react'; // Import icon

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-36 sm:pt-36 sm:pb-48 text-center
                       bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Note: Adjusted gradient to use theme colors (primary/secondary/background) for better compatibility.
          You can customize this in tailwind.config.js if you need specific colors like indigo. */}

      {/* Decorative Background Shapes */}
      <div
        className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 opacity-30 mix-blend-multiply filter blur-3xl pointer-events-none"
        aria-hidden="true"
      >
        {/* Adjusted opacity/colors slightly for theme */}
        <div className="w-96 h-96 bg-gradient-to-tr from-primary/50 to-violet-300 rounded-full"></div>
        {/* Assuming 'violet-300' is defined or change it */}
      </div>
      <div
        className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-20 mix-blend-multiply filter blur-3xl pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[40rem] h-[40rem] bg-gradient-to-tl from-indigo-200/50 to-primary/30 rounded-full"></div>
         {/* Assuming 'indigo-200' is defined or change it */}
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Using shadcn Badge component */}
        <Badge
          variant="secondary" // 'secondary' or 'outline' often work well for subtle badges
          className="mb-5 shadow-sm font-semibold tracking-wide text-xs"
          // You might need custom classes if the default variants don't match:
          // className="bg-primary/10 text-primary hover:bg-primary/20 mb-5 shadow-sm font-semibold tracking-wide text-xs"
        >
          Built by Team Delta for Your Success
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tighter leading-tight mb-6">
          Land Your Dream Job, <span className="block sm:inline">Faster Than Ever.</span>
          {/* Gradient Text Implementation */}
          <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
            {/* Adjust gradient colors (from-primary to-secondary) as needed */}
            AI-Powered Resume Analysis.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Stop the guesswork. Get instant, actionable feedback tailored to your target job. Optimize keywords, showcase skills, and impress recruiters with a resume that truly stands out.
        </p>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          {/* Primary Button using shadcn Button */}
          <Button
            size="lg" // Corresponds to larger padding
            asChild // Use asChild if wrapping a Next.js Link or React Router Link
            className="w-full sm:w-auto rounded-full font-semibold shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            {/* Replace <a> with <Link> if using a router */}
            <a href="#upload-section">
              Get Your Free Analysis
              <ArrowRight className="ml-2 h-5 w-5" /> {/* lucide-react icon */}
            </a>
          </Button>

          {/* Secondary Button using shadcn Button */}
          <Button
            variant="outline" // 'outline' gives a border and transparent background
            size="lg"
            asChild
            className="w-full sm:w-auto rounded-full font-semibold border-primary/30 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition duration-300 ease-in-out"
            // Added specific hover/border colors for closer match to original
          >
             {/* Replace <a> with <Link> if using a router */}
            <a href="#features">
              Explore Features
            </a>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground"> {/* Increased margin-top slightly */}
          Basic analysis is 100% free. No credit card needed.
        </p>
      </div>
    </section>
  );
}