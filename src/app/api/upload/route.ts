import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';

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
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if Cloudinary is configured (Production Edge environment or configured Local)
    const isCloudinaryConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (isCloudinaryConfigured) {
      // Create a unique filename prefix (excluding extensions)
      const cleanFilename = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '-').toLowerCase();
      
      const uploadPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'diar-selection',
            public_id: `${Date.now()}-${cleanFilename}`,
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload stream error:', error);
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
      // Local fallback logic (writes to public/uploads directory)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = file.name.replace(/\s+/g, '-').toLowerCase();
      const uniqueFilename = `${uniqueSuffix}-${filename}`;

      const uploadDir = join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {
        console.log('Upload directory already exists or cannot be created.');
      }

      const filePath = join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);

      const fileUrl = `/uploads/${uniqueFilename}`;
      return NextResponse.json({ url: fileUrl });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file.' },
      { status: 500 }
    );
  }
}
