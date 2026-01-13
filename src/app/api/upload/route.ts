import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename to avoid overwrites and handle spaces
    const timestamp = Date.now()
    // Sanitize filename: remove special chars, spaces to underscores
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${safeName}`
    
    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore error if directory exists
    }
    
    const path = join(uploadDir, filename)
    await writeFile(path, buffer)
    
    const url = `/uploads/${filename}`

    return NextResponse.json({ url, success: true })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
