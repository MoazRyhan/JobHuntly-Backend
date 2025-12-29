import { Router } from 'express';
import generalController from '../general/general.controller.js';

const generalRouter = Router()

generalRouter.get('/skills', generalController.getSkills)

export default generalRouter