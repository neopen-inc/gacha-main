
import { uploadBase64File } from '@toreca-jp-app/domain/upload/action/upload.action';
import { useAppDispatch, useAppSelector } from '@toreca-jp-app/store/hooks';
import { Button, Input } from '@mui/material';
import React, { useState } from 'react';

export interface FileUploaderProps {
  onUploaded: (url: string) => void;
}
const FileUploader = ({ onUploaded }: FileUploaderProps) => {
  const [file, setFile] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const uploadOperation = useAppSelector(state => state.upload.operations.uploadBase64File);

  const handleFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        // This will convert image to base64
        setFile(reader.result as string);
      }
      reader.readAsDataURL(file);
    }
  }

  const handleUpload = async () => {
    try {
      if (!file) {
        return;
      }
      dispatch(uploadBase64File(file)).unwrap().then((data) => {
        const imageUrl = data.url;
        onUploaded(imageUrl);
      })

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  return (
    <div>
      <Input type="file" inputProps={{ accept: 'image/*,video/*' }} size="small" onChange={handleFileChange} />
      <Button className="bg-foregroundOrange" variant="contained" onClick={handleUpload} disabled={!file}>アップロード</Button>
    </div>
  )
}

export default FileUploader;