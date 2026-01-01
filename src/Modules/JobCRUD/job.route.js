import { Router } from "express";
import jobController from "./controllers/job.controller.js";
import validate from "../../Middlewares/validate.js";
import jobValidator from "./validators/job.validator.js";
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../../Middlewares/AuthenticationMiddleware.js";
import { SYSTEM_ROLE } from "../../Constants/constants.js";
import { JobOwnershipMiddleware } from "../../Middlewares/JobOwnershipMiddleware.js";
import { response } from "../../Utils/response.utils.js";

const jobRouter = Router()

jobRouter.use(AuthenticationMiddleware());
jobRouter.use(AuthorizationMiddleware(SYSTEM_ROLE.COMPANY))

jobRouter.post(
    "",
    validate(jobValidator.createJobSchema),
    jobController.createJob)

// Get Job by Id + check the logged-in company ownership of this job
jobRouter.get(
    "/:id/owner",
    JobOwnershipMiddleware,
    (req, res) => {
        return response(res, req.targetJob)
    }
);

jobRouter.patch(
    "/:id",
    validate(jobValidator.updateJobSchema),
    JobOwnershipMiddleware,
    jobController.updateJob
);

jobRouter.patch(
    "/:id/live",
    JobOwnershipMiddleware,
    jobController.openCloseJob
);

jobRouter.delete(
    "/:id",
    JobOwnershipMiddleware,
    jobController.deleteJob
);


export default jobRouter