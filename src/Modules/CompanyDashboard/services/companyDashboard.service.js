import mongoose from 'mongoose';
import JobModel from '../../../DB/Models/JobModel.js';
import JobApplicationModel from '../../../DB/Models/JobApplicationModel.js';
import JobAnalyticsModel from '../../../DB/Models/JobAnalyticsModel.js';
import { getDateRanges, getChartAggregation, formatDualChartData, getTotalApplications, getApplicationChartData } from '../../../Utils/dashboardStatistics.util.js';

// Getting all job IDs for a company
const getCompanyJobIds = async (companyId) => {
    const jobs = await JobModel.find({ companyId }).select('_id');
    return jobs.map(job => job._id);
};

export const getNewJobApplicationsCount = async (companyId) => {
    try {
        const jobIds = await getCompanyJobIds(companyId);

        return await JobApplicationModel.countDocuments({
            jobId: { $in: jobIds },
            isReviewed: false
        });
    } catch (error) {
        console.error("NewJobApplicationsCount Error:", error);
        throw error;
    }
};

export const getReviewedJobApplicationsCount = async (companyId) => {
    try {
        const jobIds = await getCompanyJobIds(companyId);

        // UTC Time
        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);

        return await JobApplicationModel.countDocuments({
            jobId: { $in: jobIds },
            isReviewed: true,
            timeOfReview: { $gte: startOfToday }
        });
    } catch (error) {
        console.error("ReviewedJobApplicationsCount Error:", error);
        throw error;
    }
};

const getOpenJobsCount = async (companyId) => {
    try {
        const count = await JobModel.countDocuments({
            companyId: companyId,
            isLive: true
        })

        return count
    } catch (error) {
        console.error("OpenJobsCount Internal System Error:", error);
    }
}


const getJobViewStatistics = async (companyId, filter) => {
    try {
        const { currentStart, currentEnd, previousStart, previousEnd } = getDateRanges(filter);
        const companyObjectId = typeof companyId === 'string'
            ? new mongoose.Types.ObjectId(companyId)
            : companyId;

        // --- 1. Fetch Totals and Chart Data for both periods in parallel ---
        const [currentStats, prevStats, currentRawChart, prevRawChart] = await Promise.all([
            // Total Current
            JobAnalyticsModel.aggregate([
                { $match: { companyId: companyObjectId, date: { $gte: currentStart, $lte: currentEnd } } },
                { $group: { _id: null, total: { $sum: "$views" } } }
            ]),
            // Total Previous
            JobAnalyticsModel.aggregate([
                { $match: { companyId: companyObjectId, date: { $gte: previousStart, $lte: previousEnd } } },
                { $group: { _id: null, total: { $sum: "$views" } } }
            ]),
            // Chart Current
            getChartAggregation(companyObjectId, currentStart, currentEnd, filter),
            // Chart Previous
            getChartAggregation(companyObjectId, previousStart, previousEnd, filter)
        ]);

        const currentTotal = currentStats[0]?.total || 0;
        const previousTotal = prevStats[0]?.total || 0;

        // Calculate Percentage Change
        let percentageChange = 0;
        if (previousTotal > 0) percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        else if (currentTotal > 0) percentageChange = 100;

        // Format Chart Data with Zero-Filling ---
        const chartData = formatDualChartData(currentRawChart, prevRawChart, filter);

        // console.log("---------------------- JOB VIEWS ----------------------------");

        // console.log(chartData);
        // console.log(currentTotal);
        // console.log(previousTotal);
        // console.log(percentageChange);

        // console.log("Date Ranges:", { currentStart, currentEnd, previousStart, previousEnd });

        return {
            cardData: {
                title: "Job Views",
                currentCount: currentTotal,
                previousCount: previousTotal,
                change: Number(percentageChange.toFixed(1))
            },
            chartData: chartData // Contains both 'current' and 'previous' keys per point
        };

    } catch (error) {
        console.error("JobAnalytics Error:", error);
        throw error;
    }
};


const getJobApplicationStatistics = async (companyId, filter) => {
    try {
        const { currentStart, currentEnd, previousStart, previousEnd } = getDateRanges(filter);
        const companyObjectId = new mongoose.Types.ObjectId(companyId);

        // Aggregations for current and previous periods
        const [currentStats, prevStats, currentChart, prevChart] = await Promise.all([
            // Total Count Current
            getTotalApplications(companyObjectId, currentStart, currentEnd),
            // Total Count Previous
            getTotalApplications(companyObjectId, previousStart, previousEnd),
            // Chart Data Current
            getApplicationChartData(companyObjectId, currentStart, currentEnd, filter),
            // Chart Data Previous
            getApplicationChartData(companyObjectId, previousStart, previousEnd, filter)
        ]);

        const currentTotal = currentStats[0]?.total || 0;
        const previousTotal = prevStats[0]?.total || 0;

        // Percentage Change
        let percentageChange = 0;
        if (previousTotal > 0) percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        else if (currentTotal > 0) percentageChange = 100;

        // Zero-fill and format for Recharts
        // This was written 'formatApplicationChart' which doesn't exist
        const chartData = formatDualChartData(currentChart, prevChart, filter);

        // console.log("---------------------- JOB APPLICATIONS ----------------------------");

        // console.log(chartData);
        // console.log(currentTotal);
        // console.log(previousTotal);
        // console.log(percentageChange);

        // console.log("Date Ranges:", { currentStart, currentEnd, previousStart, previousEnd });

        return {
            cardData: {
                title: "Job Applications",
                currentCount: currentTotal,
                previousCount: previousTotal,
                change: Number(percentageChange.toFixed(1))
            },
            chartData
        };
    } catch (error) {
        throw error;
    }
};



export default {
    getNewJobApplicationsCount,
    getReviewedJobApplicationsCount,
    getOpenJobsCount,
    getJobViewStatistics,
    getJobApplicationStatistics
}