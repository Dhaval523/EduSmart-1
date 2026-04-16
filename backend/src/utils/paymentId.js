import { PaymentCounter } from "../models/paymentCounter.model.js";

const pad = (num, size) => String(num).padStart(size, "0");

export const generateNextPaymentId = async (issuedAt = new Date()) => {
  const year = new Date(issuedAt).getFullYear();

  const counter = await PaymentCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return `PAY-${year}-${pad(counter.seq, 6)}`;
};

