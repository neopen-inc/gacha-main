import { Storage } from '@google-cloud/storage';
import axios from 'axios';

export async function generateUploadSignedUrl(
  storage: Storage,
  bucketName: string,
  fileName: string,
  contentType: string,
  contentLength: number,
  expires: number = Date.now() + 15 * 60 * 1000,
): Promise<string> {
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl({
      action: 'write',
      contentType,
      expires,
      extensionHeaders: {
        'content-length': contentLength,
      },
      version: 'v4',
    });
  return url;
}

export async function uploadBuffer(
  storage: Storage,
  bucketName: string,
  fileName: string,
  data: Buffer,
): Promise<{ url: string }> {
  const blob = storage.bucket(bucketName).file(fileName);
  const blobStream = blob.createWriteStream();
  return new Promise<{ url: string }>((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });
    blobStream.on('finish', async () => {
      resolve({
        url: `https://storage.googleapis.com/${bucketName}/${fileName}`,
      });
    });
    blobStream.end(data);
  });
}

export async function uploadFromUrl(
  storage: Storage,
  bucketName: string,
  fileName: string,
  url: string,
): Promise<{ url: string }> {
  const buffer = await axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .then((response) => Buffer.from(response.data, 'binary'));
  const data = Buffer.from(buffer);
  const blob = storage.bucket(bucketName).file(fileName);
  const blobStream = blob.createWriteStream();
  return new Promise<{ url: string }>((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });
    blobStream.on('finish', async () => {
      resolve({
        url: `https://storage.googleapis.com/${bucketName}/${fileName}`,
      });
    });
    blobStream.end(data);
  });
}

/*
export async function uploadToGoogleStorageFromUrl(
  storage: Storage,
  bucketName: string,
  url: string,
): Promise<string> {
  await storage
    .bucket(bucketName)
    .upload()
    .file(fileName)
    .getSignedUrl({
      action: 'write',
      contentType,
      expires,
      extensionHeaders: {
        'content-length': contentLength,
      },
      version: 'v4',
    });
  return url;
}
*/
