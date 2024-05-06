import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { generateId } from './crypto.js'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Create a new instance of the S3 class
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: "AKIAXM3MMYTBEGV2QB4F",
    secretAccessKey: "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"
  }
})

export const uploadFile = async (fileContent, fileName) => {

  const id = generateId()

  const params = {
    Bucket: 'graywolf-project',
    Key: id,
    Body: fileContent
  }

  const command = new PutObjectCommand(params)

  try {
    await s3Client.send(command);

    return `https://graywolf-project.s3.amazonaws.com/${id}`; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file to S3', error);
    throw error;
  }
}

export async function getObjectSignedUrl(key) {
  const params = {
    Bucket: 'graywolf-project',
    Key: key
  }

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 3600
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url
}