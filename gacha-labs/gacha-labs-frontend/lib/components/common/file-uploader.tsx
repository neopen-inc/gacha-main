import { PrimaryButton } from '@commons/components/buttons/primary-button';
import { uploadBase64File } from '@gacha-labs-app/domain/upload/action/upload.action';
import { useAppDispatch, useAppSelector } from '@gacha-labs-app/store/hooks';
import { Button, Input, TextField } from '@mui/material';
import React, { useState } from 'react';

export interface FileUploaderProps {
  onUploaded: (url: string) => void;
}
const FileUploader = ({ onUploaded }: FileUploaderProps) => {
  const [file, setFile] = useState<string | null>(null);
  const dispatch = useAppDispatch();

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
      <TextField type="file" inputProps={{ accept: 'image/*,video/*' }} size="small" onChange={handleFileChange} />
      <PrimaryButton onClick={handleUpload} disabled={!file}>アップロード</PrimaryButton>
    </div>
  )
}

export default FileUploader;