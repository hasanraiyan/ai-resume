// src/components/Footer.jsx
import React from 'react';
import { Badge } from '../ui/badge';

// --- Data for Footer Links ---
const footerNav = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ],
  company: [
    { name: 'About Team Delta', href: '#' }, // Replace with actual links
    { name: 'Blog (Coming Soon)', href: '#' },
    { name: 'Contact Us', href: '#' },
  ],
  resources: [
    { name: 'Resume Writing Tips', href: '#' },
    { name: 'Interview Preparation', href: '#' },
    { name: 'Career Guides', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  {
    name: 'LinkedIn',
    href: '#', // Replace with actual link
    icon: (props) => ( // LinkedIn SVG
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#', // Replace with actual link
    icon: (props) => ( // Twitter SVG
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  // Add more social links if needed
];

const techStack = [ 'MongoDB', 'Express', 'React', 'Node.js', 'Tailwind' ];
// --- End Data Definitions ---


export function Footer() {
  return (
    <footer className="bg-gray-950 text-muted-foreground/80"> {/* Use specific dark bg, adjusted text color */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Left Column: Logo, Description, Social */}
          <div className="space-y-8 xl:col-span-1">
            <a href="/" className="flex items-center space-x-2">
              {/* Logo SVG */}
              <svg className="h-8 w-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
               </svg>
               <span className="text-xl font-semibold text-white">AI Resume Analyser</span> {/* Keep white text for logo */}
            </a>
            <p className="text-base leading-relaxed">
                Empowering job seekers with AI-driven insights to optimize resumes, highlight skills, and accelerate career progression.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground/70 hover:text-white transition duration-150" // Use white for hover
                  target="_blank" // Good practice for external links
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Columns: Link Lists */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase"> {/* Slightly brighter heading */}
                  Product
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNav.product.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base hover:text-white transition">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNav.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base hover:text-white transition">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                 <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                   Resources
                 </h3>
                 <ul role="list" className="mt-4 space-y-4">
                    {footerNav.resources.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-base hover:text-white transition">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
              </div>
              <div className="mt-12 md:mt-0">
                 <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                   Legal
                 </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNav.legal.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base hover:text-white transition">
                        {item.name}
                      </a>
                    </li>
                  ))}
                 </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Tech Stack */}
        <div className="mt-12 border-t border-border/20 pt-8 md:flex md:items-center md:justify-between"> {/* Use theme border */}
          <p className="text-base text-muted-foreground/70 md:order-1 md:mt-0">
            © {new Date().getFullYear()} Team Delta (Project Lead: Razique Hasan). All rights reserved.
          </p>
          {/* Tech Stack Badges */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 md:mt-0 md:order-2"> {/* Use gap-2 and flex-wrap */}
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary" // Use secondary variant for muted bg/fg look
                className="text-xs font-medium px-2.5 py-0.5 ring-1 ring-inset ring-border/50" // Adjust ring color
                title={tech} // Add title attribute
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}