import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import mime from 'mime-types';
import 'dotenv/config';
import cors from 'cors';
import { fileURLToPath } from 'url';

// --- Configuration & Initialization ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// const allowedOrigins = ['https://ai-resume-analyser-hackathon.vercel.app'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

app.use(cors());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// Multer configuration for temporary file storage
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        // Create a unique filename to avoid collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size (e.g., 50MB)
    fileFilter: (req, file, cb) => {
        // Accept specific file types
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOCX, JPG, PNG are allowed.'), false);
        }
    }
});

// --- Gemini Model & Generation Configuration  ---
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: { role: "system", parts: [{ text: "# ROLE & GOAL\nYou are \"ResumeRefine AI,\" a highly sophisticated resume analysis engine. Your primary goal is to provide detailed, actionable feedback to help users significantly improve their resume's effectiveness for passing Applicant Tracking Systems (ATS) and impressing human recruiters/hiring managers. You act as an objective but supportive career coach.\n\n# CORE TASK\nAnalyze the resume content provided by the user thoroughly based on the extracted text. Your analysis MUST cover the following dimensions:\n\n1.  **ATS Friendliness & Keyword Optimization:** Evaluate structure, identify keywords (general or specific if context provided), suggest additions.\n2.  **Impact & Quantification:** Assess action verbs, find opportunities for metrics, flag vague statements.\n3.  **Clarity, Conciseness & Professional Tone:** Check language, grammar, typos, jargon.\n4.  **Formatting & Readability (Inferred from Text):** Evaluate logical flow, scannability, consistency based *only* on the text content provided.\n5.  **Content Relevance & Completeness:** Evaluate summary/objective, experience details (responsibilities AND achievements), skills section.\n\n# OUTPUT STRUCTURE\nGenerate a JSON object strictly conforming to the provided `responseSchema`.\n\n# CONSTRAINTS\n*   Base analysis ONLY on provided text content. Do not invent details.\n*   Maintain objective, constructive tone.\n*   Provide concrete, actionable advice.\n*   Do NOT guarantee job placement.\n*   If content is ambiguous, state what's needed for better analysis (within the JSON structure if possible, e.g., in recommendations or summary).\n*   Refer to the input as 'the resume content provided'." }] },
});

const generationConfig = {
    temperature: 0.4,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        description: "Represents the output of a comprehensive resume analysis.",
        properties: {
            overallScore: { type: "integer", format: "int32", description: "Overall score (out of 100).", example: 78 },
            summaryText: { type: "string", description: "Brief summary (2-4 sentences).", example: "Good skills, needs quantification." },
            sectionBreakdown: { type: "array", description: "Section analysis.", items: { type: "object", properties: { title: { type: "string" }, strength: { type: "string" }, improvement: { type: "string", nullable: true }, alert: { type: "string", nullable: true } }, required: ["title", "strength"] } },
            keywordAnalysis: { type: "object", description: "Keyword check.", properties: { matched: { type: "array", items: { type: "string" } }, missing: { type: "array", items: { type: "string" } }, recommendation: { type: "string" } }, required: ["matched", "missing", "recommendation"] },
            formattingChecks: { type: "array", description: "Inferred formatting checks.", items: { type: "object", properties: { check: { type: "string" }, passed: { type: "boolean" }, comment: { type: "string", nullable: true } }, required: ["check", "passed"] } },
            recommendations: { type: "array", description: "Top 3-5 recommendations.", items: { type: "string" } }
        },
        required: ["overallScore", "summaryText", "sectionBreakdown", "keywordAnalysis", "formattingChecks", "recommendations"]
    },
};

function sendStatusUpdate(res, eventName, data) {
    // Check if the connection is still open before writing
    if (!res.writableEnded) {
        res.write(`event: ${eventName}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    } else {
        console.log("Attempted to write to a closed SSE connection.");
    }
}

/**
 * Maps common upload mime types to Gemini-compatible types.
 * @param {string} uploadMimeType - Mime type from the uploaded file.
 * @returns {string|null} Gemini-compatible mime type or null if unsupported.
 */
function getGeminiMimeType(uploadMimeType) {

    const mapping = {
        'application/pdf': 'application/pdf',
        'image/png': 'image/png',
        'image/jpeg': 'image/jpeg',
        'image/heic': 'image/heic',
        'image/heif': 'image/heif',
        'image/webp': 'image/webp',

    };

    if (uploadMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || uploadMimeType === 'application/msword') {
        console.warn(`Direct DOCX/DOC upload to Gemini File API might not work as expected. Consider extracting text first.`);
        // Returning null will prevent upload attempt for now
        return null;
    }


    return mapping[uploadMimeType] || null;
}


async function uploadToGemini(filePath, mimeType, sendStatus, res) {
    sendStatus(res, 'status', { message: `Attempting to upload file: ${path.basename(filePath)}...`, stage: 'UPLOAD_START' });
    try {
        // Map the uploaded mime type to a Gemini compatible one
        const geminiMimeType = getGeminiMimeType(mimeType);
        if (!geminiMimeType) {
            throw new Error(`Unsupported mime type for direct Gemini upload: ${mimeType}. Consider text extraction.`);
        }

        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: geminiMimeType, // Use the mapped type
            displayName: path.basename(filePath),
        });
        const file = uploadResult.file;
        sendStatus(res, 'status', { message: `Uploaded file ${file.displayName} as ${file.name}`, stage: 'UPLOAD_COMPLETE', fileInfo: { name: file.name, displayName: file.displayName, uri: file.uri, mimeType: file.mimeType } });
        console.log(`Uploaded file ${file.displayName} as: ${file.name} with URI: ${file.uri}`);
        return file;
    } catch (error) {
        console.error(`Error during file upload for ${filePath}:`, error);
        throw new Error(`Gemini file upload failed: ${error.message || 'Unknown error'}`); // Rethrow a more specific error
    }
}


async function waitForFilesActive(files, sendStatus, res) {
    if (!files || files.length === 0) {
        console.log("No files to wait for.");
        return true; // Indicate success as there's nothing to wait for
    }
    sendStatus(res, 'status', { message: "Waiting for file processing...", stage: 'PROCESSING_START' });
    console.log("Waiting for file processing...");

    let allActive = true;
    const MAX_POLL_ATTEMPTS = 24; // Approx 4 minutes (24 * 10 seconds)
    const POLLING_INTERVAL_MS = 10_000; // 10 seconds

    for (const fileRef of files) {
        const name = fileRef.name;
        let file;
        let attempts = 0;
        let processing = true;
        let lastState = '';

        while (processing && attempts < MAX_POLL_ATTEMPTS) {
            try {
                file = await fileManager.getFile(name);
            } catch (error) {
                console.error(`\nError checking file status for ${name}:`, error.message || error);
                sendStatus(res, 'status', { message: `Error checking status for ${name}.`, stage: 'PROCESSING_ERROR' });
                allActive = false;
                processing = false;
                continue;
            }

            if (file.state !== lastState) {
                sendStatus(res, 'status', { message: `File ${file.displayName} state: ${file.state}`, stage: 'PROCESSING_UPDATE', fileState: file.state });
                lastState = file.state;
            }

            if (file.state === "ACTIVE") {
                console.log(` File ${file.displayName} active.`);
                processing = false;
            } else if (file.state === "PROCESSING") {
                console.log(` File ${file.displayName} processing... Attempt ${attempts + 1}/${MAX_POLL_ATTEMPTS}`);
                attempts++;
                await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
            } else {
                console.log(`\nFile ${file.name} reached non-active/processing state: ${file.state}`);
                sendStatus(res, 'status', { message: `File ${file.displayName} processing failed or stopped. State: ${file.state}`, stage: 'PROCESSING_FAILED', fileState: file.state });
                allActive = false;
                processing = false;
            }
        }

        if (processing && attempts >= MAX_POLL_ATTEMPTS) {
            console.log(`\nFile ${name} timed out waiting for processing.`);
            sendStatus(res, 'status', { message: `File ${fileRef.displayName} timed out during processing.`, stage: 'PROCESSING_TIMEOUT' });
            allActive = false;
        }
    } // End for loop

    if (allActive) {
        sendStatus(res, 'status', { message: "All files processed successfully.", stage: 'PROCESSING_COMPLETE' });
        console.log("\n...all files ready.\n");
        return true;
    } else {
        sendStatus(res, 'status', { message: "One or more files did not become active or failed processing.", stage: 'PROCESSING_INCOMPLETE' });
        console.log("\n...one or more files did not become active or failed.\n");
        return false;
    }
}

// --- Main Analysis Function ---
async function performAnalysis(filePath, fileMimeType, sendStatus, res) {
    let uploadedFile = null;
    let analysisResult = null;
    let fileIsReady = false;

    try {
        // 1. Upload File to Gemini
        const geminiMimeType = getGeminiMimeType(fileMimeType);
        if (geminiMimeType) {
            uploadedFile = await uploadToGemini(filePath, fileMimeType, sendStatus, res); // Pass mime type from upload

            // 2. Wait for File Processing
            if (uploadedFile) {
                fileIsReady = await waitForFilesActive([uploadedFile], sendStatus, res);
                if (!fileIsReady) {
                    throw new Error(`File ${uploadedFile.displayName} failed to process in time.`);
                }
            }
        } else {

            console.warn(`File type ${fileMimeType} not directly uploaded. Text extraction needed but not implemented in this example.`);
            sendStatus(res, 'status', { message: `File type ${fileMimeType} requires text extraction before analysis (not implemented).`, stage: 'EXTRACTION_NEEDED' });
            throw new Error(`Analysis for ${fileMimeType} requires a text extraction step.`);
        }


        // 3. Prepare Prompt for Gemini
        sendStatus(res, 'status', { message: "Preparing analysis request...", stage: 'ANALYSIS_START' });
        const promptParts = [];

        if (uploadedFile && fileIsReady && uploadedFile.uri) {
            console.log(`Including processed file ${uploadedFile.name} in the prompt.`);
            promptParts.push({
                fileData: {
                    mimeType: uploadedFile.mimeType, // Use the mimeType confirmed by Gemini
                    fileUri: uploadedFile.uri,
                },
            });
            promptParts.push({ text: "\nPlease analyze the resume content provided in the file according to the requirements and JSON schema." });
        } else {

            console.warn("No valid file data available for analysis.");
            throw new Error("Cannot perform analysis without a successfully processed file.");

        }

        // 4. Call Gemini API
        sendStatus(res, 'status', { message: "Sending request to Gemini for analysis...", stage: 'API_CALL' });
        console.log("Sending request to Gemini...");

        const chatSession = model.startChat({
            generationConfig,
            history: [],

        });

        const result = await chatSession.sendMessage(promptParts);

        // 5. Process Response
        sendStatus(res, 'status', { message: "Processing Gemini response...", stage: 'RESPONSE_PROCESSING' });
        console.log("Processing Gemini response...");

        if (result?.response && typeof result.response.text === 'function') {
            const jsonString = result.response.text();
            try {
                analysisResult = JSON.parse(jsonString);
                console.log("Received valid JSON response.");
                // Send final result via SSE
                sendStatus(res, 'complete', { success: true, data: analysisResult });
            } catch (parseError) {
                console.error("Error: Received INVALID JSON format from Gemini.");
                console.error("Parsing Error:", parseError.message);
                console.error("Received String (first 500 chars):", jsonString.substring(0, 500));
                throw new Error(`Gemini returned invalid JSON. ${parseError.message}`);
            }
        } else {
            console.error("Error: Unexpected response structure from Gemini.");
            console.log("Received Response:", JSON.stringify(result, null, 2));
            throw new Error("Unexpected response structure received from Gemini API.");
        }

    } catch (error) {
        console.error("Error during analysis process:", error);
        // Send error via SSE
        sendStatus(res, 'error', { success: false, message: error.message || "An unknown error occurred during analysis.", stage: error.stage || 'UNKNOWN_ERROR' }); // Include stage if available
        // Ensure the result is null if an error occurred
        analysisResult = null;
    } finally {
        // 6. Cleanup Temporary File
        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting temporary file ${filePath}:`, err);
                } else {
                    console.log(`Deleted temporary file: ${filePath}`);
                }
            });
        }
        // Close the SSE connection if it's still open
        if (!res.writableEnded) {
            console.log("Closing SSE connection from finally block.");
            res.end();
        }
    }

}


// --- Express Route ---

app.post('/analyse-resume', upload.single('resumeFile'), (req, res) => {
    console.log("Received request for /analyse-resume");

    // Check if file was uploaded
    if (!req.file) {
        console.log("No file uploaded.");
        return res.status(400).json({ success: false, message: 'No file uploaded. Please attach a resume file.' });
    }

    const filePath = req.file.path;
    const fileMimeType = req.file.mimetype; 

    console.log(`File uploaded: ${req.file.originalname} (${fileMimeType}), saved to ${filePath}`);

    // --- Setup SSE ---
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Flush the headers to establish the connection

    // Send initial confirmation
    sendStatusUpdate(res, 'status', { message: 'Request received, starting analysis...', stage: 'START' });

    // Handle client disconnect
    req.on('close', () => {
        console.log('Client disconnected SSE connection.');
        // Optional: Add logic here to attempt cancellation of ongoing Gemini tasks if possible/needed
        // Clean up the temp file if analysis hasn't finished yet
        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting temp file on disconnect ${filePath}:`, err);
                else console.log(`Deleted temp file on disconnect: ${filePath}`);
            });
        }
        // Ensure the response stream is ended on the server side as well
        if (!res.writableEnded) {
            res.end();
        }
    });


    performAnalysis(filePath, fileMimeType, sendStatusUpdate, res)
        .then(() => {
            console.log("Analysis process finished (results sent via SSE).");
            // Ensure connection is closed if performAnalysis didn't close it already (e.g., successful completion)
            if (!res.writableEnded) {
                console.log("Closing SSE connection after successful completion.");
                res.end();
            }
        })
        .catch(err => {
            // Errors should have been sent via SSE already by performAnalysis
            console.error("Caught error after performAnalysis call (should have been handled via SSE):", err.message);
            // Ensure connection is closed on unexpected errors caught here
            if (!res.writableEnded) {
                console.log("Closing SSE connection due to error caught after analysis call.");
                // Send a final generic error if one wasn't sent
                sendStatusUpdate(res, 'error', { success: false, message: 'An unexpected server error occurred.' });
                res.end();
            }
        });


});

// Basic root route
app.get('/', (req, res) => {
    res.send('Resume Analysis API is running. Use POST /analyse-resume to submit a file.');
});

app.get('/server-alive', (req, res) => {
    res.send('Server is alive')
})

// Error handling middleware for multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error("Multer Error:", err);
        res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
    } else if (err) {
        // An unknown error occurred (e.g., file type filter).
        console.error("File Upload Filter/Other Error:", err);
        res.status(400).json({ success: false, message: err.message || "File upload failed." });
    } else {
        next();
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Upload directory: ${UPLOAD_DIR}`);
});