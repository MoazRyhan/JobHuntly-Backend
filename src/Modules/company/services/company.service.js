import CompanyModel from "../../../DB/Models/CompanyModel.js"
import JobApplicationModel from "../../../DB/Models/JobApplicationModel.js";
import jobListModel from "../../../DB/Models/JobListModel.js";
import JobListModel from "../../../DB/Models/JobListModel.js";

export const getCompanyByIdService=async(companyId)=>{
    const company=await CompanyModel.findById(companyId);
    return company;
}

export const createCompanyService= async(companyData)=>{
    const company= await CompanyModel.create(companyData);
    return company;
}

