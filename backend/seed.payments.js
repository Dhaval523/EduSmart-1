import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./src/config/db.js";
import { User } from "./src/models/user.model.js";
import { Course } from "./src/models/course.model.js";
import { Order } from "./src/models/order.model.js";

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

const seedPayments = async () => {
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
    (await User.findOne({ email: "meera@edusmart.dev" })) ||
    (await ensureUser({
      fullName: "Meera Iyer",
      email: "meera@edusmart.dev",
      password: DEFAULT_PASSWORD,
      admin: false
    }));

  const rohan =
    (await User.findOne({ email: "rohan@edusmart.dev" })) ||
    (await ensureUser({
      fullName: "Rohan Singh",
      email: "rohan@edusmart.dev",
      password: DEFAULT_PASSWORD,
      admin: false
    }));

  const courses = await Course.find({ isPublished: true }).limit(5);
  if (courses.length < 1) {
    console.log("No published courses found. Run `npm --prefix backend run seed` first.");
    await mongoose.connection.close();
    return;
  }

  const existingCount = await Order.countDocuments();
  if (existingCount < 8) {
    console.log("Creating sample payments (orders)...");
    const students = [meera, rohan];

    for (let i = 0; i < 12; i++) {
      const student = students[i % students.length];
      const course = courses[i % courses.length];
      const createdAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);

      const already = await Order.findOne({ user: student._id, course: course._id });
      if (already) continue;

      const order = new Order({
        user: student._id,
        course: course._id,
        totalAmount: course.amount || 0,
        stripeSessionId: `seed_pi_${student._id.toString().slice(-6)}_${course._id.toString().slice(-6)}_${Date.now()}_${i}`,
        createdAt,
        updatedAt: createdAt
      });

      await order.save(); // paymentId auto-generated here

      await User.findByIdAndUpdate(student._id, { $addToSet: { purchasedCourse: course._id } });
    }
  }

  console.log("Backfilling paymentId for existing orders (if missing)...");
  const missing = await Order.find({
    $or: [{ paymentId: { $exists: false } }, { paymentId: "" }, { paymentId: null }]
  });
  for (const order of missing) {
    order.paymentId = ""; // trigger pre-save generator
    await order.save();
  }

  const total = await Order.countDocuments();
  const sample = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("paymentId totalAmount createdAt stripeSessionId")
    .lean();

  console.log(`Payments seed completed. Total orders: ${total}`);
  console.log("Recent sample:", sample);
  console.log(`Login: meera@edusmart.dev / ${DEFAULT_PASSWORD}`);

  await mongoose.connection.close();
};

seedPayments().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.connection.close();
  process.exit(1);
});

