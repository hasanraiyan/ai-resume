// src/components/TestimonialsSection.jsx (or similar path)
import React from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader, // Optional, could put icon here or directly in content
} from "../ui/card";

// Define testimonial data
const testimonials = [
    {
        quote: "The job description matching feature was a lifesaver! It showed exactly which keywords I was missing. Got two interviews within a week of updating my resume.",
        name: "Sarah K.",
        title: "Software Engineer Applicant",
        imageUrl: "https://image.pollinations.ai/prompt/image%20of%20Sarah%20K.", // Replace with actual images
        icon: ( // Quote Icon SVG
            <svg className="h-10 w-10 text-primary/40 mb-4" // Use theme color with opacity
                fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.333 7h13.334C24.403 7 26 8.597 26 10.333v7.334C26 19.403 24.403 21 22.667 21H14.487l-3.154 3.942A.667.667 0 0110.667 25v-4H9.333C7.597 21 6 19.403 6 17.667V10.333C6 8.597 7.597 7 9.333 7z" />
            </svg>
        )
    },
    {
        quote: "As a career changer, I wasn't sure how to position my experience. The skill gap analysis and clarity score helped me reframe my background effectively.",
        name: "Michael T.",
        title: "Transitioning to Project Management",
        imageUrl: "https://image.pollinations.ai/prompt/image%20of%20Michael%20T.",
        icon: ( // Quote Icon SVG
            <svg className="h-10 w-10 text-primary/40 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"> <path d="M9.333 7h13.334C24.403 7 26 8.597 26 10.333v7.334C26 19.403 24.403 21 22.667 21H14.487l-3.154 3.942A.667.667 0 0110.667 25v-4H9.333C7.597 21 6 19.403 6 17.667V10.333C6 8.597 7.597 7 9.333 7z" /> </svg>
        )
    },
    {
        quote: "So much better than generic resume builders. The specific, actionable feedback on *my* resume made all the difference. Highly recommend!",
        name: "Priya L.",
        title: "Marketing Professional",
        imageUrl: "https://image.pollinations.ai/prompt/image%20of%20Priya%20L.",
        icon: ( // Quote Icon SVG
            <svg className="h-10 w-10 text-primary/40 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"> <path d="M9.333 7h13.334C24.403 7 26 8.597 26 10.333v7.334C26 19.403 24.403 21 22.667 21H14.487l-3.154 3.942A.667.667 0 0110.667 25v-4H9.333C7.597 21 6 19.403 6 17.667V10.333C6 8.597 7.597 7 9.333 7z" /> </svg>
        )
    }
];

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-20 sm:py-28 bg-background"> {/* Use bg-background */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight"> {/* Use theme foreground */}
                        Success Stories from Our Users
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto"> {/* Use theme muted-foreground */}
                        See how our AI analysis is helping job seekers land interviews and offers.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="flex flex-col rounded-xl shadow-lg
                         border border-border/50 // Subtle border using theme color
                         bg-gradient-to-br from-card via-card to-muted/10 // Subtle gradient with card/muted background
                         overflow-hidden"
                        // Applying flex-col here to make content grow
                        >
                            {/* We can place the icon and quote in CardContent */}
                            <CardContent className="p-6 sm:p-8 flex-grow flex flex-col"> {/* Added flex-grow here */}
                                {testimonial.icon}
                                <blockquote className="text-muted-foreground italic text-lg mb-6 flex-grow"> {/* Use theme text color, flex-grow pushes footer */}
                                    {testimonial.quote}
                                </blockquote>
                            </CardContent>

                            {/* Author info in CardFooter */}
                            <CardFooter className="p-6 sm:p-8 pt-0"> {/* Remove top padding from footer */}
                                <div className="flex items-center">
                                    <img
                                        className="h-12 w-12 rounded-full mr-4 object-cover" // Added object-cover
                                        src={testimonial.imageUrl}
                                        alt={testimonial.name}
                                        loading="lazy"
                                    />
                                    <div>
                                        <footer className="font-semibold text-foreground">{testimonial.name}</footer> {/* Use theme text color */}
                                        <p className="text-sm text-muted-foreground">{testimonial.title}</p> {/* Use theme text color */}
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}