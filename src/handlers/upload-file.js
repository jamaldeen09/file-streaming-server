import fs from 'fs';
import crypto from "crypto"
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// How this works under the hood:
// Whatever client makes this request automatically has something we call
// a TCP socket specifically for them. Well it could be called "socket", TCP
// is just a protocol that prevents the data being sent via the network from being
// unordered, or arriving to a destination incomplete. 

// This express server also has a socket which is what is binded to the current machine's
// operating system. Now when an HTTP request is made (which under the hood is a socket sending some data
// via the internet/network), the network card of this machine receives the network packets and the OS sees this
// data and notifies libuv that socket #45 (which is basically our express server conceptually) has some incoming data

// Libuv then notifies Node JS (NOTE: Express created an HTTP server for us, and because of that Node JS
// creates an HTTP object of some sort that has a parser (lhttp) which is another Node JS thingy. Just know this lhttp is responsible
// for parsing raw binary data into a proper HTTP reqest with information like the method (GET) the endpoint the request was made to (/api/upload))
export function uploadFile(req, res) {
    // Create a unique ID for the file
    const fileId = crypto.randomUUID();

    // Create folder and file path for this specific file
    const folderPath = path.join(__dirname, "../uploads");
    const filePath = path.join(folderPath, `file:${fileId}`);

    // Create a new write stream to write data to a file
    // in chunks
    const stream = fs.createWriteStream(filePath, {
        flags: "a",
        encoding: 'utf8'
    });

    // Listen for new chunks of data
    req.on("data", async function (chunk) {
        stream.write(chunk)
    });

    // Forcefully end the stream when there are no more
    // chunks of data left
    req.on("end", function () {
        stream.end();
    })

    // Listen for when the stream finishes
    // and send a response back to the HTTP client
    stream.on("finish", function () {
        return res.status(201).json({
            success: true,
            message: "File has been successfully uploaded",
            data: { fileId }
        })
    });
}