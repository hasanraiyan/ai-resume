// src/components/custom/UploadSection.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { UploadCloud, ArrowRight, Lock, Loader2 } from 'lucide-react';

const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg', // Added image types based on backend
    'image/png',  // Added image types based on backend
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // Updated to 50MB based on backend multer config

export function UploadSection() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState(''); // Keep job description if you plan to use it
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Use a different state name to avoid confusion
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const processFile = (file) => {
    if (!file) return false; // Return boolean for easier checking
    setError('');

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(`Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG.`);
      setResumeFile(null);
      setFileName('');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Max size: ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      setResumeFile(null);
      setFileName('');
      return false;
    }

    setResumeFile(file);
    setFileName(file.name);
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
    if (event.target) event.target.value = null;
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
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
    if (file) processFile(file);
  };

  // --- Updated handleSubmit ---
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!resumeFile) {
      setError('Please upload your resume file.');
      return;
    }
    setError(''); // Clear error if file exists
    setIsSubmitting(true); // Indicate preparation for navigation/submission

    // --- Navigate to Result Page, passing the file object ---
    // The ResultPage will handle the actual API call and SSE stream
    navigate('/result', {
      state: {
        resumeFile: resumeFile, // Pass the File object
        // jobDescription: jobDescription // Pass JD if backend uses it
      }
    });

    // No API call here anymore, just navigate.
    // No need to setIsSubmitting(false) here as the component will unmount on navigation.
  };

  return (
    <section id="upload-section" className="py-20 sm:py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
          Ready to Get Hired?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your resume (PDF, DOCX, JPG, PNG) to get started.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Resume Upload Area */}
            <div className="space-y-4">
              <Label htmlFor="file-upload" className="block text-sm font-medium text-foreground text-left">
                Upload Your Resume
              </Label>
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-8 text-center transition duration-300 ease-in-out group cursor-pointer",
                  isDraggingOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 bg-muted/20 hover:bg-primary/5"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className={cn("mx-auto h-12 w-12 transition", isDraggingOver ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary/80")} aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold text-primary group-hover:text-primary/90">Choose a file</p>
                <p className="text-xs text-muted-foreground"> or drag and drop</p>
                <Input
                  id="file-upload"
                  ref={fileInputRef}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground mt-2">Max file size: 50MB</p>
                {fileName && !error && <p className="mt-3 text-sm font-medium text-green-600 dark:text-green-500 truncate px-4">Selected: {fileName}</p>}
                {error && <p className="mt-3 text-sm font-medium text-destructive">Error: {error}</p>}
              </div>
            </div>

            {/* Job Description (Optional) - Kept for potential future use */}
            <div className="space-y-4">
              <Label htmlFor="job-description" className="block text-sm font-medium text-foreground text-left">
                Paste Job Description (Optional)
              </Label>
              <Textarea
                id="job-description"
                name="job-description"
                rows={8}
                className="shadow-sm block w-full sm:text-sm p-4 min-h-[226px] focus-visible:ring-primary"
                placeholder="Paste the job description here if you want tailored feedback (feature coming soon)..."
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                disabled // Disable if not used by backend yet
              />
               <p className="text-xs text-muted-foreground text-left">
                (This feature helps tailor analysis - currently processed on backend if sent)
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Button
              type="submit"
              size="lg"
              className="px-10 py-7 text-lg font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 w-full sm:w-auto"
              disabled={isSubmitting || !resumeFile || !!error} // Disable if submitting, no file, or error exists
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 inline-block h-5 w-5" aria-hidden="true" />
                  Preparing...
                </>
              ) : (
                <>
                  Analyze My Resume
                  <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-sm text-muted-foreground flex items-center justify-center space-x-2 max-w-prose mx-auto">
          <Lock className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span>Your privacy matters. Files are processed securely & deleted after analysis.</span>
        </p>
      </div>
    </section>
  );
}