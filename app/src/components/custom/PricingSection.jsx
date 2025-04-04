// src/components/PricingSection.jsx
import React from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { cn } from "../../lib/utils"; // *** IMPORT cn UTILITY ***


// Checkmark Icon Component
const CheckIcon = ({ className }) => (
  <svg
    // Use cn to merge default size/styles with passed className
    className={cn(
      "flex-shrink-0 mr-3 h-6 w-6 text-green-500", // Base styles (size, margin, default color)
      className // Styles passed via props (like text-primary)
    )}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Cross Icon Component (FIXED)
const CrossIcon = ({ className }) => (
  <svg
    // Use cn to merge default size/styles with passed className
    className={cn(
      "flex-shrink-0 mr-3 h-6 w-6 text-muted-foreground/60", // Base styles (size, margin, default color)
      className // Styles passed via props
    )}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Feature Item Component
const FeatureItem = ({ included = true, children }) => (
  <li className={`flex items-center ${!included ? 'text-muted-foreground/80' : ''}`}>
    {/* Pass specific class for included checkmark color */}
    {included ? <CheckIcon className="text-primary" /> : <CrossIcon />}
    <span>{children}</span>
  </li>
);
// --- End Helper Components ---


// --- Pricing Plan Data ---
const freePlan = {
  name: "Free",
  description: "Essential analysis to get you started.",
  price: "₹0",
  frequency: "/ forever",
  cta: "Get Started Free",
  ctaHref: "#upload-section", // Link to your upload section
  features: [
    { text: "1 Resume Analysis", included: true },
    { text: "Basic Keyword & Clarity Feedback", included: true },
    { text: "Overall Score", included: true },
    { text: "Job Description Matching", included: false },
    { text: "In-depth Skill Gap Analysis", included: false },
  ],
};

const premiumPlan = {
  name: "Premium",
  description: "Unlock the full suite of tools for maximum impact.",
  price: "₹XX", 
  frequency: "/ month",
  comingSoon: true,
  cta: "Get Notified When Launched",
  ctaHref: "#", 
  popular: true,
  features: [
    { text: <strong className="font-semibold text-foreground">Everything in Free, plus:</strong>, included: true }, // Use JSX here
    { text: "Unlimited Resume Analyses", included: true },
    { text: "Detailed Job Description Matching", included: true },
    { text: "In-depth Skill Gap Analysis & Recommendations", included: true },
    { text: "Advanced Formatting & Structure Checks", included: true },
    { text: "Access to Interview Prep Resources", included: true },
    { text: "Priority Support", included: true },
  ],
};
// --- End Pricing Plan Data ---


export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-gradient-to-b from-primary/5 via-background/50 to-muted/40">
      {/* Gradient adjusted for theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
            Choose the Plan That's Right for You
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Start optimizing for free, or unlock advanced features with Premium when you're ready.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* --- Free Plan Card --- */}
          <Card className="flex flex-col h-full shadow-lg rounded-xl overflow-hidden"> {/* Use Card, flex, full height */}
            <CardHeader className="p-6 sm:p-8">
              <CardTitle className="text-2xl font-semibold text-foreground">{freePlan.name}</CardTitle>
              <CardDescription className="mt-1 h-10">{freePlan.description}</CardDescription> {/* Added height for alignment */}
            </CardHeader>
            <CardContent className="p-6 sm:p-8 pt-0 flex-grow flex flex-col"> {/* Grow content area */}
              {/* Price */}
              <div className="mt-2 mb-6">
                <span className="text-5xl font-extrabold text-foreground">{freePlan.price}</span>
                <span className="text-base font-medium text-muted-foreground">{freePlan.frequency}</span>
              </div>
              {/* CTA Button */}
              <Button variant="outline" size="lg" className="w-full mt-auto" asChild>
                 {/* outline variant, full width, push to bottom */}
                <a href={freePlan.ctaHref}>
                  {freePlan.cta}
                </a>
              </Button>
              {/* Features List */}
              <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                {freePlan.features.map((feature, index) => (
                  // Using custom FeatureItem component for check/cross logic
                  <FeatureItem key={index} included={feature.included}>
                    {feature.text}
                  </FeatureItem>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* --- Premium Plan Card --- */}
          <Card className="relative flex flex-col h-full shadow-2xl rounded-xl overflow-hidden border-2 border-primary">
            {/* Highlighted border, relative positioning for badge */}
            {premiumPlan.popular && (
              <Badge // Using shadcn Badge component
                className="absolute top-3 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-semibold tracking-wide uppercase"
                // Default variant likely works (primary bg/fg), or set variant="default"
              >
                Most Popular
              </Badge>
            )}
            <CardHeader className="p-6 sm:p-8">
              <CardTitle className="text-2xl font-semibold text-primary">{premiumPlan.name}</CardTitle>
              <CardDescription className="mt-1 h-10">{premiumPlan.description}</CardDescription> {/* Added height */}
            </CardHeader>
            <CardContent className="p-6 sm:p-8 pt-0 flex-grow flex flex-col">
              {/* Price */}
              <div className="mt-2 mb-6">
                <span className="text-5xl font-extrabold text-foreground">{premiumPlan.price}</span>
                <span className="text-base font-medium text-muted-foreground">{premiumPlan.frequency}</span>
                {premiumPlan.comingSoon && (
                  <p className="text-sm text-primary font-medium mt-1">(Coming Soon!)</p>
                )}
              </div>
              {/* CTA Button */}
              <Button size="lg" className="w-full mt-auto" asChild>
                {/* Default variant (primary bg), full width, push to bottom */}
                <a href={premiumPlan.ctaHref}>
                  {premiumPlan.cta}
                </a>
              </Button>
              {/* Features List */}
              <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                 {/* Map over features using FeatureItem */}
                 {premiumPlan.features.map((feature, index) => (
                  <FeatureItem key={index} included={feature.included}>
                    {feature.text}
                  </FeatureItem>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-12 text-muted-foreground">
          Need enterprise solutions for universities or career centers?{' '}
          <a href="#" className="font-medium text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded">
            Contact Sales
          </a>
        </p>
      </div>
    </section>
  );
}