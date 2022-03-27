const multer = require('multer')
const express = require('express')
const router = express.Router()
const { storage } = require('../server')
const upload = multer({ storage: storage })
const {
  Log,
  getLogs,
  uploadFile,
  getAllVideoFiles,
  getAllPdfFiles,
  getFile,
  getAllJavascriptAndEcmascriptFiles,
  getAllMicrosoftDocs,
  getAllAudioFiles,
  getAllImageFiles,
  getAllOtherFiles,
  removeFile,
  downloadFile,
  removeImageFile,
  searchFile,
  removeVideoFile,
  removeAudioFile,
  removeOthersFile,
  removeJsEcmaFile,
  removePdfFile,
  removeMicrosoftFile,
} = require('../controllers/files')


router.post('/upload', upload.single('file'), uploadFile)
router.post('/log', Log)
router.get('/search', searchFile)
router.get('/logs', getLogs)
router.get('/videos', getAllVideoFiles)
router.get('/pdfs', getAllPdfFiles)
router.get('/jsecma', getAllJavascriptAndEcmascriptFiles)
router.get('/docs', getAllMicrosoftDocs)
router.get('/audio', getAllAudioFiles)
router.get('/photos', getAllImageFiles)
router.get('/others', getAllOtherFiles)
router.get('/download/:filename', downloadFile)
router.get('/:filename', getFile)
router.delete('/image/:id', removeImageFile)
router.delete('/video/:id', removeVideoFile)
router.delete('/audio/:id', removeAudioFile)
router.delete('/others/:id', removeOthersFile)
router.delete('/jsecma/:id', removeJsEcmaFile)
router.delete('/pdfs/:id', removePdfFile)
router.delete('/docs/:id', removeMicrosoftFile)
router.delete('/:id', removeFile)

module.exports = router
