import cloudinary from "../config/cloudinary.js";

export const uploadPdfBufferToCloudinary = async (pdfBuffer, { publicId, folder } = {}) => {
  if (!pdfBuffer) {
    throw new Error("pdfBuffer is required");
  }

  const uploadOptions = {
    resource_type: "raw",
    folder: folder || "lmsYT/certificates",
    overwrite: true
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    stream.end(pdfBuffer);
  });
};

