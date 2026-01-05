import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: String,
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

NotificationSchema.index({ recipientId: 1 })

const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default NotificationModel;
