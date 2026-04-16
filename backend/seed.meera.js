import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./src/config/db.js";
import { User } from "./src/models/user.model.js";
import { Course } from "./src/models/course.model.js";
import { Modules } from "./src/models/module.model.js";
import { Enrollment } from "./src/models/enrollment.model.js";
import { Order } from "./src/models/order.model.js";
import { Progress } from "./src/models/progress.model.js";
import { Certificate } from "./src/models/certificate.model.js";

const MEERA_EMAIL = "meera@edusmart.dev";
const DEFAULT_PASSWORD = "Password@123";

const ensureUser = async ({ fullName, email, password, admin = false }) => {
  const existing = await User.findOne({ email });
  if (existing) return existing;

  const hashed = await bcrypt.hash(password, 10);
  return User.create({
    fullName,
    email,
    password: hashed,
    admin,
    profilePhoto:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=500&auto=format&fit=crop"
  });
};

const ensureCourseHasModules = async (courseDoc, { moduleCount = 3 } = {}) => {
  const course = await Course.findById(courseDoc._id).select("modules userId title description");
  if (!course) return null;

  const existingModules = Array.isArray(course.modules) ? course.modules : [];
  if (existingModules.length >= 1) return course;

  const created = [];
  for (let i = 0; i < moduleCount; i++) {
    const mod = await Modules.create({
      courseId: course._id,
      title: `Module ${i + 1}`,
      description: `Seeded module ${i + 1} for ${course.title}`,
      video: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      order: i + 1,
      duration: "10 min",
      isPreviewFree: i === 0,
      resources: [],
      comments: []
    });
    created.push(mod._id);
  }

  course.modules = created;
  await course.save();
  return course;
};

const seedMeeraCompleted = async () => {
  await connectDB();

  const admin =
    (await User.findOne({ admin: true })) ||
    (await ensureUser({
      fullName: "Aarav Kapoor",
      email: "aarav@edusmart.dev",
      password: DEFAULT_PASSWORD,
      admin: true
    }));

  const meera =
    (await User.findOne({ email: MEERA_EMAIL })) ||
    (await ensureUser({
      fullName: "Meera Iyer",
      email: MEERA_EMAIL,
      password: DEFAULT_PASSWORD,
      admin: false
    }));

  let courses = await Course.find({ isPublished: true }).sort({ createdAt: 1 }).limit(2);

  if (courses.length < 2) {
    const need = 2 - courses.length;
    const created = [];
    for (let i = 0; i < need; i++) {
      const course = await Course.create({
        userId: admin._id,
        title: `Seed Course ${i + 1}`,
        description: "Seeded course for certificate testing.",
        thumbnail:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
        amount: 499,
        category: "Development",
        subcategory: "Testing",
        level: "Beginner",
        duration: "1 week",
        instructor: admin.fullName || "EduSmart",
        tags: ["seed", "testing"],
        overview: "Seeded overview",
        requirements: [],
        learningOutcomes: [],
        isPublished: true,
        modules: []
      });
      created.push(course);
    }
    courses = [...courses, ...created].slice(0, 2);
  }

  const selectedCourses = [];
  for (const c of courses) {
    const withModules = await ensureCourseHasModules(c, { moduleCount: 4 });
    if (withModules) selectedCourses.push(withModules);
  }

  console.log("Resetting Meera progress/enrollments/orders/certificates...");
  await Promise.all([
    Progress.deleteMany({ user: meera._id }),
    Enrollment.deleteMany({ userId: meera._id }),
    Order.deleteMany({ user: meera._id }),
    Certificate.deleteMany({ userId: meera._id }),
    User.findByIdAndUpdate(meera._id, { $set: { purchasedCourse: [] } })
  ]);

  console.log("Seeding Meera with 2 completed courses...");
  for (const course of selectedCourses.slice(0, 2)) {
    await Enrollment.create({
      userId: meera._id,
      courseId: course._id,
      stripeSessionId: `seed_sess_${meera._id.toString().slice(-6)}_${course._id.toString().slice(-6)}`
    });

    await Order.create({
      user: meera._id,
      course: course._id,
      totalAmount: course.amount || 0,
      stripeSessionId: `seed_pi_${meera._id.toString().slice(-6)}_${course._id.toString().slice(-6)}`
    });

    await User.findByIdAndUpdate(meera._id, { $addToSet: { purchasedCourse: course._id } });

    const moduleIds = Array.isArray(course.modules) ? course.modules : [];
    for (const moduleId of moduleIds) {
      await Progress.findOneAndUpdate(
        { user: meera._id, module: moduleId },
        {
          user: meera._id,
          course: course._id,
          module: moduleId,
          completed: true,
          completedAt: new Date()
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }

  console.log("Done. Meera can now download certificates after the first fetch.");
  console.log(`Login: ${MEERA_EMAIL} / ${DEFAULT_PASSWORD}`);

  await mongoose.connection.close();
};

seedMeeraCompleted().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.connection.close();
  process.exit(1);
});

