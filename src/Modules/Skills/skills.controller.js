import { asyncHandler } from '../../Utils/asyncHandler.utils.js'
import { response } from '../../Utils/response.utils.js';
import skillsService from '../Skills/skills.service.js'

const getSkillsByIds = async (req, res) => {
    const { ids } = req.body; // Expecting { "ids": ["id1", "id2"] }
    const skills = await SkillService.getSkillsByIds(ids);
    return response(res, skills)
};


const getSkills = asyncHandler(async (req, res) => {
    const skills = await skillsService.getSkills()
    return response(res, skills)
});

const createSkill = async (req, res) => {
    const skill = await SkillService.createSkill(req.body);
    return response(res, skill)
};

const createSkills = async (req, res) => {
    const skills = await SkillService.createSkills(req.body);
    return response(res, skills)
};

const updateSkill = async (req, res) => {
    const skill = await SkillService.updateSkill({ _id: req.params.id, ...req.body });
    return response(res, skill)
};

const updateSkills = async (req, res) => {
    const response = await SkillService.updateSkills(req.body);
    res.status(200).json(response);
};

const deleteSkill = async (req, res) => {
    const skill = await SkillService.deleteSkill(req.params.id);
    return response(res, skill)
};

const deleteSkills = async (req, res) => {
    const { ids } = req.body; // Expecting { "ids": ["id1", "id2"] }
    const response = await SkillService.deleteSkills(ids);
    res.status(200).json(response);
};

export default {
    getSkillsByIds,
    getSkills,
    createSkills,
    updateSkills,
    deleteSkills,
    createSkill,
    updateSkill,
    deleteSkill
};