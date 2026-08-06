import { fileURLToPath } from 'url';
import path from "path"
import fs from "fs"
import { metadatas } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function deleteFile(req, res) {
    const fileId = req.params?.fileId;
    if (!fileId) return res.status(400).json({
        success: false,
        message: "Missing fileId, please provide it. It's used to locate the file you wish to delete.",
        error: {
            code: "VALIDATION_ERROR",
            statusCode: 400,
        }
    })

    const filePath = path.join(__dirname, `../uploads/file:${fileId}`);
    fs.unlink(filePath, (err) => {
        if (err) {
            // Handle specific error: file not found
            if (err.code === 'ENOENT') return res.status(404).json({
                success: false,
                message: "File does not exist.",
                error: { code: "NOT_FOUND", statusCode: 404, details: { fileId } }
            });

            return res.status(500).json({
                success: false,
                message: "An internal server error occured. Please try again shortly.",
                error: { code: "SERVER_ERROR", statusCode: 500 }
            });
        }

        metadatas.delete(fileId);
        return res.status(200).json({
            success: true,
            message: "File has been successfully deleted.",
            data: { fileId }
        })
    });

}