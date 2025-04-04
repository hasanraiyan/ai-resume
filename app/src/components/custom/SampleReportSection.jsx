// src/components/SampleReportSection.jsx (or similar path)
import React from 'react';

// Define data for the definition list
const reportFeatures = [
  {
    icon: ( // SVG 1 - Score/Summary
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    title: "Overall Score & Summary",
    description: "A quick snapshot of your resume's effectiveness with key strengths and weaknesses highlighted.",
  },
  {
    icon: ( // SVG 2 - Section Feedback
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: "Section-by-Section Feedback",
    description: "Detailed analysis of your summary, experience, education, and skills sections for clarity, impact, and relevance.",
  },
  {
    icon: ( // SVG 3 - Keyword Analysis
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Keyword & Skill Analysis",
    description: "Identification of relevant keywords (and missing ones), plus analysis of how well your skills match target job requirements.",
  },
];

// Placeholder image URL - replace with your actual image path or URL
const sampleReportImageUrl = "https://image.pollinations.ai/prompt/image%20of%20Sample%20Report%20for%20the%20Resume%20Analyzer?width=500&height=600&model=flux&nologo=true";

export function SampleReportSection() {
  return (
    <section id="sample-report" className="py-20 sm:py-28 bg-muted/40"> {/* Use bg-muted/40 for light gray compatible with theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* Left Column: Text Content */}
          <div>
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase"> {/* Use theme primary */}
              Detailed Insights
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"> {/* Use theme foreground */}
              See Exactly What You'll Get
            </p>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground"> {/* Use theme muted-foreground */}
              Our reports provide clear, actionable feedback across key areas of your resume.
            </p>

            {/* Definition List for Features */}
            <dl className="mt-10 space-y-8">
              {reportFeatures.map((feature, index) => (
                <div key={index} className="flex">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground"> {/* Use theme primary colors */}
                      {feature.icon}
                    </div>
                  </div>
                  {/* Text */}
                  <div className="ml-4">
                    <dt className="text-lg leading-6 font-medium text-foreground"> {/* Use theme foreground */}
                      {feature.title}
                    </dt>
                    <dd className="mt-2 text-base text-muted-foreground"> {/* Use theme muted-foreground */}
                      {feature.description}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Column: Image */}
          <div className="mt-10 lg:mt-0" aria-hidden="true">
            <img // Standard HTML img tag
              className="relative mx-auto rounded-lg shadow-xl border border-border" // Use theme border color
              width="500" // Set width directly if needed, or control via Tailwind
              height="600" // Set height if needed
              src={sampleReportImageUrl} // Use the variable for the URL
              alt="Sample analysis report showing scores and feedback sections"
              loading="lazy" // Add lazy loading for performance
            />
            {/* Consider adding width/height via Tailwind classes for responsiveness: e.g., className="... w-full max-w-[500px] h-auto" */}
          </div>

        </div>
      </div>
    </section>
  );
}