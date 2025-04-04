// src/components/FaqSection.jsx
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"; 

// Define FAQ data
const faqs = [
  {
    id: "faq-1",
    question: "How accurate is the AI analysis?",
    answer: "Our AI is trained on millions of data points, including successful resumes and job descriptions across various industries. While it provides highly relevant feedback, it's designed to augment, not replace, human judgment. It excels at identifying ATS compatibility issues, keyword alignment, clarity, and common best practices.",
  },
  {
    id: "faq-2",
    question: "Is my data secure? What happens to my resume?",
    answer: "Absolutely. We use secure protocols for file uploads and processing. For free analyses, your resume file and any pasted job description are automatically deleted from our servers shortly after the analysis is complete. If you sign up for an account, you'll have the option to save your documents securely.",
  },
  {
    id: "faq-3",
    question: "What file types are supported?",
    answer: "Currently, we support the most common resume formats: PDF (.pdf), Microsoft Word (.doc and .docx). Ensure your file is not password-protected or an image scan for best results.",
  },
  {
    id: "faq-4",
    question: "How is this different from a grammar checker or basic template builder?",
    answer: "We go far beyond grammar and templates. Our AI analyzes the *content* and *context* of your resume against job requirements and industry standards. We provide feedback on skill alignment, impact quantification, ATS compatibility, clarity from a recruiter's perspective, and potential skill gaps – areas basic tools don't cover.",
  },
  // Add more FAQs here if needed
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 sm:py-28 bg-muted/40"> {/* Use theme color for bg */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-foreground sm:text-4xl mb-12"> {/* Use theme color */}
          Frequently Asked Questions
        </h2>

        {/* Use shadcn Accordion component */}
        <Accordion type="single" collapsible className="w-full space-y-4">


          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id} // Unique value for each item
              className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md" // Apply card styles, remove default Accordion padding/border
            >
              <AccordionTrigger className="flex justify-between items-center w-full p-6 text-left font-medium text-foreground hover:no-underline">
                {/* `hover:no-underline` prevents underline on hover */}
                {/* Chevron icon is usually included by default in shadcn AccordionTrigger */}
                <span>{faq.question}</span>
                {/* Optional: If default icon isn't showing or you want custom, add it here */}
                {/* <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" /> */}
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 text-muted-foreground">
                {/* Add padding back, but remove top padding */}
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}