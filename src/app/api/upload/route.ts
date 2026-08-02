import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '@/lib/auth';
import crypto from 'crypto';

// Allowed file extensions & MIME types for security
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.svg']);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'image/svg+xml'
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

function isValidMagicBytes(buffer: Buffer, ext: string): boolean {
  if (ext === '.png') {
    return buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (ext === '.webp') {
    return buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  }
  if (ext === '.pdf') {
    return buffer.length >= 4 && buffer.toString('ascii', 0, 4) === '%PDF';
  }
  if (ext === '.svg') {
    const text = buffer.toString('utf-8', 0, Math.min(buffer.length, 1000)).toLowerCase();
    return text.includes('<svg') && !text.includes('<script');
  }
  return false;
}

// Configure Cloudinary if environmental variables are present
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export async function POST(request: Request) {
  // 1. Require Admin Authentication
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 }
      );
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit (10MB).' },
        { status: 400 }
      );
    }

    // 3. Validate Extension & MIME Type
    const ext = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid or prohibited file type.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Validate Magic Bytes Signature
    if (!isValidMagicBytes(buffer, ext)) {
      return NextResponse.json(
        { error: 'File signature header validation failed.' },
        { status: 400 }
      );
    }

    // Check if Cloudinary is configured
    const isCloudinaryConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    const secureUUID = crypto.randomUUID();

    if (isCloudinaryConfigured) {
      const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'diar-selection',
            public_id: `${Date.now()}-${secureUUID}`,
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result as { secure_url: string });
            }
          }
        );
        uploadStream.end(buffer);
      });

      const result = await uploadPromise;
      return NextResponse.json({ url: result.secure_url });
    } else {
      // Local upload logic with randomized secure filename
      const uniqueFilename = `${Date.now()}-${secureUUID}${ext}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads');

      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {
        // Directory exists
      }

      const filePath = join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);

      const fileUrl = `/uploads/${uniqueFilename}`;
      return NextResponse.json({ url: fileUrl });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'File upload processing failed.' },
      { status: 500 }
    );
  }
}
