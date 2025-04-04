// src/components/custom/UploadSection.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils"; // Import the cn utility
import { UploadCloud, ArrowRight, Lock, Loader2 } from 'lucide-react'; // Import icons

// Define allowed file types and max size (in bytes)
const ALLOWED_FILE_TYPES = [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function UploadSection() {
  // --- State Variables ---
  const [resumeFile, setResumeFile] = useState(null); // Stores the File object
  const [jobDescription, setJobDescription] = useState(''); // Stores the textarea content
  const [fileName, setFileName] = useState(''); // For displaying the selected file's name
  const [error, setError] = useState(''); // Stores validation or submission error messages
  const [isLoading, setIsLoading] = useState(false); // Tracks the submission loading state
  const [isDraggingOver, setIsDraggingOver] = useState(false); // Tracks drag-over state for styling

  // --- Hooks ---
  const fileInputRef = useRef(null); // Ref for the hidden file input element
  const navigate = useNavigate(); // Hook from react-router-dom to navigate programmatically

  // --- Helper Function to Process File (Validation) ---
  const processFile = (file) => {
    if (!file) return;

    setError(''); // Clear previous errors on new file selection/drop

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, DOC, or DOCX.');
      setResumeFile(null);
      setFileName('');
      return false; // Indicate validation failure
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      setResumeFile(null);
      setFileName('');
      return false; // Indicate validation failure
    }

    // If valid
    setResumeFile(file);
    setFileName(file.name);
    return true; // Indicate validation success
  };

  // --- Event Handlers ---

  // Handles file selection via the hidden input
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
    // Reset input value to allow re-uploading the same file name consecutively
    if (event.target) {
        event.target.value = null;
    }
  };

  // Handles changes in the job description textarea
  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  // Triggers click on the hidden file input when the custom area is clicked (using label is preferred)
  // const handleUploadAreaClick = () => {
  //   fileInputRef.current?.click();
  // };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow dropping
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0]; // Get the dropped file
    if (file) {
      processFile(file); // Validate and set the dropped file
    }
  };
  // --- End Drag and Drop Handlers ---

  // Handles the form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (!resumeFile) {
      setError('Please upload your resume file.');
      return;
    }
    // Clear any previous submission errors if file is present now
    setError('');
    setIsLoading(true);

    console.log("Submitting Form Data:", { resumeFile, jobDescription });

    // --- !!! ---
    // TODO: Replace Simulation with Actual API Call
    // This is where you would typically use FormData and fetch/axios:
    //
    // const formData = new FormData();
    // formData.append('resume', resumeFile);
    // formData.append('jobDescription', jobDescription);
    //
    // try {
    //   const response = await fetch('/api/analyze', { // Your API endpoint
    //     method: 'POST',
    //     body: formData,
    //   });
    //   if (!response.ok) {
    //     // Handle API errors (e.g., read error message from response body)
    //     const errorData = await response.json().catch(() => ({ message: 'Analysis failed with status ' + response.status }));
    //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    //   }
    //   const results = await response.json(); // Or response.text() if backend sends raw markdown
    //   console.log("Analysis Results:", results);
    //
    //   // Navigate to results page, potentially passing data
    //   navigate('/result', { state: { analysisData: results } }); // Pass data via state if needed
    //
    // } catch (err) {
    //   console.error("Analysis API Error:", err);
    //   setError(err.message || 'An error occurred during analysis. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
    // --- !!! ---

    // ** Simulating API call delay and success for Demo **
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2 seconds processing time
        console.log("Simulated analysis complete.");

        // Navigate to the results page on simulated success
        navigate('/result'); // Navigate to the '/result' route

        // Optional: You could pass the simulated result (or real one) via state:
        // const sampleMarkdownResult = `# Report\n...`; // Your markdown string
        // navigate('/result', { state: { analysisResult: sampleMarkdownResult } });

    } catch (err) {
        // This catch block would be more relevant for the actual API call simulation if it could fail
        console.error("Simulation Error (should not happen with setTimeout):", err);
        setError('An unexpected error occurred during the simulation.');
    } finally {
        setIsLoading(false); // Ensure loading state is turned off
    }
  };

  // --- Render ---
  return (
    <section id="upload-section" className="py-20 sm:py-28 bg-background"> {/* Use bg-background */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
          Ready to Get Hired?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your resume below. Add a job description for the most tailored feedback!
        </p>

        {/* Use a form element for semantic correctness and onSubmit handling */}
        <form onSubmit={handleSubmit}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* Resume Upload Area (Left Column) */}
            <div className="space-y-4">
              <Label htmlFor="file-upload" className="block text-sm font-medium text-foreground text-left">
                Upload Your Resume (PDF, DOCX)
              </Label>
              {/* The Dropzone Div */}
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-8 text-center transition duration-300 ease-in-out group cursor-pointer", // Added cursor-pointer
                  isDraggingOver
                    ? "border-primary bg-primary/10" // Style when dragging over
                    : "border-border hover:border-primary/60 bg-muted/20 hover:bg-primary/5" // Default and hover styles
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()} // Trigger file input on click
              >
                <UploadCloud className={cn(
                    "mx-auto h-12 w-12 transition",
                    isDraggingOver ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary/80"
                )} aria-hidden="true" />

                {/* Text instructions inside dropzone */}
                <p className="mt-4 text-sm font-semibold text-primary group-hover:text-primary/90">
                    Choose a file
                </p>
                <p className="text-xs text-muted-foreground"> or drag and drop</p>

                {/* Hidden actual file input */}
                <Input
                  id="file-upload" // ID for the label's htmlFor
                  ref={fileInputRef}
                  name="file-upload"
                  type="file"
                  className="sr-only" // Keep it visually hidden but accessible
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Specify accepted types explicitly
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground mt-2">Max file size: 10MB</p>

                {/* Display selected file name or error */}
                {fileName && !error && (
                  <p className="mt-3 text-sm font-medium text-green-600 dark:text-green-500 truncate px-4">
                    Selected: {fileName}
                  </p>
                )}
                {/* Display validation errors */}
                {error && !isLoading && ( // Only show validation error if not in loading state
                  <p className="mt-3 text-sm font-medium text-destructive">
                    Error: {error}
                  </p>
                )}
              </div>
            </div>

            {/* Job Description Input Area (Right Column) */}
            <div className="space-y-4">
              <Label htmlFor="job-description" className="block text-sm font-medium text-foreground text-left">
                Paste Job Description (Optional, Recommended)
              </Label>
              <Textarea // Use shadcn Textarea
                id="job-description"
                name="job-description"
                rows={8}
                className="shadow-sm block w-full sm:text-sm p-4 min-h-[226px] focus-visible:ring-primary" // Added min-height to roughly match upload area, adjust as needed
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
              className="px-10 py-7 text-lg font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 w-full sm:w-auto" // Responsive width
              disabled={isLoading || !resumeFile} // Disable if loading or no file selected
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 inline-block h-5 w-5" aria-hidden="true" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze My Resume Now
                  <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
                </>
              )}
            </Button>
             {/* Display general submission errors here if needed (e.g., from the API call failure) */}
             {error && isLoading && ( // Show general error if loading failed (less common for validation errors now)
                 <p className="mt-4 text-sm font-medium text-destructive">
                     Error: {error}
                 </p>
             )}
          </div>
        </form>

        {/* Privacy Text */}
        <p className="mt-8 text-sm text-muted-foreground flex items-center justify-center space-x-2 max-w-prose mx-auto">
          <Lock className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span>Your privacy matters. Files are processed securely & deleted after analysis (unless saved to an account). Compliant with GDPR & CCPA.</span>
        </p>
      </div>
    </section>
  );
}