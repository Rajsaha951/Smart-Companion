import crypto from "crypto";

export function hashTask(task) {
  return crypto.createHash("sha256").update(task).digest("hex");
}
