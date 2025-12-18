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

