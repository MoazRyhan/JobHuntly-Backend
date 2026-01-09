import { response } from "../../../Utils/response.utils.js";
import { createCompanyService, getCompanyByIdService, getJobsByCompanyIdService, getAllCompaniesService } from "../services/company.service.js"

export const getCompanyById = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const company = await getCompanyByIdService(companyId);
    if (!company) {
      return res.status(404).json({
        message: "company not found",
      });
    }
    res.status(200).json({
      message: "Company fetched successfully",
      data: company,
    });

  } catch (error) {
    next(error);
  }
}

export const createCompany = async (req, res, next) => {
  try {
    const company = await createCompanyService(req.body);
    res.status(201).json({
      message: "Company created successfully",
      data: company,
    });
  }
  catch (error) {
    next(error);
  }
}

export const getMyCompanyJobs = async (req, res, next) => {
  try {
    const userId = req.login_user._id;

    const {
      page = 1,
      limit = 7,
      status,
      jobType,
      fromDate,
      toDate,
      search,
      workplaceModel,
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (jobType) filters.jobType = jobType;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    if (search) filters.search = search;
    if (workplaceModel) filters.workplaceModel = workplaceModel;

    const result = await getJobsByCompanyIdService(
      userId,
      Number(page),
      Number(limit),
      filters
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await getAllCompaniesService()

    return response(res, companies)

  } catch (error) {
    next(error)
  }
}
