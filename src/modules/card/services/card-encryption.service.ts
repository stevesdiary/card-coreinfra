import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';


export class CardPinEncryptionService {
  private static getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('Encryption key not configured');
    }
    return Buffer.from(key, 'hex');
  }

  static encrypt(pin: string): string {
    const key = this.getEncryptionKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(pin, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  }

  static decrypt(encryptedPin: string): string {

    const key = this.getEncryptionKey();
    const [ivHex, encryptedData] = encryptedPin.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
