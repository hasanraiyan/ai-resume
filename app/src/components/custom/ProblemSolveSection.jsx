// src/components/ProblemSolveSection.tsx (or similar path)
import React from 'react';

export function ProblemSolveSection() {
  return (
    // Use bg-primary and text-primary-foreground for a branded dark section
    // This leverages your defined shadcn primary color and its contrasting text color.
    <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
          {/* Use text-primary-foreground directly, potentially with opacity for variation */}
          <span className="text-primary-foreground/90"> {/* Slightly dimmer for the first part */}
            Stop Sending Resumes Into the Void.
          </span>
          <br /> Start Getting Noticed. {/* Brighter/default */}
        </h2>
        <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-3xl mx-auto">
          {/* Using opacity modifier (e.g., /80) to simulate text-primary-200 */}
          Generic advice doesn't cut it. Applicant Tracking Systems (ATS) filter out most resumes. Recruiters spend seconds scanning. We give you the{' '}
          <strong className="font-semibold text-primary-foreground"> {/* Make strong text fully bright */}
            specific, AI-driven insights
          </strong>{' '}
          needed to beat the system and capture attention.
        </p>

        {/* Optional: Stat - using a lower opacity for less emphasis */}
        {/*
        <p className="mt-6 text-sm text-primary-foreground/60 font-medium">
          Did you know? Up to 75% of resumes are rejected by ATS before a human sees them.
        </p>
        */}
      </div>
    </section>
  );
}