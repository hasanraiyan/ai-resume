
# **Resume Analysis API Documentation**

## Endpoint: `/analyse-resume`

### **`POST /analyse-resume`**

#### **Summary**

Uploads a user's resume file (PDF, JPG, PNG) for analysis by the Google Gemini AI model. The endpoint establishes a Server-Sent Events (SSE) connection to provide real-time status updates during the upload, file processing, and analysis phases. Upon successful completion, it streams the final JSON analysis result. Errors during the process are also reported via the SSE stream.

#### **Authentication**

*   This endpoint itself does not require user authentication by default.
*   **Server-Side Prerequisite:** The server hosting this API **must** have a valid `GEMINI_API_KEY` configured in its environment variables (`.env` file) to communicate with the Google Generative AI services.

#### **Request**

*   **Method:** `POST`
*   **Headers:**
    *   `Content-Type`: `multipart/form-data` (This is typically set automatically by HTTP clients when sending `FormData`).
*   **Body:** `multipart/form-data` containing:
    *   **`resumeFile`** (File): The resume file to be analyzed.
        *   **Required:** Yes
        *   **Allowed Mime Types:**
            *   `application/pdf` (PDF)
            *   `image/jpeg` (JPEG)
            *   `image/png` (PNG)
            *   `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX - **Note:** Direct analysis might be limited, see Considerations)
            *   `application/msword` (DOC - **Note:** Direct analysis might be limited, see Considerations)
        *   **Maximum Size:** 50MB (Configured in `multer`)

#### **Response (Success - Server-Sent Events Stream)**

If the initial file upload is accepted, the server responds with:

*   **Status Code:** `200 OK`
*   **Headers:**
    *   `Content-Type`: `text/event-stream`
    *   `Cache-Control`: `no-cache`
    *   `Connection`: `keep-alive`

The connection remains open, and the server pushes events formatted as:

```
event: <event_name>
data: <json_payload_string>

```

**Possible Event Names and Data Payloads:**

1.  **`event: status`**: Indicates progress updates throughout the analysis lifecycle.
    *   **`data`** (JSON Object):
        *   `message` (String): A human-readable status message.
        *   `stage` (String): A machine-readable identifier for the current stage. Possible values include:
            *   `START`: Initial request received.
            *   `UPLOAD_START`: Attempting to upload the file to Gemini.
            *   `UPLOAD_COMPLETE`: File successfully uploaded to Gemini's servers. (May include `fileInfo` object).
            *   `PROCESSING_START`: Waiting for Gemini to process the uploaded file.
            *   `PROCESSING_UPDATE`: File processing status update from Gemini (includes `fileState`).
            *   `PROCESSING_COMPLETE`: File processing finished successfully.
            *   `PROCESSING_ERROR`: Error occurred while checking file status.
            *   `PROCESSING_FAILED`: File processing failed on Gemini's side. (includes `fileState`).
            *   `PROCESSING_TIMEOUT`: File processing timed out.
            *   `PROCESSING_INCOMPLETE`: One or more files failed processing (relevant if multiple files were theoretically supported).
            *   `EXTRACTION_NEEDED`: File type requires text extraction before analysis (currently not implemented for DOCX).
            *   `ANALYSIS_START`: Preparing the analysis request for the Gemini model.
            *   `API_CALL`: Sending the request to the Gemini model.
            *   `RESPONSE_PROCESSING`: Processing the response received from Gemini.
        *   `fileInfo` (Object, Optional): Included during `UPLOAD_COMPLETE`. Contains details like `name`, `displayName`, `uri`, `mimeType` of the uploaded Gemini file.
        *   `fileState` (String, Optional): Included during `PROCESSING_UPDATE`, `PROCESSING_FAILED`. The state reported by the Gemini File API (e.g., `ACTIVE`, `FAILED`).

2.  **`event: complete`**: Indicates the analysis finished successfully and the final result is available. This event terminates the stream.
    *   **`data`** (JSON Object):
        *   `success` (Boolean): `true`
        *   `data` (Object): The structured JSON analysis result conforming to the `responseSchema` defined in the Gemini model configuration (contains `overallScore`, `summaryText`, `sectionBreakdown`, `keywordAnalysis`, `formattingChecks`, `recommendations`).

3.  **`event: error`**: Indicates an error occurred *after* the initial connection was established (e.g., during file processing, Gemini API call, or response parsing). This event terminates the stream.
    *   **`data`** (JSON Object):
        *   `success` (Boolean): `false`
        *   `message` (String): A description of the error.
        *   `stage` (String, Optional): The stage identifier where the error occurred, if identifiable.

#### **Response (Error - HTTP Status Codes)**

These errors occur *before* the SSE stream is established:

*   **`400 Bad Request`**:
    *   **Cause:** Invalid request format.
        *   No file uploaded with the name `resumeFile`.
        *   Uploaded file type is not allowed (e.g., `.zip`, `.txt`).
        *   Uploaded file exceeds the size limit (50MB).
        *   Other `multer` errors.
    *   **Body** (JSON Object):
        ```json
        {
          "success": false,
          "message": "Specific error message (e.g., No file uploaded, Invalid file type, File too large)"
        }
        ```

*   **`500 Internal Server Error`**:
    *   **Cause:** An unexpected error occurred on the server *before* the SSE stream could be established (e.g., issues initializing Gemini clients, unexpected exceptions). If an error happens *during* the streaming process, it should be reported via the `error` event instead.
    *   **Body:** May vary, often a generic error message or HTML depending on the server framework's configuration.

#### **Example Usage (`curl`)**

```bash
# Replace 'path/to/your/resume.pdf' with the actual file path
# Note: curl will print the raw SSE stream. Use -N for continuous output.
curl -X POST \
     -F "resumeFile=@path/to/your/resume.pdf" \
     http://localhost:3000/analyse-resume -N
```

**Expected Output (Stream):**

```
event: status
data: {"message":"Request received, starting analysis...","stage":"START"}

event: status
data: {"message":"Attempting to upload file: resume.pdf...","stage":"UPLOAD_START"}

event: status
data: {"message":"Uploaded file resume.pdf as files/xxxxxx","stage":"UPLOAD_COMPLETE","fileInfo":{"name":"files/xxxxxx", ...}}

event: status
data: {"message":"Waiting for file processing...","stage":"PROCESSING_START"}

event: status
data: {"message":"File resume.pdf state: PROCESSING","stage":"PROCESSING_UPDATE","fileState":"PROCESSING"}

# ... more processing updates ...

event: status
data: {"message":"File resume.pdf state: ACTIVE","stage":"PROCESSING_UPDATE","fileState":"ACTIVE"}

event: status
data: {"message":"All files processed successfully.","stage":"PROCESSING_COMPLETE"}

event: status
data: {"message":"Preparing analysis request...","stage":"ANALYSIS_START"}

event: status
data: {"message":"Sending request to Gemini for analysis...","stage":"API_CALL"}

event: status
data: {"message":"Processing Gemini response...","stage":"RESPONSE_PROCESSING"}

event: complete
data: {"success":true,"data":{"overallScore":85,"summaryText":"...","sectionBreakdown":[...],"keywordAnalysis":{...},"formattingChecks":[...],"recommendations":[...]}}

# (Connection closes after 'complete' or 'error' event)
```

#### **Considerations**

*   **DOCX/DOC Support:** The Gemini File API might not optimally extract text content from `.docx` or `.doc` files for analysis compared to PDFs or images. The current implementation attempts upload but may not yield good results. A more robust solution would involve server-side text extraction *before* sending content to Gemini.
*   **SSE Client Implementation:** Clients interacting with this endpoint must use an SSE client library (like `EventSource` in browsers) to handle the streaming events correctly. A simple `fetch` or `axios` call will only receive the initial headers unless specifically configured for streaming, and won't parse the events easily.
*   **Connection Handling:** The SSE connection is kept alive until the `complete` or `error` event is sent, or until the client disconnects. Ensure clients handle disconnection and potential timeouts gracefully.
*   **Error Handling:** Errors occurring *during* the analysis (after the initial 200 OK) are sent via the `error` event, not as HTTP status codes.
*   **Scalability:** For high-concurrency scenarios, managing many persistent SSE connections might require infrastructure considerations (e.g., load balancers aware of sticky sessions, potentially moving to WebSockets or a message queue system for status updates).
