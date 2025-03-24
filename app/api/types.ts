export type RouteParams = {
  params: Promise<{ id: string }>;
};

// for Cloudinary upload api response
export type UploadResult = {
  url: string; // Cloudinary secure_url
  publicId: string; // Cloudinary public_id (essential for deletion)
  width?: number;
  height?: number;
  format?: string;
  originalFilename?: string;
};

export type UploadFile = UploadResult & {
  id: string;
};
