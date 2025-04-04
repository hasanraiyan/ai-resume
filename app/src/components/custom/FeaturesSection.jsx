// src/components/FeaturesSection.tsx (or similar path)
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader, 
  CardTitle,
  CardDescription,
} from "../ui/card"; // Import Card components

// Define feature data array for cleaner rendering
const features = [
  {
    icon: ( // Feature 1 SVG
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    title: "Job Description Matching",
    description: "Paste a job description to get hyper-focused feedback on keyword alignment, skill relevance, and ATS optimization for that specific role.",
  },
  {
    icon: ( // Feature 2 SVG
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.75M3.75 16.5l1-1.75m0 0L6.25 12l-1.5-2.75L3.75 16.5zm7.5 0l1 1.75M18.75 16.5l-1-1.75m0 0L16.25 12l1.5-2.75L18.75 16.5z" />
      </svg>
    ),
    title: "Clarity & Impact Score",
    description: "Our AI evaluates readability, conciseness, and the use of action verbs to ensure your achievements shine through clearly and powerfully.",
  },
  {
    icon: ( // Feature 3 SVG
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
         <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
     </svg>
    ),
    title: "Skill Gap Analysis",
    description: "Identify crucial skills missing from your resume compared to your target roles. Get suggestions for highlighting transferable skills. (Premium includes learning resources).",
  },
  {
    icon: ( // Feature 4 SVG
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.27.96-.12 1.45l-.773.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.893c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.893c-.07-.424-.384-.765-.78-.93-.398-.165-.854-.143-1.204.107l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.773a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.893z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Explainable AI Feedback",
    description: "No black boxes. Understand the 'why' behind each suggestion with clear explanations, helping you learn and improve for future applications.",
  },
  {
    icon: ( // Feature 5 SVG
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622a11.99 11.99 0 00-.598-3.75M12 6V3.75" />
      </svg>
    ),
    title: "Privacy Focused",
    description: "Your data security is paramount. We process resumes securely and delete files promptly after analysis (unless you create an account). GDPR & CCPA compliant.",
  },
  {
    icon: ( // Feature 6 SVG
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
       </svg>
    ),
    title: "Instant Results",
    description: "Why wait days for manual feedback? Get comprehensive AI analysis in seconds, allowing you to iterate and apply faster.",
  },
];


export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-gradient-to-b from-primary/5 via-background/50 to-background">
      {/* Adjusted gradient: primary/5 is very light primary, fading via transparent/semi-transparent background to full background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="lg:text-center mb-16 sm:mb-20">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase"> {/* text-primary */}
            Why Choose Us?
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"> {/* text-foreground */}
            Go Beyond Keywords. Build Your Career Confidence.
          </p>
          <p className="mt-4 max-w-3xl text-xl text-muted-foreground lg:mx-auto"> {/* text-muted-foreground */}
            Our platform offers a unique blend of resume optimization and career development focus, powered by transparent AI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-8 lg:gap-x-10 lg:gap-y-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center rounded-lg
                         transition duration-300 ease-in-out
                         bg-card border border-transparent hover:shadow-lg hover:border-border/20"
              // Using flex layout on the Card itself
              // Added subtle border on hover for definition, transparent by default
              // bg-card ensures theme compatibility
            >
              <CardContent className="p-6 flex flex-col items-center w-full"> {/* Added padding here */}
                {/* Icon Container */}
                <div
                  className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full
                             bg-primary/10 text-primary mb-5" // Use theme primary color with low opacity bg
                >
                  {feature.icon}
                </div>

                {/* Card Title */}
                <CardTitle className="text-lg leading-6 font-semibold text-foreground mb-2">
                  {feature.title}
                </CardTitle>

                {/* Card Description */}
                <CardDescription className="text-base text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}