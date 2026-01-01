import { Router } from 'express';
import skillsController from '../Skills/skills.controller.js';
import { AuthenticationMiddleware, AuthorizationMiddleware } from '../../Middlewares/AuthenticationMiddleware.js';
import { SYSTEM_ROLE } from '../../Constants/constants.js';

const skillsRouter = Router()

skillsRouter.use(AuthenticationMiddleware());

skillsRouter.get('', skillsController.getSkills)

skillsRouter.get('/byIds', skillsController.getSkillsByIds)

// ADMIN-ONLY Routes
skillsRouter.use(AuthorizationMiddleware(SYSTEM_ROLE.ADMIN));

// Create
skillsRouter.post('/', skillsController.createSkill);
skillsRouter.post('/bulk', skillsController.createSkills);

// Update
skillsRouter.put('/:id', skillsController.updateSkill);
skillsRouter.put('/bulk', skillsController.updateSkills);

// Delete
skillsRouter.delete('/:id', skillsController.deleteSkill);
skillsRouter.delete('/bulk', skillsController.deleteSkills);

export default skillsRouter