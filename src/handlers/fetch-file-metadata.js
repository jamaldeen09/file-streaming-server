import { metadatas } from "../index.js";

export function fetchFileMetadata(req, res) {
    const fileId = req.params?.fileId;
    if (!fileId) return res.status(400).json({
        success: false,
        message: "Missing fileId, please provide it. It's used to locate the file's metadata you wish to fetch.",
        error: {
            code: "VALIDATION_ERROR",
            statusCode: 400,
        }
    })

    const metadata = metadatas.get(fileId);
    if (!metadata) return res.status(400).json({
        success: false,
        message: "File does not exist or it's metadata has not been set.",
        error: {
            code: "VALIDATION_ERROR",
            statusCode: 400
        }
    });

    return res.status(200).json({
        success: true,
        message: "Successfully fetched file's metadata",
        data: {
            fileId,
            metadata: metadata
        }
    })
}