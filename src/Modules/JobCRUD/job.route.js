import { Router } from "express";
import jobController from "./controllers/job.controller.js";
import validate from "../../Middlewares/validate.js";
import jobValidator from "./validators/job.validator.js";

const jobRouter = Router()

jobRouter.post("", validate(jobValidator.createJobSchema), jobController.createJob)

// Validate 'id' (authenticated) from params, then validate 'updateData' from body
jobRouter.patch(
    "/:id",
    // validate(jobValidator.getByIdSchema, "params"), // Look in req.params
    // validate(jobValidator.updateJobSchema),  // Look in req.body
    jobController.updateJob
);

jobRouter.delete(
    "/:id",
    // validate(jobValidator.getByIdSchema, "params"),
    jobController.deleteJob
);
export default jobRouter