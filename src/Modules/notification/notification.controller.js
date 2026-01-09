import ApiError from "../../Utils/ApiError.utils.js";
import { asyncHandler } from "../../Utils/asyncHandler.utils.js";
import { response } from "../../Utils/response.utils.js";
import notificationService from "./notification.service.js";

const getNotificationsBySeekerId = asyncHandler(async (req, res) => {
    const userId = req.login_user._id

    if (!userId)
        console.error("User not logged in")

    const notifications = await notificationService.getNotificationsBySeekerId(userId)

    return response(res, notifications)
})

const readNotification = asyncHandler(async (req, res) => {
    const notificationId = req.params.id
    if (!notificationId)
        throw new ApiError(400, "No id provided");

    const result = await notificationService.readNotification(notificationId)

    return response(res, result)
})

const readAllNotifications = asyncHandler(async (req, res) => {
    const recipientId = req.login_user._id

    if (!recipientId)
        console.error("User not logged in")

    const result = await notificationService.readAllNotifications(recipientId)

    return response(res, result)
})

export default {
    getNotificationsBySeekerId,
    readNotification,
    readAllNotifications
}