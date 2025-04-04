// src/pages/ResultPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source'; // Import the library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Loader2, Info, CheckCircle, XCircle, Target, ListChecks, AlertTriangle, Sparkles, UploadCloud, FileCheck2, BrainCircuit } from 'lucide-react'; // Added more icons

// Helper component for animated status updates
const StatusUpdate = ({ icon: Icon, message, stage, pulse = false }) => (
  <div className="flex items-center space-x-3 p-3 bg-muted/40 rounded-md border border-border/30 mb-2">
    <Icon className={`h-5 w-5 text-primary ${pulse ? 'animate-pulse' : ''}`} />
    <span className="text-sm text-foreground flex-1">{message}</span>
    {stage && <Badge variant="outline" className="text-xs">{stage}</Badge>}
  </div>
);

export function ResultPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [progressUpdates, setProgressUpdates] = useState([]); // Store status messages
  const [currentStage, setCurrentStage] = useState('INIT'); // Track current high-level stage
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const ctrlRef = useRef(new AbortController()); // AbortController for fetchEventSource

  useEffect(() => {
    const { resumeFile } = location.state || {}; // Get file from navigation state

    if (!resumeFile) {
      setError("No resume file provided. Please go back and upload your resume.");
      setCurrentStage('ERROR');
      return; // Stop if no file
    }

    const controller = new AbortController();
    ctrlRef.current = controller; // Store controller in ref

    const fetchData = async () => {
      setCurrentStage('UPLOADING');
      setProgressUpdates([{ icon: Loader2, message: 'Preparing upload...', stage: 'START', pulse: true }]);

      const formData = new FormData();
      // IMPORTANT: Use the key the backend expects ('resumeFile')
      formData.append('resumeFile', resumeFile);
      // If you were using jobDescription:
      // if (location.state.jobDescription) {
      //   formData.append('jobDescription', location.state.jobDescription);
      // }

      try {
        await fetchEventSource('https://ai-resume-70ka.onrender.com/analyse-resume', { 
          method: 'POST',
          headers: {
            // Don't set Content-Type for FormData, browser does it with boundary
            'Accept': 'text/event-stream', // Crucial for SSE
          },
          body: formData,
          signal: controller.signal, // Pass the abort signal

          onopen: async (response) => {
            if (response.ok && response.headers.get('content-type') === 'text/event-stream') {
              console.log('SSE Connection established');
              setProgressUpdates(prev => [...prev, { icon: UploadCloud, message: 'Connected to analysis service...', stage: 'CONNECTED' }]);
            } else {
              // Handle non-SSE responses or errors indicated by status code
              let errorMsg = `Connection failed: ${response.status} ${response.statusText}`;
              if (response.status === 400) { // Specific handling for bad requests (e.g., wrong file type if backend checked again)
                  try {
                    const errData = await response.json();
                    errorMsg = `Upload error: ${errData.message || 'Bad request'}`;
                  } catch { /* Ignore parsing error */ }
              }
              throw new Error(errorMsg); // This will be caught by onerror
            }
          },

          onmessage: (event) => {
            console.log('SSE Message:', event.event, event.data);
            try {
              const data = JSON.parse(event.data);

              if (event.event === 'status') {
                // Determine icon and pulse based on stage
                let icon = Info;
                let pulse = false;
                if (data.stage?.includes('UPLOAD')) icon = UploadCloud;
                if (data.stage?.includes('PROCESSING')) icon = FileCheck2;
                if (data.stage?.includes('API_CALL') || data.stage?.includes('ANALYSIS')) icon = BrainCircuit;
                if (data.stage?.includes('START') || data.stage?.includes('WAIT') || data.stage?.includes('PROCESSING_UPDATE') && data.fileState === 'PROCESSING') pulse = true;
                if (data.stage?.includes('COMPLETE') || data.stage?.includes('ACTIVE')) icon = CheckCircle;
                if (data.stage?.includes('ERROR') || data.stage?.includes('FAIL') || data.stage?.includes('TIMEOUT')) icon = XCircle;

                // Update stage tracking
                if (data.stage?.includes('UPLOAD')) setCurrentStage('UPLOADING');
                else if (data.stage?.includes('PROCESSING')) setCurrentStage('PROCESSING');
                else if (data.stage?.includes('ANALYSIS') || data.stage?.includes('API_CALL')) setCurrentStage('ANALYZING');

                setProgressUpdates(prev => [...prev, { icon, message: data.message, stage: data.stage, pulse }]);
              }
              else if (event.event === 'complete') {
                console.log('Analysis Complete Data:', data.data);
                setAnalysisResult(data.data); // Set the final structured result
                setCurrentStage('COMPLETE');
                setProgressUpdates(prev => [...prev, { icon: Sparkles, message: 'Analysis complete!', stage: 'DONE' }]);
                controller.abort(); // Close connection on completion
              }
              else if (event.event === 'error') { // Handle custom error events from backend
                 console.error('Backend Error Event:', data.message);
                 setError(data.message || 'An error occurred during analysis.');
                 setCurrentStage('ERROR');
                 setProgressUpdates(prev => [...prev, { icon: XCircle, message: `Error: ${data.message}`, stage: data.stage || 'BACKEND_ERROR' }]);
                 controller.abort(); // Close connection on error
              }

            } catch (e) {
              console.error("Failed to parse SSE message data:", event.data, e);
               // Handle cases where data might not be JSON (less likely with status/complete/error)
               setProgressUpdates(prev => [...prev, { icon: AlertTriangle, message: 'Received unreadable status update.', stage: 'PARSE_ERROR' }]);
            }
          },

          onclose: () => {
            console.log('SSE Connection closed');
            // Don't set loading false here if result already arrived or error occurred
            if (currentStage !== 'COMPLETE' && currentStage !== 'ERROR') {
                // If connection closes unexpectedly before completion/error signal
                // setError("Connection closed unexpectedly. Analysis may be incomplete.");
                // setCurrentStage('ERROR'); // Or a different state like 'INTERRUPTED'
                console.warn("SSE connection closed before a final state was reached.");
            }
          },

          onerror: (err) => {
            console.error('SSE Fetch Error:', err);
             let errorMsg = 'Analysis failed. Could not connect or stay connected to the analysis service.';
             // Check if it's an AbortError from deliberate cancellation
             if (err.name !== 'AbortError') {
                 // Try to refine the message if possible (e.g., network error)
                 if (err instanceof Error) {
                    errorMsg = err.message.includes('NetworkError') ? 'Network error. Please check your connection.' : err.message;
                 }
                 setError(errorMsg);
                 setCurrentStage('ERROR');
                 setProgressUpdates(prev => [...prev, { icon: XCircle, message: `Connection Error: ${errorMsg}`, stage: 'FETCH_ERROR' }]);
             } else {
                 console.log("Fetch aborted (likely intentional on complete/error/unmount)");
             }
             // Rethrowing the error might be necessary depending on fetchEventSource's internal handling
             // but usually setting state is sufficient. We definitely don't want to retry automatically here.
             // throw err; // Avoid automatic retries by fetchEventSource
          }
        });
      } catch (error) {
         // Catch synchronous errors during setup (less likely)
         console.error("Error setting up SSE fetch:", error);
         setError(`Failed to initiate analysis: ${error.message}`);
         setCurrentStage('ERROR');
      }
    };

    fetchData();

    // Cleanup function: Abort fetch if component unmounts
    return () => {
      console.log("ResultPage unmounting, aborting SSE fetch.");
      ctrlRef.current.abort();
    };

  }, [location.state, navigate]); // Re-run if location.state changes (though it shouldn't normally)


  // --- UI Helper Functions (Keep as before) ---
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 65) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-500';
  };

  // --- Render Logic ---
  const isLoading = currentStage !== 'COMPLETE' && currentStage !== 'ERROR';

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-extrabold text-center text-foreground sm:text-4xl">
        Resume Analysis
      </h1>

      {/* Loading/Progress State */}
      {isLoading && (
        <Card className="overflow-hidden shadow-lg border-border/60">
          <CardHeader className="bg-muted/30 border-b border-border/50 p-4 sm:p-6">
            <CardTitle className="text-2xl flex items-center">
              <Loader2 className="w-6 h-6 mr-2 text-primary animate-spin" /> Analysis in Progress...
            </CardTitle>
            <CardDescription>Please wait while we analyze your resume. This may take a minute or two.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Display Progress Updates */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {progressUpdates.map((update, index) => (
                <StatusUpdate key={index} {...update} />
                ))}
            </div>
            {/* Optional overall progress bar */}
             <Progress
                value={
                    currentStage === 'UPLOADING' ? 25 :
                    currentStage === 'PROCESSING' ? 50 :
                    currentStage === 'ANALYZING' ? 75 :
                    currentStage === 'INIT' ? 5 : 0 // Initial small progress
                }
                className="mt-4 h-2"
             />
             <p className="text-xs text-center mt-2 text-muted-foreground">{currentStage}...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {currentStage === 'ERROR' && (
         <>
            <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error || "An unknown error occurred."}</AlertDescription>
            </Alert>
            {/* Show prior progress if available */}
            {progressUpdates.length > 0 && (
                 <Card className="mt-4 border-destructive/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Last known status:</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-40 overflow-y-auto pr-2">
                         {progressUpdates.slice(-5).map((update, index) => ( // Show last few updates
                            <StatusUpdate key={index} {...update} />
                         ))}
                    </CardContent>
                 </Card>
            )}
        </>
      )}

      {/* Success State: Display Results */}
      {currentStage === 'COMPLETE' && analysisResult && (
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

          {/* Detailed Accordion (Keep structure as before) */}
           <Accordion type="multiple" collapsible={false} defaultValue={['item-breakdown', 'item-keywords']} className="w-full space-y-4">
              {/* Section Breakdown */}
              <AccordionItem value="item-breakdown" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
                 <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">Section-by-Section Feedback</AccordionTrigger>
                 <AccordionContent className="p-4 sm:p-6 pt-0 space-y-4">
                 {analysisResult.sectionBreakdown.map((section, index) => (
                    <div key={index} className="p-3 border border-border/50 rounded-md bg-muted/20">
                       <h4 className="font-semibold text-foreground mb-1">{section.title}</h4>
                       {section.strength && <p className="text-sm text-green-700 dark:text-green-400 flex"><CheckCircle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" /> {section.strength}</p>}
                       {section.improvement && <p className="text-sm text-yellow-700 dark:text-yellow-400 flex"><AlertTriangle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" /> {section.improvement}</p>}
                       {section.alert && <p className="text-sm text-red-700 dark:text-red-500 flex"><XCircle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" /> {section.alert}</p>}
                    </div>
                 ))}
                 </AccordionContent>
              </AccordionItem>

              {/* Keyword Analysis */}
              <AccordionItem value="item-keywords" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
                 <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">Keyword Analysis</AccordionTrigger>
                 <AccordionContent className="p-4 sm:p-6 pt-0 space-y-4">
                    <div>
                       <h4 className="font-medium text-foreground mb-2">Matched Keywords:</h4>
                       <div className="flex flex-wrap gap-2">
                       {analysisResult.keywordAnalysis.matched.map(kw => <Badge key={kw} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700">{kw}</Badge>)}
                       </div>
                    </div>
                    <div>
                       <h4 className="font-medium text-foreground mb-2">Missing Keywords:</h4>
                       <div className="flex flex-wrap gap-2">
                       {analysisResult.keywordAnalysis.missing.map(kw => <Badge key={kw} variant="destructive">{kw}</Badge>)}
                       </div>
                    </div>
                    {analysisResult.keywordAnalysis.recommendation && (
                       <Alert className="mt-4 border-primary/30">
                          <Target className="h-4 w-4" />
                          <AlertTitle>Recommendation</AlertTitle>
                          <AlertDescription>{analysisResult.keywordAnalysis.recommendation}</AlertDescription>
                       </Alert>
                    )}
                 </AccordionContent>
              </AccordionItem>

              {/* Formatting Checks */}
              <AccordionItem value="item-formatting" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
                 <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">Formatting & ATS Compatibility</AccordionTrigger>
                 <AccordionContent className="p-4 sm:p-6 pt-0 space-y-2">
                    <ul className="text-sm text-muted-foreground">
                       {analysisResult.formattingChecks.map((checkItem, index) => (
                       <li key={index} className="flex items-center">
                          {checkItem.passed ? <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />}
                          {checkItem.check} - <span className={checkItem.passed ? 'font-medium text-green-600 dark:text-green-400' : 'font-medium text-red-600 dark:text-red-500'}>{checkItem.passed ? 'Passed' : 'Check'}</span>
                          {checkItem.comment && <span className="ml-2 italic text-xs">({checkItem.comment})</span>} {/* Display comment if present */}
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