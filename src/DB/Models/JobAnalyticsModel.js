import mongoose from "mongoose";

const JobAnalyticsSchema = new mongoose.Schema({
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true, 
        index: true 
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true,
        index: true
    },

    // Date normalized to midnight (YYYY-MM-DD 00:00:00)
    date: { 
        type: Date, 
        required: true 
    }, 
    
    views: { 
        type: Number, 
        default: 0 
    }
});

JobAnalyticsSchema.index({ jobId: 1, date: 1 }, { unique: true });

const JobAnalyticsModel = mongoose.models.JobAnalytics || mongoose.model('JobAnalytics', JobAnalyticsSchema);
export default JobAnalyticsModel;