import { Router } from "express";
import jobController from "./controllers/job.controller.js";
import validate from "../../Middlewares/validate.js";
import jobValidator from "./validators/job.validator.js";
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../../Middlewares/AuthenticationMiddleware.js";
import { SYSTEM_ROLE } from "../../Constants/constants.js";

const jobRouter = Router()

// jobRouter.use(AuthenticationMiddleware());
// jobRouter.use(AuthorizationMiddleware(SYSTEM_ROLE.COMPANY))

jobRouter.post(
    "",
    validate(jobValidator.createJobSchema),
    jobController.createJob)

jobRouter.patch(
    "/:id",
    validate(jobValidator.updateJobSchema),
    jobController.updateJob
);

jobRouter.patch(
    "/:id/live",
    jobController.openCloseJob
);

jobRouter.delete(
    "/:id",
    jobController.deleteJob
);


export default jobRouter