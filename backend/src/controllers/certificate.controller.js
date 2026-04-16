import { Certificate } from "../models/certificate.model.js";
import { ensureCertificateForCourseCompletion } from "../utils/certificateService.js";
import { Readable } from "stream";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getAttachmentUrl = (secureUrl, fileName) => {
  if (!secureUrl) return "";
  const safeFileName = encodeURIComponent(fileName || "certificate.pdf");
  const marker = "/upload/";
  const idx = secureUrl.indexOf(marker);
  if (idx === -1) return secureUrl;
  return `${secureUrl.slice(0, idx + marker.length)}fl_attachment:${safeFileName}/${secureUrl.slice(
    idx + marker.length
  )}`;
};

const pipeRemotePdf = async (remoteUrl, res, { disposition = "inline", fileName } = {}) => {
  const response = await fetch(remoteUrl);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to fetch pdf (${response.status}). ${text}`.trim());
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `${disposition}; filename="${String(fileName || "certificate.pdf").replace(/"/g, "")}"`
  );

  const body = response.body;
  if (!body) {
    throw new Error("Empty response body from storage");
  }

  Readable.fromWeb(body).pipe(res);
};

export const getCertificateForCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    const certificate =
      (await Certificate.findOne({ userId, courseId }).lean()) ||
      (await ensureCertificateForCourseCompletion({ userId, courseId }));

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not available. Complete the course to unlock it."
      });
    }

    return res.status(200).json({
      success: true,
      certificate
    });
  } catch (error) {
    console.log(`error from getCertificateForCourse, ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const generateCertificate = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    const certificate = await ensureCertificateForCourseCompletion({ userId, courseId });

    if (!certificate) {
      return res.status(400).json({
        success: false,
        message: "Course is not completed yet"
      });
    }

    return res.status(201).json({
      success: true,
      certificate
    });
  } catch (error) {
    console.log(`error from generateCertificate, ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const downloadCertificateForCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    const certificate =
      (await Certificate.findOne({ userId, courseId }).lean()) ||
      (await ensureCertificateForCourseCompletion({ userId, courseId }));

    if (!certificate?.certificateUrl) {
      return res.status(404).json({
        success: false,
        message: "Certificate not available. Complete the course to unlock it."
      });
    }

    const fileName = `${certificate.certificateId || "certificate"}.pdf`;
    const attachmentUrl = getAttachmentUrl(certificate.certificateUrl, fileName);
    await pipeRemotePdf(attachmentUrl, res, { disposition: "attachment", fileName });
    return;
  } catch (error) {
    console.log(`error from downloadCertificateForCourse, ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const pdfCertificateForCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    const certificate =
      (await Certificate.findOne({ userId, courseId }).lean()) ||
      (await ensureCertificateForCourseCompletion({ userId, courseId }));

    if (!certificate?.certificateUrl) {
      return res.status(404).json({
        success: false,
        message: "Certificate not available. Complete the course to unlock it."
      });
    }

    const fileName = `${certificate.certificateId || "certificate"}.pdf`;
    await pipeRemotePdf(certificate.certificateUrl, res, { disposition: "inline", fileName });
    return;
  } catch (error) {
    console.log(`error from pdfCertificateForCourse, ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const viewCertificateForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    return res.redirect(302, `/api/certificates/${encodeURIComponent(courseId)}/pdf`);
  } catch (error) {
    console.log(`error from viewCertificateForCourse, ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "certificateId is required"
      });
    }

    const certificate = await Certificate.findOne({ certificateId })
      .populate("userId", "fullName")
      .populate("courseId", "title")
      .lean();

    if (!certificate) {
      return res.status(404).json({
        success: true,
        valid: false,
        message: "Certificate not found"
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        issuedAt: certificate.issuedAt,
        user: certificate.userId,
        course: certificate.courseId
      }
    });
  } catch (error) {
    console.log(`error from verifyCertificate, ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
