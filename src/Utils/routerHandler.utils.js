import errorHandlerMiddleware from '../Middlewares/ErrorHandlerMiddleware.js'
import AuthRouter from '../Modules/auth/auth.routes.js'
import JobRouter from '../Modules/job/job.routes.js'
import JobApplicationRouter from '../Modules/jobApplications/jobApplications.routes.js'

const routerHandler = async (app, express) => {
  app.use(express.json())

  app.use('/auth', AuthRouter)
  app.use('/jobs', JobRouter)
  app.use('/company/jobs/:jobId', JobApplicationRouter)

  app.use('/{*any}', (req, res) => {
    res.status(404).json({ message: 'this Router is not found' })
  })

  app.use(errorHandlerMiddleware)
}

export default routerHandler
