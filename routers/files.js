const multer = require('multer')
const express = require('express')
const router = express.Router()
const { public, private } = require('../server')
const upload = multer({ storage: public })
const privateUpload = multer({ storage: private })
const { protect, authorize } = require('../middleware/auth')
const {
  uploadFile,
  getAllVideoFiles,
  getAllPdfFiles,
  getFile,
  getAllJavascriptAndEcmascriptFiles,
  getAllMicrosoftDocs,
  getAllAudioFiles,
  getAllImageFiles,
  getAllOtherFiles,
  downloadFile,
  removeFile,
  uploadPrivateFile,
  getPrivateFile,
  getAllPrivateFiles,
  downloadPrivateFile,
  removePrivateFile,
} = require('../controllers/files')

router.post('/upload', protect, upload.single('file'), uploadFile)
router.post(
  '/private/upload',
  protect,
  privateUpload.single('file'),
  uploadPrivateFile
)
router.get('/videos', getAllVideoFiles)
router.get('/pdfs', getAllPdfFiles)
router.get('/jsecma', getAllJavascriptAndEcmascriptFiles)
router.get('/docs', getAllMicrosoftDocs)
router.get('/audio', getAllAudioFiles)
router.get('/photos', getAllImageFiles)
router.get('/others', getAllOtherFiles)
router.get('/private', getAllPrivateFiles)
// Any route that sets parameters like '/:id'
// should come last so that it does not conflict with other routes
router.get('/:filename', getFile)
router.get('/private/:filename', protect, getPrivateFile)
router.get('/download/:filename', downloadFile)
router.get('/private/download/:filename', protect, downloadPrivateFile)
router.delete('/:id', protect, removeFile)
router.delete('/private/:id', protect, removePrivateFile)

module.exports = router
