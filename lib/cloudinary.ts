import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Allowed MIME types for course materials
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/zip",
  "video/mp4",
  "image/jpeg",
  "image/png",
]

// File type categories for organizing materials
export const FILE_TYPE_CATEGORIES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/zip": "zip",
  "video/mp4": "video",
  "image/jpeg": "image",
  "image/png": "image",
}

interface UploadResponse {
  url: string
  publicId: string
  fileType: string
}

/**
 * Upload file to Cloudinary
 * @param file - File object from client
 * @param folder - Cloudinary folder path (e.g., 'courses/materials')
 * @returns Object with URL, publicId, and fileType
 */
export async function uploadToCloudinary(file: File, folder = "courses/materials"): Promise<UploadResponse> {
  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`)
  }

  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`))
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              fileType: FILE_TYPE_CATEGORIES[file.type] || "file",
            })
          }
        },
      )

      uploadStream.end(buffer)
    })
  } catch (error) {
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Delete file from Cloudinary by public ID
 * @param publicId - Cloudinary public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    })
  } catch (error) {
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Validate file MIME type
 * @param mimeType - File MIME type
 * @returns true if valid, false otherwise
 */
export function isValidMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType)
}

/**
 * Get file category from MIME type
 * @param mimeType - File MIME type
 * @returns File category or 'file' if unknown
 */
export function getFileCategory(mimeType: string): string {
  return FILE_TYPE_CATEGORIES[mimeType] || "file"
}
