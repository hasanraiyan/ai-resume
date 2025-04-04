// src/components/HowItWorksSection.tsx (or similar path)
import React from 'react';
import {
    Card,
    CardContent,
    CardHeader, // Although we might not use header explicitly here
    CardTitle,
    CardDescription,
} from "../ui/card"; // Import Card components

// Define step data for easier mapping
const steps = [
    {
        icon: ( // Using the provided SVG directly
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
        ),
        title: "1. Upload & Specify",
        description: ( // Use JSX for inline strong tag
            <>
                Securely upload your resume (PDF/DOCX).{' '}
                <strong className="text-primary"> {/* Use theme primary color */}
                    Optionally, paste a job description
                </strong>{' '}
                for targeted analysis.
            </>
        ),
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100"> 
                <circle cx="12" cy="12" r="12" fill="white" /> 
                <circle cx="12" cy="12" r="11" fill="#333333" /> 
                <path d="M 12 7 Q 13 11, 17 12 Q 13 13, 12 17 Q 11 13, 7 12 Q 11 11, 12 7 Z M 16 11 C 18 10, 19 11"
                    fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        ),
        title: "2. AI Does the Work",
        description: "Our intelligent system instantly analyzes content, structure, keywords, clarity, and potential skill gaps against industry benchmarks.",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "3. Get Actionable Insights",
        description: "Receive a comprehensive report with an overall score, specific feedback, and clear, prioritized recommendations for improvement.",
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-20 sm:py-28 bg-background overflow-hidden"> {/* Use bg-background */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-base text-primary font-semibold tracking-wide uppercase"> {/* Use theme primary */}
                        Simple Process
                    </h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"> {/* Use theme foreground */}
                        Unlock Your Resume's Potential in 3 Steps
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto"> {/* Use theme muted-foreground */}
                        Get from upload to actionable insights in minutes.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="relative">
                    {/* Connecting Dashed Line */}
                    <div
                        aria-hidden="true"
                        className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2" // Kept positioning
                    >
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                {/* Use theme border color */}
                                <div className="w-full border-t-2 border-dashed border-border"></div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Container */}
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {steps.map((step, index) => (
                            <Card
                                key={index}
                                className="text-center p-2 sm:p-4 rounded-2xl shadow-lg
                           hover:shadow-primary/10 hover:border-primary/30 // Adjusted hover shadow/border with theme colors
                           transition-all duration-300 transform hover:-translate-y-2 z-10
                           bg-card" // Ensure card background respects theme
                            // Note: shadcn Card default has some padding, border, bg, rounded corners.
                            // We override padding/rounding slightly and add hover effects.
                            >
                                {/* We'll put everything inside CardContent for this layout */}
                                <CardContent className="pt-6"> {/* Add padding top to content */}
                                    {/* Icon Container */}
                                    <div
                                        className="flex items-center justify-center h-16 w-16 rounded-full
                               bg-gradient-to-br from-primary to-primary/80 // Adjusted gradient using theme primary
                               text-primary-foreground // Use contrasting text color for icon
                               shadow-lg mx-auto mb-6
                               ring-4 ring-background" // Use theme background for ring to adapt light/dark
                                    >
                                        {step.icon}
                                    </div>

                                    {/* Use CardTitle for semantic heading */}
                                    <CardTitle className="text-xl font-semibold text-foreground mb-3">
                                        {step.title}
                                    </CardTitle>

                                    {/* Use CardDescription for the text */}
                                    <CardDescription className="text-base text-muted-foreground">
                                        {step.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}