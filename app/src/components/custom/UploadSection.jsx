// src/components/UploadSection.jsx
import React, { useState, useRef } from 'react';
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input"; 
import { cn } from "../../lib/utils"; // Import the cn utility
import { UploadCloud, ArrowRight, Lock } from 'lucide-react'; // Import icons

// Define allowed file types and max size (in bytes)
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // PDF, DOC, DOCX
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function UploadSection() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
    // Reset input value to allow re-uploading the same file
    event.target.value = null;
  };

  const processFile = (file) => {
    if (!file) return;

    setError(''); // Clear previous errors

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, DOC, or DOCX.');
      setResumeFile(null);
      setFileName('');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      setResumeFile(null);
      setFileName('');
      return;
    }

    setResumeFile(file);
    setFileName(file.name);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  // Handle click on the custom upload area to trigger the hidden input
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow drop
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };
  // --- End Drag and Drop Handlers ---

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!resumeFile) {
      setError('Please upload your resume file.');
      return;
    }
    setError('');
    setIsLoading(true);

    console.log("Submitting:", { resumeFile, jobDescription });

    // --- !!! ---
    // TODO: Implement your actual API call here
    // Send `resumeFile` (File object) and `jobDescription` (string)
    // Use FormData to send the file:
    // const formData = new FormData();
    // formData.append('resume', resumeFile);
    // formData.append('jobDescription', jobDescription);
    // try {
    //   const response = await fetch('/api/analyze', { method: 'POST', body: formData });
    //   if (!response.ok) throw new Error('Analysis failed');
    //   const results = await response.json();
    //   console.log("Analysis Results:", results);
    //   // Handle successful analysis (e.g., show results)
    // } catch (err) {
    //   console.error("Analysis Error:", err);
    //   setError(err.message || 'An error occurred during analysis.');
    // } finally {
    //   setIsLoading(false);
    // }
    // --- !!! ---

    // Simulate API call delay for demo
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Simulated analysis complete.");
    setIsLoading(false);
    // Reset form or redirect after submission if needed
    // setResumeFile(null);
    // setFileName('');
    // setJobDescription('');
  };

  return (
    <section id="upload-section" className="py-20 sm:py-28 bg-background"> {/* Use bg-background */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
          Ready to Get Hired?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your resume below. Add a job description for the most tailored feedback!
        </p>

        {/* Use a form element for semantic correctness */}
        <form onSubmit={handleSubmit}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Resume Upload Area */}
            <div className="space-y-4">
              <Label htmlFor="file-upload-trigger" className="block text-sm font-medium text-foreground text-left">
                Upload Your Resume (PDF, DOCX)
              </Label>
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-8 text-center transition duration-300 ease-in-out group",
                  isDraggingOver
                    ? "border-primary bg-primary/10" // Style when dragging over
                    : "border-border hover:border-primary/60 bg-muted/20 hover:bg-primary/5" // Default and hover styles
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <UploadCloud className={cn("mx-auto h-12 w-12 transition", isDraggingOver ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary/80")} />
                {/* This label triggers the hidden input */}
                <Label
                  htmlFor="file-upload" // Connect to the *hidden* input's ID
                  className="relative cursor-pointer mt-4 block"
                  // onClick={handleUploadAreaClick} // Can also trigger via div click if needed, but label works
                >
                  <span className="block text-sm font-semibold text-primary group-hover:text-primary/90">
                    Choose a file
                  </span>
                  <span className="block text-xs text-muted-foreground"> or drag and drop</span>
                </Label>
                {/* Hidden actual file input, controlled by the label above */}
                <Input
                  id="file-upload" // ID for the label's htmlFor
                  ref={fileInputRef}
                  name="file-upload"
                  type="file"
                  className="sr-only" // Keep it visually hidden
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Specify accepted types
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground mt-2">Max file size: 10MB</p>
                {/* Display selected file name or error */}
                {fileName && !error && (
                  <p className="mt-3 text-sm font-medium text-foreground truncate px-4">
                    Selected: {fileName}
                  </p>
                )}
                {error && (
                  <p className="mt-3 text-sm font-medium text-destructive">
                    Error: {error}
                  </p>
                )}
              </div>
            </div>

            {/* Job Description Input Area */}
            <div className="space-y-4">
              <Label htmlFor="job-description" className="block text-sm font-medium text-foreground text-left">
                Paste Job Description (Optional, Recommended)
              </Label>
              <Textarea // Use shadcn Textarea
                id="job-description"
                name="job-description"
                rows={8}
                className="shadow-sm block w-full sm:text-sm p-4 min-h-[210px]" // Added min-height to roughly match upload area
                placeholder="Paste the full job description here for the best analysis..."
                value={jobDescription}
                onChange={handleJobDescriptionChange}
              />
              <p className="text-xs text-muted-foreground text-left">
                Helps our AI tailor feedback specifically to the role you're targeting.
              </p>
            </div>
          </div>

          {/* Submit Button Area */}
          <div className="mt-10">
            <Button // Use shadcn Button
              type="submit"
              size="lg" // Larger size
              className="px-10 py-7 text-lg font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105" // Adjusted padding/text size
              disabled={isLoading || !resumeFile} // Disable if loading or no file
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2 inline-block h-5 w-5 border-2 border-current border-t-transparent rounded-full" role="status" aria-hidden="true"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze My Resume Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </>
              )}
            </Button>
             {/* Display general submission errors here if needed */}
          </div>
        </form>

        {/* Privacy Text */}
        <p className="mt-8 text-sm text-muted-foreground flex items-center justify-center space-x-2 max-w-prose mx-auto">
          <Lock className="w-5 h-5 flex-shrink-0" /> {/* lucide icon */}
          <span>Your privacy matters. Files are processed securely & deleted after analysis (unless saved to an account). Compliant with GDPR & CCPA.</span>
        </p>
      </div>
    </section>
  );
}