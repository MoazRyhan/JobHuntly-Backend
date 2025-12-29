import SkillModel from '../../DB/Models/SkillsModel.js';
import ApiError from '../../Utils/ApiError.utils.js';

const getSkills = async () => {
    const skills = await SkillModel.find();
    if (!skills) {
        throw new ApiError(404, 'No skills found')
    }
    return skills
}

export default {
    getSkills
};