import { createCompanyService, getCompanyByIdService ,getJobsByCompanyIdService} from "../services/company.service.js"

export const getCompanyById=async(req,res,next)=>{
    try{
        const {companyId}= req.params;  
        const company=await getCompanyByIdService(companyId);
        if(!company){
            return res.status(404).json({
                message:"company not found",
            });
        }
        res.status(200).json({
            message:"Company fetched successfully",
            data:company,
        });
        
    }catch(error){
        next(error);
    }
}

export const createCompany= async(req, res, next)=>{
try{
    const company= await createCompanyService(req.body);
    res.status(201).json({
        message: "Company created successfully",
        data: company,
    });
}
catch(error){
    next(error);
}
}

export const getMyCompanyJobs = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const {
      page = 1,
      limit = 7,
      status,
      jobType,
      fromDate,
      toDate,
      search,
    } = req.query;

    if (!companyId) {
      return res.status(403).json({
        message: "This user is not associated with a company",
      });
    }

    const filters = {};
    if (status) filters.status = status;
    if (jobType) filters.jobType = jobType;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    if (search) filters.search = search;

    const jobs = await getJobsByCompanyIdService(
      companyId,
      Number(page),
      Number(limit),
      filters
    );

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};


