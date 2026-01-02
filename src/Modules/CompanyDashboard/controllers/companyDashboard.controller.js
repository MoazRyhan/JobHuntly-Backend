import { response } from "../../../Utils/response.utils.js";
import companyDashboardService from "../services/companyDashboard.service.js";

const getNewJobApplicationsCount = async (req, res) => {
    const companyId = req.companyId;

    const count = await companyDashboardService.getNewJobApplicationsCount(companyId)

    return response(res, count)
}

const getReviewedJobApplicationsCount = async (req, res) => {
    const companyId = req.companyId;

    const count = await companyDashboardService.getReviewedJobApplicationsCount(companyId)

    return response(res, count)
}

const getOpenJobsCount = async (req, res) => {
    const companyId = req.companyId;

    const count = await companyDashboardService.getOpenJobsCount(companyId)

    return response(res, count)
}

const getJobViewStatistics = async (req, res) => {
    const { filter } = req.query; // 'Week', 'Month', or 'Year'
    const companyId = req.companyId;

    const stats = await companyDashboardService.getJobViewStatistics(companyId, filter || 'Week');

    return response(res, stats)
};

const getJobApplicationStatistics = async (req, res) => {
    const { filter } = req.query; // 'Week', 'Month', or 'Year'
    const companyId = req.companyId;

    const stats = await companyDashboardService.getJobApplicationStatistics(companyId, filter || 'Week');

    return response(res, stats)
};

export default {
    getJobViewStatistics,
    getJobApplicationStatistics,
    getNewJobApplicationsCount,
    getReviewedJobApplicationsCount,
    getOpenJobsCount
}