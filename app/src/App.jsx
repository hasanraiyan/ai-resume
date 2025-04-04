import { SiteHeader } from "./components/custom/Header";
import { HeroSection } from "./components/custom/HeroSection";
import { ProblemSolveSection } from "./components/custom/ProblemSolveSection";
import { HowItWorksSection } from "./components/custom/HowItWorksSection";
import { FeaturesSection } from "./components/custom/FeaturesSection";
import { SampleReportSection } from "./components/custom/SampleReportSection"
import { TestimonialsSection } from "./components/custom/TestimonialsSection";
import { PricingSection } from "./components/custom/PricingSection";
import { UploadSection } from "./components/custom/UploadSection";
import { FaqSection } from "./components/custom/FaqSection";
import { Footer } from "./components/custom/Footer";

export default function App() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <ProblemSolveSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SampleReportSection />
      <TestimonialsSection />
      <PricingSection />
      <UploadSection />
      <FaqSection />
      <Footer />
    </>
  );
}
