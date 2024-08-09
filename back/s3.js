import dotenv from "dotenv";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { promisify } from "util";

// Load environment variables from .env file
dotenv.config();

// Promisify crypto.randomBytes
const randomBytes = promisify(crypto.randomBytes);

// Initialize S3 client with IAM role
const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-2",
});

// Validate required environment variables
// const requiredEnvVars = ["us-east-2", "test-image-bkt"];
// requiredEnvVars.forEach((varName) => {
//     if (!process.env[varName]) {
//         console.error(
//             `Error: Missing required environment variable ${varName}`
//         );
//         process.exit(1);
//     }
// });

/**
 * Generates a pre-signed URL for uploading to S3.
 *
 * @returns {Promise<string>} The pre-signed URL for the S3 upload.
 */
export async function generateUploadURL() {
    try {
        // Generate a random 16-byte buffer and convert it to a hex string
        const rawBytes = await randomBytes(16);
        const imageName = rawBytes.toString("hex");

        // Parameters for the S3 getSignedUrl method
        const params = {
            Bucket: process.env.S3_BUCKET_NAME || "test-image-bkt",
            Key: imageName,
            Expires: 60, // URL expires in 60 seconds
        };

        // Create a command for the S3 getObject method
        const command = new GetObjectCommand(params);

        // Generate and return the pre-signed URL
        const uploadURL = await getSignedUrl(s3Client, command, {
            expiresIn: 60,
        });
        return uploadURL;
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        throw new Error("Failed to generate pre-signed URL");
    }
}
