import SkillModel from '../../DB/Models/SkillsModel.js';
import ApiError from '../../Utils/ApiError.utils.js';

const getSkillsByIds = async (ids) => {
    try {
        const skills = await SkillModel.find({ _id: { $in: ids } });
        if (!skills || skills.length === 0) {
            throw new ApiError(404, 'No skills found')
        }
        return skills;

    } catch (error) {
        console.error("Error fetching skills by IDs:", error);
        throw new ApiError(500, 'Error retrieving skills');
    }
};

const getSkills = async () => {
    const skills = await SkillModel.find();
    if (!skills) {
        throw new ApiError(404, 'Error fetching skills')
    }
    return skills
}

const createSkill = async (skillData) => {
    try {
        const skill = await SkillModel.create(skillData)
        return skill

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        // Catch Mongoose validation errors (e.g., missing required fields)
        if (error.name === 'ValidationError') throw new ApiError(400, error.message);

        console.error("Skill Creation Internal System Error:", error);
        throw new ApiError(500, 'SKill Creation Internal Server Error');
    }
}

const createSkills = async (skillsArray) => {
    try {
        const skills = await SkillModel.insertMany(skillsArray);
        return skills;

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        if (error.name === 'ValidationError') throw new ApiError(400, error.message);

        console.error("Bulk Skill Creation Error:", error);
        throw new ApiError(500, 'Bulk Skill Creation Internal Server Error');
    }
};

const updateSkill = async (id, skillData) => {
    try {
        const skill = await SkillModel.findByIdAndUpdate(id, skillData, { new: true })
        if (!skill)
            throw new ApiError(404, 'Skill not found')
        return skill

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        // Catch Mongoose validation errors (e.g., missing required fields)
        if (error.name === 'ValidationError') throw new ApiError(400, error.message);

        console.error("Skill Updating Internal System Error:", error);
        throw new ApiError(500, 'SKill Updating Internal Server Error');
    }
}

const updateSkills = async (skillsArray) => {
    try {
        const operations = skillsArray.map(skill => ({
            updateOne: {
                filter: { _id: skill._id },
                update: { $set: skill },
                runValidators: true
            }
        }));

        const result = await SkillModel.bulkWrite(operations);

        // If absolutely nothing was updated
        if (result.matchedCount === 0) {
            throw new ApiError(404, 'No matching skills found to update.');
        }

        if (result.modifiedCount < skillsArray.length) {
            return {
                success: true,
                partial: true,
                message: `Successfully updated ${result.modifiedCount} skills, but ${skillsArray.length - result.modifiedCount} items were not found.`,
                modifiedCount: result.modifiedCount
            };
        }

        return {
            success: true,
            partial: false,
            message: "All selected skills were updated successfully",
            modifiedCount: result.modifiedCount
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error("Bulk Skill Update Error:", error);
        throw new ApiError(500, 'Bulk Skill Updating Internal Server Error');
    }
};

const deleteSkill = async (id) => {
    try {
        const skill = await SkillModel.findByIdAndDelete(id)
        if (!skill)
            throw new ApiError(404, 'Skill not found')
        return skill

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        // Catch Mongoose validation errors (e.g., missing required fields)
        if (error.name === 'ValidationError') throw new ApiError(400, error.message);

        console.error("Skill Deletion Internal System Error:", error);
        throw new ApiError(500, 'SKill Deletion Internal Server Error');
    }
}

const deleteSkills = async (idsArray) => {
    try {
        // IDs are checked against the $in operator
        const result = await SkillModel.deleteMany({ _id: { $in: idsArray } });

        // If absolutely nothing was deleted
        if (result.deletedCount === 0) {
            throw new ApiError(404, 'No matching skills found to delete.');
        }

        // If some were deleted but not all
        if (result.deletedCount < idsArray.length) {
            return {
                success: true,
                partial: true,
                message: `Successfully deleted ${result.deletedCount} skills, but ${idsArray.length - result.deletedCount} items were not found.`,
                deletedCount: result.deletedCount
            };
        }

        // Perfect match deletion
        return {
            success: true,
            partial: false,
            message: "All selected skills were deleted successfully.",
            deletedCount: result.deletedCount
        };

    } catch (error) {
        if (error.statusCode) throw error;
        console.error("Bulk Skill Deletion Error:", error);
        throw new ApiError(500, 'Bulk Skill Deletion Internal Server Error');
    }
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