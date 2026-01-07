import { Router } from "express";
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../../Middlewares/AuthenticationMiddleware.js";
import { SYSTEM_ROLE } from "../../Constants/constants.js";
import notificationController from "./notification.controller.js";
const notificationRouter = Router()

notificationRouter.use(AuthenticationMiddleware())
// Currently for Job Seekers only
notificationRouter.use(AuthorizationMiddleware(SYSTEM_ROLE.JOB_SEEKER))

notificationRouter.get('', notificationController.getNotificationsBySeekerId)

notificationRouter.patch('/:id', notificationController.readNotification)

notificationRouter.patch('', notificationController.readAllNotifications)

export default notificationRouter