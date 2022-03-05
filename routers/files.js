const multer = require('multer')
const express = require('express')
const router = express.Router()
const { storage } = require('../server')
const upload = multer({ storage })
const {verify} = require('../middleware/verifyUser')
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
  removeFile
} = require('../controllers/files')

router.post('/upload', upload.single('file'), uploadFile)
router.get('/videos', getAllVideoFiles)
router.get('/pdfs', getAllPdfFiles)
router.get('/jsecma', getAllJavascriptAndEcmascriptFiles)
router.get('/docs', getAllMicrosoftDocs)
router.get('/audio', getAllAudioFiles)
router.get('/photos', getAllImageFiles)
router.get('/others', getAllOtherFiles)
// Any route that sets parameters like '/:id' 
// should come last so that it does not conflict with other routes
router.get('/:filename', getFile)
router.get('/download/:filename', downloadFile)
router.delete('/delete/:id', removeFile)

module.exports = router
