// src/pages/HomePage.jsx
import React from 'react';
import { HeroSection } from "../components/custom/HeroSection";
import { ProblemSolveSection } from "../components/custom/ProblemSolveSection";
import { HowItWorksSection } from "../components/custom/HowItWorksSection";
import { FeaturesSection } from "../components/custom/FeaturesSection";
import { SampleReportSection } from "../components/custom/SampleReportSection";
import { TestimonialsSection } from "../components/custom/TestimonialsSection";
import { PricingSection } from "../components/custom/PricingSection";
import { UploadSection } from "../components/custom/UploadSection"; // Keep Upload here for now
import { FaqSection } from "../components/custom/FaqSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSolveSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SampleReportSection />
      <TestimonialsSection />
      <PricingSection />
      {/* The Upload section triggers navigation, so it makes sense here */}
      <UploadSection />
      <FaqSection />
    </>
  );
}