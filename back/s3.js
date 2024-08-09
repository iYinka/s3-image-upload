import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const region = "us-west-2";
const bucketName = "test-image-bkt";

// Create S3 client instance without explicit credentials
const s3 = new S3Client({
    region,
    signatureVersion: "v4",
});

export async function generateUploadURL() {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString("hex");

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60,
    };

    const command = new PutObjectCommand(params);
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
    return uploadURL;
}
