import NotificationModel from "../../DB/Models/NotificationModel.js"

const getNotificationsBySeekerId = async (userId) => {
    try {
        const notifications = await NotificationModel.find({
            recipientId: userId
        }).sort({ createdAt: -1 }).limit(10);
        
        return notifications

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error("Getting Notifications Internal System Error:", error);
    }
}

const readNotification = async (notificationId) => {
    try {
        const updatedNotification = await NotificationModel.findByIdAndUpdate(
            notificationId,
            { $set: { isRead: true } },
            { new: true }
        );

        if (!updatedNotification)
            console.error("Reading Notification Internal System Error:", error);
        else
            return true

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error("Getting Notifications Internal System Error:", error);
    }
}

export default {
    getNotificationsBySeekerId,
    readNotification
}