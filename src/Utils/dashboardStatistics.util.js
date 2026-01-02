import JobAnalyticsModel from "../DB/Models/JobAnalyticsModel.js";
import JobModel from "../DB/Models/JobModel.js";

export const getDateRanges = (filter) => {
    const now = new Date();
    // Use UTC for the baseline
    now.setUTCHours(23, 59, 59, 999);

    let currentStart, currentEnd, previousStart, previousEnd;

    if (filter === 'Week') {
        currentStart = new Date(now);
        const dayOfWeek = currentStart.getUTCDay(); // getUTCDay
        const distanceToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 

        currentStart.setUTCDate(now.getUTCDate() - distanceToMon);
        currentStart.setUTCHours(0, 0, 0, 0); // Start of day UTC

        currentEnd = new Date(currentStart);
        currentEnd.setUTCDate(currentStart.getUTCDate() + 6);
        currentEnd.setUTCHours(23, 59, 59, 999);

        previousStart = new Date(currentStart);
        previousStart.setUTCDate(previousStart.getUTCDate() - 7);
        
        previousEnd = new Date(previousStart);
        previousEnd.setUTCDate(previousEnd.getUTCDate() + 6);
        previousEnd.setUTCHours(23, 59, 59, 999);
    } 
    
    else if (filter === 'Month') {
        currentStart = new Date(now);
        currentStart.setUTCDate(1);
        currentStart.setUTCHours(0, 0, 0, 0);

        currentEnd = new Date(currentStart);
        currentEnd.setUTCMonth(currentEnd.getUTCMonth() + 1);
        currentEnd.setUTCDate(0); 
        currentEnd.setUTCHours(23, 59, 59, 999);

        previousStart = new Date(currentStart);
        previousStart.setUTCMonth(previousStart.getUTCMonth() - 1);
        
        previousEnd = new Date(previousStart);
        previousEnd.setUTCMonth(previousEnd.getUTCMonth() + 1);
        previousEnd.setUTCDate(0);
        previousEnd.setUTCHours(23, 59, 59, 999);
    } 
    
    else if (filter === 'Year') {
        const currentYear = now.getUTCFullYear();

        currentStart = new Date(now);
        currentStart.setUTCFullYear(currentYear, 0, 1);
        currentStart.setUTCHours(0, 0, 0, 0);

        currentEnd = new Date(now);
        currentEnd.setUTCFullYear(currentYear, 11, 31);
        currentEnd.setUTCHours(23, 59, 59, 999);

        previousStart = new Date(now);
        previousStart.setUTCFullYear(currentYear - 1, 0, 1);
        previousStart.setUTCHours(0, 0, 0, 0);

        previousEnd = new Date(now);
        previousEnd.setUTCFullYear(currentYear - 1, 11, 31);
        previousEnd.setUTCHours(23, 59, 59, 999);
    }

    return { currentStart, currentEnd, previousStart, previousEnd };
};

export const getChartAggregation = (companyId, start, end, filter) => {
    let groupStage = {};

    if (filter === 'Year') {
        groupStage = { _id: { $ceil: { $divide: [{ $month: "$date" }, 3] } }, total: { $sum: "$views" } };
    } else if (filter === 'Month') {
        groupStage = {
            _id: {
                $min: [
                    3,
                    { $floor: { $divide: [{ $subtract: [{ $dayOfMonth: "$date" }, 1] }, 7] } }
                ]
            },
            total: { $sum: "$views" } // or "$apps" for applications
        };
    } else if (filter === 'Week') {
        groupStage = { _id: { $dayOfWeek: "$date" }, total: { $sum: "$views" } };
    }

    return JobAnalyticsModel.aggregate([
        { $match: { companyId, date: { $gte: start, $lte: end } } },
        { $group: groupStage }
    ]);
};

export const formatDualChartData = (currentRaw, prevRaw, filter) => {
    if (filter === 'Year') {
        return [1, 2, 3, 4].map(q => ({
            name: `Q${q}`,
            current: currentRaw.find(d => d._id === q)?.total || 0,
            previous: prevRaw.find(d => d._id === q)?.total || 0
        }));
    }

    if (filter === 'Month') {
        // Map 0, 1, 2, 3. 
        return [0, 1, 2, 3].map(w => ({
            name: `W${w + 1}`,
            current: currentRaw.find(d => d._id === w)?.total || 0,
            previous: prevRaw.find(d => d._id === w)?.total || 0
        }));
    }

    if (filter === 'Week') {
        const daysMap = { 1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat' };
        const orderedIds = [2, 3, 4, 5, 6, 7, 1]; // Mon -> Sun
        return orderedIds.map(id => ({
            name: daysMap[id],
            current: currentRaw.find(d => d._id === id)?.total || 0,
            previous: prevRaw.find(d => d._id === id)?.total || 0
        }));
    }
};


// Total Applications via $lookup
export const getTotalApplications = (companyId, start, end) => {
    return JobModel.aggregate([
        { $match: { companyId } }, // Only jobs belonging to this company
        {
            $lookup: {
                from: "jobapplications",
                localField: "_id",
                foreignField: "jobId",
                as: "apps"
            }
        },
        { $unwind: "$apps" },
        { $match: { "apps.appliedAt": { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: 1 } } }
    ]);
};

// Chart Data via $lookup
export const getApplicationChartData = (companyId, start, end, filter) => {
    let groupExpression = {};

    if (filter === 'Year') {
        groupExpression = { $ceil: { $divide: [{ $month: "$apps.appliedAt" }, 3] } };
    } else if (filter === 'Month') {
        // MERGE WEEK 5 INTO 4 HERE
        groupExpression = {
            $min: [
                3,
                { $floor: { $divide: [{ $subtract: [{ $dayOfMonth: "$apps.appliedAt" }, 1] }, 7] } }
            ]
        };
    } else {
        groupExpression = { $dayOfWeek: "$apps.appliedAt" };
    }

    return JobModel.aggregate([
        { $match: { companyId } },
        {
            $lookup: {
                from: "jobapplications",
                localField: "_id",
                foreignField: "jobId",
                as: "apps"
            }
        },
        { $unwind: "$apps" },
        { $match: { "apps.appliedAt": { $gte: start, $lte: end } } },
        { $group: { _id: groupExpression, total: { $sum: 1 } } }
    ]);
};