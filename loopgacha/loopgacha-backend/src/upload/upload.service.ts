import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { generateUploadSignedUrl, uploadBuffer } from '../utils/gcs';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}
  async getUploadSignedUrl(contentType: string, contentLength: number) {
    const storage = new Storage({
      projectId: this.configService.get<string>('gcp.projectId'),
      credentials: {
        client_email: this.configService.get<string>('gcp.clientEmail'),
        private_key: this.configService.get<string>('gcp.privateKey'),
      },
    });

    const suffix = contentType.split('/')[1];
    const randomName = randomUUID();
    return generateUploadSignedUrl(
      storage,
      this.configService.get<string>('gcp.bucketName'),
      `${randomName}.${suffix}`,
      contentType,
      contentLength,
      Date.now() + 15 * 60 * 1000,
    );
  }
  async upload(fileBase64: string): Promise<{ url: string }> {
    const [meta, data] = fileBase64.split(',');
    const mimeType = meta.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
    const fileType = mimeType.split('/')[1];
    const buffer = Buffer.from(data, 'base64');
    const storage = new Storage({
      projectId: this.configService.get<string>('gcp.projectId'),
      credentials: {
        client_email: this.configService.get<string>('gcp.clientEmail'),
        private_key: this.configService.get<string>('gcp.privateKey'),
      },
    });
    const randomName = randomUUID();
    return uploadBuffer(
      storage,
      this.configService.get<string>('gcp.bucketName'),
      `${randomName}.${fileType}`,
      buffer,
    );
  }
}
