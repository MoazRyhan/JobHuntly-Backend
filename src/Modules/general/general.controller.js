import { asyncHandler } from '../../Utils/asyncHandler.utils.js'
import { response } from '../../Utils/response.utils.js';
import generalService from '../general/general.service.js'

const getSkills = asyncHandler(async (req, res) => {
    const skills = await generalService.getSkills()
    return response(res, skills)
})

export default{
    getSkills
}