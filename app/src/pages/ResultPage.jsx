// src/pages/ResultPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import {
  Loader2, Info, CheckCircle, XCircle, Target, ListChecks, AlertTriangle, Sparkles,
  UploadCloud, FileCheck2, BrainCircuit, // Existing icons
  ServerCog, // Added for processing/backend steps
  FileText,  // Added for parsing
  Zap,       // Added for speed/connection
  Hourglass  // Added for waiting steps
} from 'lucide-react';

// --- Helper Component for Animated Status Updates ---
// No changes needed here, it's already good.
const StatusUpdate = ({ icon: Icon, message, stage, pulse = false }) => (
  <div className="flex items-center space-x-3 p-3 bg-muted/40 rounded-md border border-border/30 mb-2 shadow-sm">
    <Icon className={`h-5 w-5 text-primary flex-shrink-0 ${pulse ? 'animate-pulse' : ''}`} />
    <span className="text-sm text-foreground flex-1">{message}</span>
    {stage && <Badge variant="outline" className="text-xs whitespace-nowrap">{stage}</Badge>}
  </div>
);

// --- Main Component ---
export function ResultPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [progressUpdates, setProgressUpdates] = useState([]); // Store status messages
  const [currentStage, setCurrentStage] = useState('INIT'); // Track current high-level stage
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const ctrlRef = useRef(new AbortController()); // AbortController for fetchEventSource
  const latestStageRef = useRef(currentStage); // Ref to track latest stage for onclose logic

  // Update ref whenever currentStage changes
  useEffect(() => {
    latestStageRef.current = currentStage;
  }, [currentStage]);

  useEffect(() => {
    const { resumeFile } = location.state || {};

    if (!resumeFile) {
      setError("No resume file provided. Please navigate back and upload your resume.");
      setCurrentStage('ERROR');
      return;
    }

    const controller = new AbortController();
    ctrlRef.current = controller;

    const fetchData = async () => {
      setCurrentStage('CONNECTING'); // Initial stage before upload attempt
      setProgressUpdates([{ icon: Zap, message: 'Initiating analysis connection...', stage: 'INIT', pulse: true }]);

      const formData = new FormData();
      formData.append('resumeFile', resumeFile);
      // Optional: Add jobDescription if needed
      // if (location.state.jobDescription) {
      //   formData.append('jobDescription', location.state.jobDescription);
      // }

      try {
        await fetchEventSource('https://ai-resume-70ka.onrender.com/analyse-resume', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Accept': 'text/event-stream',
          },
          body: formData,
          signal: controller.signal,

          onopen: async (response) => {
            if (response.ok && response.headers.get('content-type') === 'text/event-stream') {
              console.log('SSE Connection established');
              // Update the first message instead of adding a new one for connection
              setProgressUpdates(prev => prev.map((p, i) => i === 0 ? { ...p, icon: CheckCircle, message: 'Connection established. Starting upload...', pulse: false, stage: 'CONNECTED' } : p));
              setCurrentStage('UPLOADING'); // Move to uploading stage
               // Add a new message specifically for upload start
               setProgressUpdates(prev => [...prev, { icon: UploadCloud, message: 'Uploading your resume...', stage: 'UPLOAD_START', pulse: true }]);
            } else {
              let errorMsg = `Connection failed: ${response.status} ${response.statusText}`;
              try {
                const errData = await response.json();
                errorMsg = `Server error (${response.status}): ${errData.message || response.statusText}`;
              } catch { /* Ignore parsing error, use status text */ }
              throw new Error(errorMsg); // Trigger onerror
            }
          },

          onmessage: (event) => {
            console.log('SSE Message:', event.event, event.data);
            try {
              const data = JSON.parse(event.data);
              let newUpdate = null;

              // Determine icon and user-friendly message based on event/stage
              // This maps backend stages to user-facing messages and icons
              const mapEventToUpdate = (eventData) => {
                const { message: backendMessage, stage } = eventData;
                let icon = Info;
                let pulse = false;
                let userMessage = backendMessage; // Default to backend message
                let majorStage = currentStage; // Keep current major stage unless updated

                // Map backend stages/messages to icons and potentially better user messages
                switch (stage) {
                    case 'UPLOAD_START': // Already handled in onopen potentially
                      icon = UploadCloud; pulse = true; userMessage = "Uploading your resume..."; majorStage = 'UPLOADING'; break;
                    case 'UPLOAD_COMPLETE':
                      icon = CheckCircle; userMessage = "Resume uploaded successfully."; majorStage = 'PROCESSING'; break;
                    case 'FILE_RECEIVED':
                       icon = FileCheck2; userMessage = "Server received the file."; majorStage = 'PROCESSING'; break;
                    case 'PARSING_START':
                       icon = FileText; pulse = true; userMessage = "Extracting text from resume..."; majorStage = 'PROCESSING'; break;
                    case 'PARSING_COMPLETE':
                       icon = CheckCircle; userMessage = "Resume text extracted."; majorStage = 'PROCESSING'; break;
                    case 'PROCESSING_START':
                    case 'PROCESSING_UPDATE': // Generic processing
                       icon = ServerCog; pulse = true; userMessage = "Processing document structure..."; majorStage = 'PROCESSING'; break;
                    case 'ANALYSIS_START':
                    case 'API_CALL_START':
                       icon = BrainCircuit; pulse = true; userMessage = "Engaging AI for analysis (this may take a moment)..."; majorStage = 'ANALYZING'; break;
                    case 'API_CALL_COMPLETE':
                    case 'ANALYSIS_UPDATE':
                       icon = BrainCircuit; pulse = false; userMessage = "AI analysis is progressing..."; majorStage = 'ANALYZING'; break;
                    case 'GENERATING_REPORT':
                       icon = ListChecks; pulse = true; userMessage = "Compiling your feedback report..."; majorStage = 'ANALYZING'; break;
                     case 'WAITING_FOR_SERVICE':
                       icon = Hourglass; pulse = true; userMessage = "Waiting for analysis service availability..."; majorStage = 'ANALYZING'; break; // Example of a waiting state
                     case 'ERROR': // Backend signalled error within status event
                     case 'FAILURE':
                       icon = XCircle; userMessage = `Processing Error: ${backendMessage}`; majorStage = 'ERROR'; break;
                    default: // Handle unknown stages or just use the message
                       icon = Info; pulse = stage?.toLowerCase().includes('wait'); // Pulse if waiting
                       userMessage = backendMessage; // Use the backend message directly
                       // Try to infer major stage if possible
                       if (stage?.includes('UPLOAD')) majorStage = 'UPLOADING';
                       else if (stage?.includes('PROCESS') || stage?.includes('PARS')) majorStage = 'PROCESSING';
                       else if (stage?.includes('ANALYSIS') || stage?.includes('API')) majorStage = 'ANALYZING';
                       break;
                }
                setCurrentStage(majorStage); // Update the major stage tracker
                return { icon, message: userMessage, stage, pulse };
              };


              if (event.event === 'status') {
                 newUpdate = mapEventToUpdate(data);
                 // Avoid adding too many repetitive 'processing' messages if needed
                 // const lastUpdate = progressUpdates[progressUpdates.length - 1];
                 // if (lastUpdate?.stage === data.stage && lastUpdate?.message === newUpdate.message) {
                 //    // Maybe just update pulse? Or skip adding. For now, add all distinct messages.
                 // }
              }
              else if (event.event === 'complete') {
                console.log('Analysis Complete Data:', data.data);
                setAnalysisResult(data.data);
                setCurrentStage('COMPLETE'); // Set final stage
                // Add a final completion message
                newUpdate = { icon: Sparkles, message: 'Analysis complete! Preparing results...', stage: 'DONE' };
                // Ensure the connection closes after processing this message
                setTimeout(() => ctrlRef.current.abort(), 100); // Short delay then abort
              }
              else if (event.event === 'error') { // Handle custom error events from backend
                 console.error('Backend Error Event:', data.message);
                 const errorMsg = data.message || 'An unspecified error occurred during analysis.';
                 setError(errorMsg);
                 setCurrentStage('ERROR');
                 newUpdate = { icon: XCircle, message: `Error: ${errorMsg}`, stage: data.stage || 'BACKEND_ERROR' };
                 setTimeout(() => ctrlRef.current.abort(), 100); // Short delay then abort
              }

              // Add the new update to the list if it exists
              if (newUpdate) {
                setProgressUpdates(prev => [...prev, newUpdate]);
              }

            } catch (e) {
              console.error("Failed to parse SSE message data:", event.data, e);
               setProgressUpdates(prev => [...prev, { icon: AlertTriangle, message: 'Received an unreadable status update from server.', stage: 'PARSE_ERROR' }]);
            }
          },

          onclose: () => {
            console.log('SSE Connection closed.');
             // Use the ref here as state might be stale inside the closure
            if (latestStageRef.current !== 'COMPLETE' && latestStageRef.current !== 'ERROR') {
                // Connection closed unexpectedly before completion or explicit error signal
                console.warn("SSE connection closed unexpectedly. Current stage:", latestStageRef.current);
                 // Avoid setting an error if it might be closing normally right after 'COMPLETE' message was received but state hasn't updated yet
                 if (!analysisResult && !error) { // Only set error if no result/error is already set
                      setError("Connection to the analysis service was lost unexpectedly. The process may be incomplete. Please try again later.");
                      setCurrentStage('ERROR');
                      setProgressUpdates(prev => [...prev, { icon: AlertTriangle, message: 'Connection lost.', stage: 'CONNECTION_CLOSED' }]);
                 }
            }
          },

          onerror: (err) => {
            console.error('SSE Fetch Error:', err);
             // Check if it's an AbortError from deliberate cancellation
             if (err.name === 'AbortError') {
                 console.log("Fetch aborted (expected on complete/error/unmount).");
                 // If aborted *before* completion/error state, it might be an unmount.
                 // The onclose logic might handle unexpected closures better here.
                 return; // Don't treat deliberate aborts as errors
             }

             let errorMsg = 'Analysis failed. Could not connect or stay connected to the analysis service.';
             if (err instanceof Error) {
                 // Provide more specific feedback for common network issues
                if (err.message.includes('Failed to fetch')) { // Common browser network error
                    errorMsg = 'Network error: Could not reach the analysis service. Please check your internet connection.';
                } else {
                     errorMsg = `Connection error: ${err.message}`; // Use the error message if available
                }
             }

             // Avoid setting error if one is already set (e.g., from onopen failure)
             if (!error) {
                setError(errorMsg);
                setCurrentStage('ERROR');
                setProgressUpdates(prev => [...prev, { icon: XCircle, message: errorMsg, stage: 'FETCH_ERROR' }]);
             }

             // Important: Prevent fetchEventSource from retrying automatically on failure.
             // We handle the final error state ourselves. Rethrowing might trigger retries.
             // throw err; // Usually DO NOT rethrow unless you want library retry logic
          }
        });
      } catch (error) {
         // Catch synchronous errors during setup (e.g., invalid URL, less likely)
         console.error("Error setting up SSE fetch:", error);
         setError(`Failed to initiate analysis: ${error.message}`);
         setCurrentStage('ERROR');
         setProgressUpdates(prev => [...prev, { icon: XCircle, message: `Setup Error: ${error.message}`, stage: 'SETUP_FAIL' }]);
      }
    };

    fetchData();

    // Cleanup function: Abort fetch if component unmounts
    return () => {
      console.log("ResultPage unmounting, aborting SSE fetch.");
      ctrlRef.current.abort();
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]); // Only re-run if location.state changes (which usually means a new navigation)


  // --- UI Helper Functions ---
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 65) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-500';
  };

  // Determine progress percentage based on stage
  const getProgressValue = (stage) => {
      switch (stage) {
          case 'INIT': return 5;
          case 'CONNECTING': return 10;
          case 'UPLOADING': return 25;
          case 'PROCESSING': return 50; // Parsing, structure
          case 'ANALYZING': return 75; // API calls, report generation
          case 'COMPLETE': return 100;
          case 'ERROR': return latestStageRef.current === 'UPLOADING' ? 25 : latestStageRef.current === 'PROCESSING' ? 50 : latestStageRef.current === 'ANALYZING' ? 75 : 10; // Show progress up to the point of error
          default: return 0;
      }
  };

  // User-friendly stage names
   const getStageName = (stage) => {
      switch (stage) {
          case 'INIT': return "Initializing";
          case 'CONNECTING': return "Connecting";
          case 'UPLOADING': return "Uploading Resume";
          case 'PROCESSING': return "Processing Document";
          case 'ANALYZING': return "Analyzing Content";
          case 'COMPLETE': return "Complete";
          case 'ERROR': return "Error Occurred";
          default: return "Loading";
      }
   };

  // --- Render Logic ---
  const isLoading = currentStage !== 'COMPLETE' && currentStage !== 'ERROR';

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-extrabold text-center text-foreground sm:text-4xl mb-8">
        Resume Analysis Results
      </h1>

      {/* Loading/Progress State */}
      {isLoading && (
        <Card className="overflow-hidden shadow-lg border-border/60 animate-fade-in"> {/* Added fade-in */}
          <CardHeader className="bg-muted/30 border-b border-border/50 p-4 sm:p-6">
            <CardTitle className="text-2xl flex items-center">
              <Loader2 className="w-6 h-6 mr-3 text-primary animate-spin" />
              Analysis in Progress...
            </CardTitle>
            <CardDescription>We're analyzing your resume. Feel free to monitor the progress below.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
             {/* Overall Progress Bar */}
             <div>
                 <Progress value={getProgressValue(currentStage)} className="h-2 mb-1" />
                 <p className="text-sm font-medium text-center text-primary">{getStageName(currentStage)}</p>
             </div>

            {/* Detailed Progress Updates */}
            <div className="border rounded-lg p-3 bg-background max-h-72 overflow-y-auto space-y-2 custom-scrollbar"> {/* Added scrollbar styling class */}
                {progressUpdates.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">Waiting for updates...</div>
                ) : (
                    progressUpdates.map((update, index) => (
                        <StatusUpdate key={index} {...update} />
                    ))
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {currentStage === 'ERROR' && (
         <div className="animate-fade-in"> {/* Added fade-in */}
            <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-5 w-5" /> {/* Slightly larger icon */}
                <AlertTitle className="font-semibold text-lg">Analysis Failed</AlertTitle> {/* Bolder title */}
                <AlertDescription>{error || "An unknown error occurred. Please try again later."}</AlertDescription>
            </Alert>
            {/* Show prior progress if available */}
            {progressUpdates.length > 1 && ( // Show only if there's more than the initial message
                 <Card className="border-destructive/30 bg-destructive/5">
                    <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-base font-medium text-destructive-foreground">Last known steps:</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-48 overflow-y-auto px-4 pb-3 space-y-1 custom-scrollbar">
                         {/* Show last few updates, excluding the final error message itself if it's in the list */}
                         {progressUpdates
                            .filter(update => update.stage !== 'FETCH_ERROR' && update.stage !== 'BACKEND_ERROR' && update.stage !== 'SETUP_FAIL' && update.stage !== 'CONNECTION_CLOSED')
                            .slice(-5) // Show up to last 5 non-error updates
                            .map((update, index) => (
                                <StatusUpdate key={index} {...update} />
                         ))}
                    </CardContent>
                 </Card>
            )}
        </div>
      )}

      {/* Success State: Display Results */}
      {currentStage === 'COMPLETE' && analysisResult && (
        <div className="space-y-6 animate-fade-in"> {/* Added fade-in and consistent spacing */}
          {/* Score Card */}
          <Card className="overflow-hidden shadow-lg border-border/60">
            {/* ... Score Card Content (no changes needed) ... */}
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
            {/* ... Recommendations Card Content (no changes needed) ... */}
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
           <Accordion type="multiple" collapsible={true} // Allow collapsing all
                defaultValue={['item-breakdown']} // Open breakdown by default
                className="w-full space-y-4">
              {/* Section Breakdown */}
              <AccordionItem value="item-breakdown" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
                 {/* ... Section Breakdown Content (no changes needed) ... */}
                 <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">Section-by-Section Feedback</AccordionTrigger>
                 <AccordionContent className="p-4 sm:p-6 pt-0 space-y-4">
                 {analysisResult.sectionBreakdown.map((section, index) => (
                    <div key={index} className="p-3 border border-border/50 rounded-md bg-muted/20">
                       <h4 className="font-semibold text-foreground mb-1">{section.title}</h4>
                       {section.strength && <p className="text-sm text-green-700 dark:text-green-400 flex items-start"><CheckCircle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" /> {section.strength}</p>}
                       {section.improvement && <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start"><AlertTriangle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" /> {section.improvement}</p>}
                       {section.alert && <p className="text-sm text-red-700 dark:text-red-500 flex items-start"><XCircle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" /> {section.alert}</p>}
                    </div>
                 ))}
                 </AccordionContent>
              </AccordionItem>

              {/* Keyword Analysis */}
              <AccordionItem value="item-keywords" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
                 {/* ... Keyword Analysis Content (no changes needed) ... */}
                 <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">Keyword Analysis</AccordionTrigger>
                 <AccordionContent className="p-4 sm:p-6 pt-0 space-y-4">
                    <div>
                       <h4 className="font-medium text-foreground mb-2">Matched Keywords:</h4>
                       <div className="flex flex-wrap gap-2">
                       {analysisResult.keywordAnalysis.matched.map(kw => <Badge key={kw} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700">{kw}</Badge>)}
                       </div>
                       {analysisResult.keywordAnalysis.matched.length === 0 && <p className="text-sm text-muted-foreground italic">No specific keywords matched.</p>}
                    </div>
                    <div>
                       <h4 className="font-medium text-foreground mb-2">Missing Keywords:</h4>
                       <div className="flex flex-wrap gap-2">
                       {analysisResult.keywordAnalysis.missing.map(kw => <Badge key={kw} variant="destructive">{kw}</Badge>)}
                       </div>
                        {analysisResult.keywordAnalysis.missing.length === 0 && <p className="text-sm text-muted-foreground italic">No missing keywords identified.</p>}
                    </div>
                    {analysisResult.keywordAnalysis.recommendation && (
                       <Alert className="mt-4 border-primary/30 bg-primary/5">
                          <Target className="h-4 w-4 text-primary" />
                          <AlertTitle className="text-primary">Keyword Recommendation</AlertTitle>
                          <AlertDescription>{analysisResult.keywordAnalysis.recommendation}</AlertDescription>
                       </Alert>
                    )}
                 </AccordionContent>
              </AccordionItem>

              {/* Formatting Checks */}
              <AccordionItem value="item-formatting" className="bg-card p-0 rounded-lg shadow-sm border border-border data-[state=open]:shadow-md">
                 {/* ... Formatting Checks Content (no changes needed) ... */}
                 <AccordionTrigger className="p-4 sm:p-6 hover:no-underline font-semibold">Formatting & ATS Compatibility</AccordionTrigger>
                 <AccordionContent className="p-4 sm:p-6 pt-0 space-y-2">
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                       {analysisResult.formattingChecks.map((checkItem, index) => (
                       <li key={index} className="flex items-start"> {/* Use items-start for multi-line comments */}
                          {checkItem.passed ? <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />}
                          <div>
                            <span>{checkItem.check} - </span>
                            <span className={checkItem.passed ? 'font-medium text-green-600 dark:text-green-400' : 'font-medium text-red-600 dark:text-red-500'}>{checkItem.passed ? 'Passed' : 'Check'}</span>
                            {checkItem.comment && <span className="ml-1 italic text-xs block text-muted-foreground/80">({checkItem.comment})</span>} {/* Display comment below */}
                          </div>
                       </li>
                       ))}
                    </ul>
                 </AccordionContent>
              </AccordionItem>
           </Accordion>
        </div>
      )}
    </div>
  );
}

// Add simple fade-in animation in your global CSS (e.g., src/index.css)
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root { ... } // your theme variables
}

@layer components {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.5);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: hsl(var(--border));
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary) / 0.8);
  }

  // Simple fade-in animation
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
*/