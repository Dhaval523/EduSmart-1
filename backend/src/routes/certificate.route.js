import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  generateCertificate,
  getCertificateForCourse,
  downloadCertificateForCourse,
  pdfCertificateForCourse,
  viewCertificateForCourse,
  verifyCertificate
} from "../controllers/certificate.controller.js";

const certificateRoute = express.Router();

certificateRoute.get("/verify/:certificateId", verifyCertificate);
certificateRoute.get("/:courseId", protectRoute, getCertificateForCourse);
certificateRoute.get("/:courseId/view", protectRoute, viewCertificateForCourse);
certificateRoute.get("/:courseId/pdf", protectRoute, pdfCertificateForCourse);
certificateRoute.get("/:courseId/download", protectRoute, downloadCertificateForCourse);
certificateRoute.post("/generate", protectRoute, generateCertificate);

export default certificateRoute;
