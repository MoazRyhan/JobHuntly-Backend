import errorHandlerMiddleware from "../Middlewares/ErrorHandlerMiddleware.js";
import AuthRouter from "../Modules/auth/auth.routes.js"
import MahmoudRouter from "../Modules/mahmoud/mahmoud.routes.js";
import SettingsRouter from "../Modules/settings/settings.routes.js";
import JobRouter from '../Modules/job/job.routes.js'
import JobApplicationRouter from '../Modules/jobApplications/jobApplications.routes.js'
import UploadRouter from '../Modules/upload/upload.routes.js'
import companyRoutes from "../Modules/company/company.routes.js"
import jobRouter from "../Modules/JobCRUD/job.route.js";
import skillsRouter from "../Modules/Skills/skills.route.js";

import applicantRouter from "../Modules/applicant/applicant.route.js";




const routerHandler = async (app, express) => {

    app.use(express.json())

    app.use("/auth", AuthRouter)
    app.use("/settings", SettingsRouter)
    app.use("/upload", UploadRouter)

    app.use("/companies", companyRoutes);
    app.use("/api", MahmoudRouter);

    app.use('/jobs', JobRouter)
    app.use('/company/jobs/:jobId', JobApplicationRouter)
    app.use('/job-applications', applicantRouter);

    app.use("/skills", skillsRouter)
    app.use("/jobs", jobRouter)





    app.use('/{*any}', (req, res) => {
        res.status(404).json({ message: "this Router is not found" })
    })

    app.use(errorHandlerMiddleware);
}

export default routerHandler
