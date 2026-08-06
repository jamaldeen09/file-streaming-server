import { metadatas } from "../index.js";
import { fileURLToPath } from 'url';
import path from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function updateFileMetadata(req, res) {
    // Confirm a fileId was provided
    const fileId = req.params?.fileId;
    if (!fileId) return res.status(400).json({
        success: false,
        message: "Missing fileId, please provide it. It's used to locate the file's metadata you wish to update.",
        error: {
            code: "VALIDATION_ERROR",
            statusCode: 400,
        }
    })

    // Extract the metadata from the requests body and validate it
    const metadata = req.body?.metadata;
    if (!metadata) return res.status(400).json({
        success: false,
        message: "Metadata was not provided.",
        error: { code: "VALIDATION_ERROR", statusCode: 400 }
    });

    const name = metadata["name"];
    const extension = metadata["extension"];

    if (!name && !extension) return res.status(400).json({
        success: false,
        message: `To update a file's metadata, you must either provide a name or an extension`,
        error: { code: "VALIDATION_ERROR", statusCode: 400 }
    });

    if (name && typeof name !== "string") return res.status(400).json({
        success: false,
        message: `Invalid "name" for file metadata.`,
        error: { code: "VALIDATION_ERROR", statusCode: 400 }
    });

    if (extension && typeof extension !== "string") return res.status(400).json({
        success: false,
        message: `Invalid "extension" for file metadata.`,
        error: { code: "VALIDATION_ERROR", statusCode: 400 }
    });

    // Check if the file exists on disk
    const filePath = path.join(__dirname, `../uploads/file:${fileId}`);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) return res.status(404).json({
            success: false,
            message: "File does not exist.",
            error: { code: "NOT_FOUND", statusCode: 404, details: { fileId } }
        });

        // Add it to the metadatas map
        const previousMetadata = metadatas.get(fileId) ?? null
        metadatas.set(fileId, metadata);
        return res.status(200).json({
            success: true,
            message: "Successfully updated the requested file's metadata.",
            data: { fileId, newMetadata: metadata, previousMetadata }
        })
    });
}