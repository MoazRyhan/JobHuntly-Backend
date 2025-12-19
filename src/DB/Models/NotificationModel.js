import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: String,
    message: String,
    isRead: { type: Boolean, default: false },
    createdAt: Date,
  },
  { timestamps: true }
);

const NotificationModel =
  mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default NotificationModel;
