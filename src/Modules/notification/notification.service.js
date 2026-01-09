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
            console.error("Reading a Notification Internal System Error:", error);
        else
            return true

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error("Reading a Notification Internal System Error:", error);
    }
}

const readAllNotifications = async (recipientId) => {
    try {
        const result = await NotificationModel.updateMany(
            { recipientId: recipientId, isRead: false }, // Only update unread ones
            { $set: { isRead: true } }
        );

        // result contains info like: { acknowledged: true, modifiedCount: 5 }
        if (result.acknowledged) {
            return true;
        }
        
        return false;
    } catch (error) {
        console.error("Reading All Notifications Internal System Error:", error);
        
        if (error.statusCode) {
            throw error;
        }
        return false;
    }
}

export default {
    getNotificationsBySeekerId,
    readNotification,
    readAllNotifications
}