import Joi from 'joi';
import { jobEmploymentTypeValues, jobCategoryValues, QUESTION_TYPE } from "../../../Constants/constants.js";

// Helper for ObjectId validation to keep the schema clean
const objectIdMessages = {
    'string.hex': '{#label} must be a valid hexadecimal string.',
    'string.length': '{#label} must be exactly 24 characters long.',
    'any.required': '{#label} is required.'
};

const createJobSchema = Joi.object({
    // --- ID Validations ---
    _id: Joi.string().hex().length(24).messages(objectIdMessages),
    companyId: Joi.string().hex().length(24).required().messages(objectIdMessages),

    title: Joi.string().trim().min(10).max(100).required().messages({
        'string.base': 'Title must be a text string.',
        'string.empty': 'Title cannot be empty.',
        'string.min': 'Title must be at least 10 characters long.',
        'string.max': 'Title must be at most 100 characters long.',
        'any.required': 'Title is a required field.'
    }),

    employmentType: Joi.string().trim().required().messages({
        'string.base': 'Employment type must be a text string.',
        'string.empty': 'Employment type cannot be empty.',
        'any.required': 'Employment type is a required field.'
    }),

    workplaceModel: Joi.string().trim().required().messages({
        'string.base': 'Workplace Model must be a text string.',
        'string.empty': 'Workplace Model cannot be empty.',
        'any.required': 'Workplace Model is a required field.'
    }),

    // --- SALARY & DATE ---
    salaryMin: Joi.number().positive().required().messages({
        'number.base': 'Minimum salary must be a number.',
        'number.positive': 'Minimum salary must be a positive number.',
        'any.required': 'Minimum salary is required.'
    }),

    salaryMax: Joi.number().positive().min(Joi.ref('salaryMin')).required().messages({
        'number.base': 'Maximum salary must be a number.',
        'number.positive': 'Maximum salary must be a positive number.',
        'number.min': 'Maximum salary cannot be less than the minimum salary ({#limit}).',
        'any.required': 'Maximum salary is required.'
    }),

    salaryCurrency: Joi.string().trim().uppercase().length(3).required().default("EGP").messages({
        'string.uppercase': 'Currency must be in uppercase (e.g., USD).',
        'string.length': 'Currency must be exactly 3 characters (ISO code).',
        'any.required': 'Salary currency is required.'
    }),

    postDate: Joi.date().required().messages({
        'date.base': 'Post date must be a valid date format.',
        'any.required': 'Post Date is required.'
    }),

    // dueDate: Joi.date().greater('now').messages({
    //     'date.base': 'Due date must be a valid date.',
    //     'date.greater': 'Due date must be set after the posting date.',
    // }),

    isLive: Joi.boolean().default(true).messages({
        'boolean.base': 'isLive must be true or false.'
    }),

    // --- CONTENT ---
    description: Joi.string().trim().min(50).max(1000).required().messages({
        'string.empty': 'Description cannot be empty.',
        'string.min': 'Description must be at least 50 characters.',
        'string.max': 'Description is too long (max 1000).',
        'any.required': 'Job description is required.'
    }),

    responsibilities: Joi.array()
        .items(Joi.string().trim().min(10).max(300).required().messages({
            'string.empty': 'Responsibility item cannot be empty.',
            'string.min': 'Responsibility item must be at least 10 characters.',
            'string.max': 'Responsibility item is too long (max 300).',
        }))
        .min(1).required().messages({
            'array.min': 'Provide at least one responsibility.',
            'any.required': 'Responsibilities list is required.'
        }),

    whoYouAre: Joi.array()
        .items(Joi.string().trim().min(10).max(300).required().messages({
            'string.empty': 'Who you are item cannot be empty.',
            'string.min': 'Each Who you are item must be at least 10 characters.',
            'string.max': 'Who you are item is too long (max 300).',
        }))
        .min(1).required().messages({
            'array.min': 'Provide at least one "Who You Are" requirement.'
        }),

    niceToHaves: Joi.array()
        .items(Joi.string().trim().min(10).max(300).required().messages({
            'string.empty': 'Nice to have item cannot be empty.',
            'string.min': 'Each Nice to have item must be at least 10 characters.',
            'string.max': 'Nice to have item is too long (max 300).',
        }))
        .min(1).required().messages({
            'array.min': 'Provide at least one "Nice to Have" item.'
        }),

    categories: Joi.array()
        .items(Joi.string().valid(...jobCategoryValues).required().messages({
            'any.only': 'Invalid category selected.'
        }))
        .min(1).required().messages({
            'array.min': 'Please select at least one job category.'
        }),

    // SKILLS [String] for testing
    // skillsIds: Joi.array()
    //     .items(Joi.string())
    //     .min(1).required().messages({
    //         'array.min': 'Please select at least one skill.'
    //     }),

    skillsIds: Joi.array()
        .items(Joi.string().hex().length(24).required().messages(objectIdMessages))
        .min(1).required().messages({
            'array.min': 'Please select at least one skill.'
        }),

    questions: Joi.array()
        .items(
            Joi.object({
                questionText: Joi.string().trim().min(10).max(300).required().messages({
                    'string.min': 'Question text is too short.',
                    'string.max': 'Question text is too long.',
                    'any.required': 'Question text is required within the questions array.'
                }),
                type: Joi.string()
                    .valid(...Object.values(QUESTION_TYPE))
                    .default(QUESTION_TYPE.TEXT)
                    .messages({
                        'any.only': 'Invalid question type provided.'
                    })
            })
        )
        .required(),

    benefits: Joi.array()
        .items(
            Joi.object({
                id: Joi.number().positive().required().messages({
                    'number.positive': 'Benefit ID must be a positive number.'
                }),
                icon: Joi.string().trim().required().messages({
                    'any.required': 'Benefit icon is required.'
                }),
                title: Joi.string().trim().required().messages({
                    'any.required': 'Benefit title is required.'
                }),
                description: Joi.string().trim().required().messages({
                    'any.required': 'Benefit description is required.'
                })
            })
        ).required()
});


// Derive the Update Schema
// .fork() takes the keys of the original schema and makes them optional
export const updateJobSchema = createJobSchema.fork(
    Object.keys(createJobSchema.describe().keys),
    (schema) => schema.optional()
);

export const getByIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format. Must be hexadecimal.',
        'string.length': 'Invalid ID length. Must be 24 characters.',
        'any.required': 'ID is required.'
    })
});

export default {
    createJobSchema,
    updateJobSchema,
    getByIdSchema
};