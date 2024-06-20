import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

const algorithm = 'aes-256-cbc';
//const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; // must be 32 bytes (256 bits)

export function encrypt(text: string, secretKey: string): string {
  const keyHash = createHash('sha256').update(secretKey).digest();
  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, keyHash, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(text: string, secretKey: string): string {
  const keyHash = createHash('sha256').update(secretKey).digest();
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = Buffer.from(parts[1], 'hex');

  const decipher = createDecipheriv(algorithm, keyHash, iv);

  const decrypted = decipher.update(encrypted);
  return Buffer.concat([decrypted, decipher.final()]).toString();

}
