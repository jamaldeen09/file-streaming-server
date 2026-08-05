// Import the express module
import express from "express"

// Import the cors module to define specifications
// on which client can make a request to this server
// and what HTTP methods they can use when requesting 
// from this server
import cors from "cors";

// Import dotenv module, which makes it possible
// to read the contents of a .env file
import dotenv from "dotenv";
import { uploadFile } from "./handlers/upload-file.js"; 
dotenv.config();

// Extract PORT from environment variables (defaults to 3000, if not defined)
const port = parseInt(process.env.PORT ?? "3000");

// Create a new express app
const app = express();
app.post("/test", (req) => {
    req.on("data", (data) => {
        console.log("Data chunk:", data)
    })
})

// Apply cors to our express app as a global middleware
// so it runs before the client's request touches any other endpoints
// or internal middlewares
app.use(cors({
    // "*": any client can make a request to this server
    origin: "*", 

    // GET - for downloading a file
    // POST - for uploading a file
    // DELETE - for deleting a file
    methods: ["GET", "POST", "DELETE"],
}));

// ------- Handlers ---------------------

// [File Uploads] - POST /api/upload
app.post("/api/upload", uploadFile);

// Listen to the port
// What this does under the hood is that, it tells the c++ library used to communicate
// with the OS called libuv. It tells libuv to bind this node process to the operating system
// meaning any network packets the network card in the operating system receives, the operating system
// basically notifies any ports binded to it. 
app.listen(port, () => console.log(`Server is running on port: ${port}`))

