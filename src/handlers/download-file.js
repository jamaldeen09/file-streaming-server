import { fileURLToPath } from 'url';
import path from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function downloadFile(req, res) {
    // Confirm a fileId was provided
    const fileId = req.params?.fileId;
    if (!fileId) return res.status(400).json({
        success: false,
        message: "Missing fileId, please provide it. It's used to locate the file you wish to download.",
        error: {
            code: "VALIDATION_ERROR",
            statusCode: 400,
        }
    })

    // Confirm the fileId is actually a string
    const fileIdType = typeof fileId;
    if (fileIdType !== "string") return res.status(400).json({
        success: false,
        message: "Invalid fileId.",
        error: { code: "VALIDATION_ERROR", statusCode: 400 }
    });

    const filePath = path.join(__dirname, `../uploads/file:${fileId}`);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) return res.status(404).json({
            success: false,
            message: "File does not exist.",
            error: { code: "NOT_FOUND", statusCode: 404, details: { fileId } }
        });

        // Create a new read stream
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        stream.on("error", (err) => {
            console.error(err);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Internal server error occured, during file download.");
            }
        });
    });
}