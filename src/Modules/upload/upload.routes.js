import { Router } from 'express'
import { MulterLocalMiddleware } from '../../Middlewares/MulterMiddleware.js'

const UploadRouter = Router()

UploadRouter.post(
  '/resume',
  MulterLocalMiddleware('resumes', ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']).single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/assets/resumes/${req.file.filename}`

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
    })
  }
)

export default UploadRouter
