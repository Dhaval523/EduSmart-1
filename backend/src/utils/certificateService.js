import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { Progress } from "../models/progress.model.js";
import { Certificate } from "../models/certificate.model.js";
import { User } from "../models/user.model.js";
import { generateCertificatePdfBuffer } from "./certificatePdf.js";
import { uploadPdfBufferToCloudinary } from "./cloudinaryRawUpload.js";

const createCertificateId = () => {
  const uid = crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
  return `EDU-${uid}`;
};

export const getCourseCompletionStats = async (userId, courseId) => {
  const course = await Course.findById(courseId).select("modules title").lean();
  if (!course) {
    return { course: null, completed: false, totalModules: 0, completedCount: 0 };
  }

  const totalModules = Array.isArray(course.modules) ? course.modules.length : 0;
  const completedCount = await Progress.countDocuments({
    user: userId,
    course: courseId,
    completed: true
  });

  const completed = totalModules > 0 && completedCount >= totalModules;
  return { course, completed, totalModules, completedCount };
};

export const ensureCertificateForCourseCompletion = async ({ userId, courseId } = {}) => {
  if (!userId || !courseId) {
    throw new Error("userId and courseId are required");
  }

  const existing = await Certificate.findOne({ userId, courseId }).lean();
  if (existing) return existing;

  const [user, stats] = await Promise.all([
    User.findById(userId).select("fullName").lean(),
    getCourseCompletionStats(userId, courseId)
  ]);

  if (!user) {
    throw new Error("User not found");
  }
  if (!stats.course) {
    throw new Error("Course not found");
  }

  if (!stats.completed) {
    return null;
  }

  const issuedAt = new Date();
  const certificateId = createCertificateId();

  const pdfBuffer = await generateCertificatePdfBuffer({
    userName: user.fullName,
    courseTitle: stats.course.title,
    issuedAt,
    certificateId
  });

  const uploadRes = await uploadPdfBufferToCloudinary(pdfBuffer, {
    publicId: certificateId,
    folder: "lmsYT/certificates"
  });

  try {
    const created = await Certificate.create({
      userId,
      courseId,
      certificateUrl: uploadRes.secure_url,
      certificateId,
      issuedAt
    });
    return created.toObject();
  } catch (error) {
    if (error?.code === 11000) {
      const afterRace = await Certificate.findOne({ userId, courseId }).lean();
      if (afterRace) return afterRace;
    }
    throw error;
  }
};

export const markCourseCompleted = async (userId, courseId) => {
  return ensureCertificateForCourseCompletion({ userId, courseId });
};
