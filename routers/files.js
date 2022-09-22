const multer = require("multer");
const express = require("express");
const router = express.Router();
const { storage } = require("../utils/multer");
const upload = multer({ storage: storage });
const {
	Log,
	getLogs,
	uploadFile,
	getAllVideoFiles,
	getAllPdfFiles,
	retrieveFile,
	getAllJavascriptAndEcmascriptFiles,
	getAllMicrosoftDocs,
	getAllAudioFiles,
	getAllImageFiles,
	getAllOtherFiles,
	removeFile,
	downloadFile,
	searchFile,
	renameFile,
} = require("../controllers/files");

router.post("/upload", upload.single("file"), uploadFile);
router.post("/log", Log);
router.put("/edit", renameFile);
router.get("/search", searchFile);
router.get("/logs", getLogs);
router.get("/videos", getAllVideoFiles);
router.get("/pdfs", getAllPdfFiles);
router.get("/jsecma", getAllJavascriptAndEcmascriptFiles);
router.get("/docs", getAllMicrosoftDocs);
router.get("/audio", getAllAudioFiles);
router.get("/photos", getAllImageFiles);
router.get("/others", getAllOtherFiles);
router.get("/download", downloadFile);
router.get("/", retrieveFile);
router.delete("/delete", removeFile);

module.exports = router;
