// src/pages/ResultPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Optional: To get data passed via navigate state
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'; // Adjust path if needed
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'; // Adjust path if needed
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'; // Adjust path if needed
import { Progress } from '../components/ui/progress'; // Adjust path if needed
import { Badge } from '../components/ui/badge'; // Adjust path if needed
import { Loader2, Info, CheckCircle, XCircle, Target, ListChecks, AlertTriangle, Sparkles } from 'lucide-react'; // Icons

// --- SIMULATED PARSED DATA ---
// In a real application, this structured object would ideally come from your API (e.g., as JSON)
// This structure allows us to use specific components for different pieces of data.
const parsedResult = {
  overallScore: 78,
  summaryText: "Your resume shows strong potential but could be significantly improved by tailoring keywords to specific job descriptions and quantifying achievements more effectively. Formatting is clean and ATS-friendly.",
  sectionBreakdown: [
    {
      title: "Summary/Objective",
      strength: "Clear and concise opening statement.",
      improvement: "Consider adding 1-2 key quantifiable achievements directly in the summary for immediate impact.",
    },
    {
      title: "Experience Section",
      strength: "Well-structured using STAR method for some points.",
      improvement: "Many bullet points lack measurable results. Instead of \"Managed social media accounts,\" try \"Increased social media engagement by 25% across three platforms (Facebook, Twitter, LinkedIn) through targeted content strategy.\"",
      alert: "Missing keywords like \"Project Management,\" \"Agile,\" and \"Budgeting\" frequently found in your target roles.",
    },
    {
      title: "Skills Section",
      strength: "Good mix of technical and soft skills.",
      improvement: "Separate technical skills (e.g., Python, SQL, AWS) from soft skills (e.g., Communication, Teamwork) for better readability by ATS and humans. Ensure skills listed match keywords from the job description.",
    },
    {
      title: "Education",
      strength: "Clear and well-formatted. No immediate issues found.",
      improvement: null,
    },
  ],
  keywordAnalysis: {
    matched: ["Leadership", "Data Analysis", "Customer Service"],
    missing: ["Budget Management", "Stakeholder Communication", "Risk Assessment", "CRM Software"],
    recommendation: "Integrate missing keywords naturally into your experience bullet points where applicable.",
  },
  formattingChecks: [
    { check: "Standard font (e.g., Arial, Calibri)", passed: true },
    { check: "Clear section headings", passed: true },
    { check: "No tables or columns that confuse ATS", passed: true },
    { check: "File type (PDF/DOCX)", passed: true },
  ],
  recommendations: [
    "Quantify Achievements: Review each bullet point in your Experience section. Ask \"How much?\", \"How many?\", \"What was the impact?\". Add numbers, percentages, or specific outcomes.",
    "Integrate Missing Keywords: Weave terms like \"Budget Management\" and \"Stakeholder Communication\" into your descriptions of past responsibilities and achievements.",
    "Refine Summary: Add a key achievement metric to your professional summary.",
    "Organize Skills: Create distinct subsections for Technical Skills and Soft Skills.",
  ],
};
// --- END SIMULATED DATA ---

export function ResultPage() {
  // State to hold the *structured* analysis result object
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start in loading state
  const [error, setError] = useState(null); // To store any error messages
  const location = useLocation(); // Optional hook to access navigation state

  useEffect(() => {
    // This effect runs when the component mounts (or dependencies change)
    // It simulates fetching data or retrieves it from navigation state.
    setIsLoading(true); // Set loading true at the start of fetch/simulation
    setError(null); // Clear previous errors

    // Simulate network delay/processing time
    const timer = setTimeout(() => {
      try {
        // --- REAL DATA FETCHING LOGIC WOULD GO HERE ---
        // Example using location state (if you passed data during navigation):
        // if (location.state?.analysisResult) {
        //   console.log("Using analysis result from location state");
        //   setAnalysisResult(location.state.analysisResult); // Make sure state has the *structured object*
        // }
        // Example Fetching from an API:
        // fetch(`/api/results/${someId}`) // Replace with your actual API endpoint
        //   .then(response => {
        //     if (!response.ok) {
        //       throw new Error(`API Error: ${response.status} ${response.statusText}`);
        //     }
        //     return response.json(); // Assumes API returns the structured JSON
        //   })
        //   .then(data => {
        //     setAnalysisResult(data);
        //   })
        //   .catch(err => {
        //      console.error("Error fetching results:", err);
        //      setError("Failed to fetch analysis results from the server.");
        //   })
        //   .finally(() => {
        //      setIsLoading(false);
        //   });
        // --- END REAL DATA FETCHING LOGIC ---

        // --- For now, use the simulated structured data ---
        console.log("Using simulated analysis result");
        setAnalysisResult(parsedResult);
        setIsLoading(false); // Stop loading after setting data
        // --- Remove above simulation when using real fetch ---

      } catch (err) {
        // Catch any synchronous errors during processing (less likely here than in fetch)
        console.error("Error processing results:", err);
        setError("An unexpected error occurred while processing the results.");
        setIsLoading(false); // Stop loading on error
      }
    }, 1500); // Simulate 1.5 seconds delay

    // Cleanup function to clear the timer if the component unmounts before timeout
    return () => clearTimeout(timer);

  }, [location.state]); // Dependency array - re-run if location.state changes (if using it)

  // Helper function to determine score color based on value
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 65) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-500';
  };

  // --- Render Logic ---
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-extrabold text-center text-foreground sm:text-4xl">
        Your Resume Analysis Results
      </h1>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center min-h-[300px] space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Generating your report...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Report</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* No Results State (after loading, if result is still null/empty) */}
      {!isLoading && !error && !analysisResult && (
           <Alert>
             <Info className="h-4 w-4" />
             <AlertTitle>No Results Found</AlertTitle>
             <AlertDescription>We couldn't retrieve analysis results. Please try submitting your resume again or contact support if the issue persists.</AlertDescription>
           </Alert>
      )}

      {/* Success State: Display Results */}
      {!isLoading && !error && analysisResult && (
        <>
          {/* Score Card */}
          <Card className="overflow-hidden shadow-lg border-border/60">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-4 sm:p-6">
              <CardTitle className="text-2xl flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-primary" /> Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className={`text-6xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                {analysisResult.overallScore}<span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <div className="w-full flex-1 space-y-2">
                <Progress value={analysisResult.overallScore} className="h-3" />
                <p className="text-sm text-muted-foreground">{analysisResult.summaryText}</p>
              </div>
            </CardContent>
          </Card>

           {/* Actionable Recommendations Card */}
          <Card className="border-primary/50 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                 <ListChecks className="w-5 h-5 mr-2 text-primary" /> Actionable Recommendations
              </CardTitle>
              <CardDescription>Focus on these key areas for the biggest impact.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-decimal list-inside marker:text-primary marker:font-semibold">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-muted-foreground leading-relaxed pl-2">{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Detailed Accordion */}
          <Accordion type="multiple" collapsible={false} defaultValue={['item-breakdown', 'item-keywords']} className="w-full space-y-4">

            {/* Section Breakdown */}
            <AccordionItem value="item-breakdown" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
              <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">
                Section-by-Section Feedback
              </AccordionTrigger>
              <AccordionContent className="p-4 sm:p-6 pt-0 space-y-4">
                {analysisResult.sectionBreakdown.map((section, index) => (
                  <div key={index} className="p-3 border border-border/50 rounded-md bg-muted/20">
                    <h4 className="font-semibold text-foreground mb-1">{section.title}</h4>
                    {section.strength && <p className="text-sm text-green-700 dark:text-green-400 flex"><CheckCircle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5"/> {section.strength}</p>}
                    {section.improvement && <p className="text-sm text-yellow-700 dark:text-yellow-400 flex"><AlertTriangle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5"/> {section.improvement}</p>}
                    {section.alert && <p className="text-sm text-red-700 dark:text-red-500 flex"><XCircle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5"/> {section.alert}</p>}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

             {/* Keyword Analysis */}
             <AccordionItem value="item-keywords" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
              <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">
                Keyword Analysis
              </AccordionTrigger>
              <AccordionContent className="p-4 sm:p-6 pt-0 space-y-4">
                 <div>
                    <h4 className="font-medium text-foreground mb-2">Matched Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysisResult.keywordAnalysis.matched.map(kw => <Badge key={kw} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700">{kw}</Badge>)} {/* Custom green badge */}
                    </div>
                 </div>
                 <div>
                    <h4 className="font-medium text-foreground mb-2">Missing Keywords:</h4>
                     <div className="flex flex-wrap gap-2">
                        {analysisResult.keywordAnalysis.missing.map(kw => <Badge key={kw} variant="destructive">{kw}</Badge>)}
                    </div>
                 </div>
                 {analysisResult.keywordAnalysis.recommendation && (
                    <Alert className="mt-4 border-primary/30"> {/* Subtle border */}
                      <Target className="h-4 w-4"/>
                      <AlertTitle>Recommendation</AlertTitle>
                      <AlertDescription>{analysisResult.keywordAnalysis.recommendation}</AlertDescription>
                    </Alert>
                 )}
              </AccordionContent>
            </AccordionItem>

             {/* Formatting Checks */}
             <AccordionItem value="item-formatting" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
              <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">
                Formatting & ATS Compatibility
              </AccordionTrigger>
              <AccordionContent className="p-4 sm:p-6 pt-0 space-y-2">
                <ul className="text-sm text-muted-foreground">
                    {analysisResult.formattingChecks.map((checkItem, index) => (
                        <li key={index} className="flex items-center">
                            {checkItem.passed ?
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0"/> :
                                <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0"/>
                            }
                            {checkItem.check} - <span className={checkItem.passed ? 'font-medium text-green-600 dark:text-green-400' : 'font-medium text-red-600 dark:text-red-500'}>
                                {checkItem.passed ? 'Passed' : 'Check'}
                            </span>
                        </li>
                    ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </>
      )}
    </div>
  );
}