import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);
const key = process.env.CRYPTO_SECRET as string;

export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return iv.toString('hex') + encrypted.toString('hex');
};

export const decrypt = (hash: string) => {
  const iv = hash.slice(0, 32);
  const content = hash.slice(32);
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

  return decrpyted.toString();
};
