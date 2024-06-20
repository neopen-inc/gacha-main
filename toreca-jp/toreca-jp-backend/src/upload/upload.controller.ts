import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @RequireAdmin()
  @Get('/signed-url')
  async signedUrl(@Query() { contentType, contentLength }) {
    return this.uploadService.getUploadSignedUrl(contentType, contentLength);
  }

  @RequireAdmin()
  @Post('/base64')
  async upload(@Body() { fileBase64 }: { fileBase64: string }) {
    return this.uploadService.upload(fileBase64);
  }
}
