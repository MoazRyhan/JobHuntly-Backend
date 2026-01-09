import JobApplicationModel from '../../../DB/Models/JobApplicationModel.js'
import ApiError from '../../../Utils/ApiError.utils.js'
import NotificationModel from '../../../DB/Models/NotificationModel.js'
import CompanyModel from '../../../DB/Models/CompanyModel.js'

export const getAllJobApplicationsService = async (filter = {}) => {
  const jobApplications = await JobApplicationModel.find(filter)
  if (!jobApplications.length) {
    throw new ApiError(404, 'no jobApplication is found')
  }
  return jobApplications
}

export const getJobApplicationService = async (applicationId, req) => {
  const jobApplication = await JobApplicationModel.findById(applicationId)
    .populate('jobId')
    .populate('seekerId')
    .populate('userId')

  if (!jobApplication) {
    throw new ApiError(404, 'Job Application Not Found')
  }
  
  if (!jobApplication.isReviewed) {
    jobApplication.isReviewed = true
    jobApplication.timeOfReview = Date.now()

    const company = await CompanyModel.findById(
      jobApplication.jobId.companyId
    ).select('name')
    const companyName = company.name

    const notification = await NotificationModel.create({
      recipientId: jobApplication.userId._id,
      message: `Your application for "${jobApplication.jobId.title}" has been reviewed by "${companyName}"!`,
      link: '/Dashboard/my-applications',
    })

    jobApplication.save()

    // Access io and activeUsers from the app instance
    const io = req.app.get('io')
    const activeUsers = req.app.get('activeUsers')

    const seekerSocketId = activeUsers[jobApplication.userId._id.toString()]

    if (seekerSocketId) {
      io.to(seekerSocketId).emit('notification_received', notification)
    }
  }

  return jobApplication
}
