const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const getIP = require("ipware")().get_ip;
const asyncHandler = require("../middleware/async");
const Log = require("../models/Log");
const File = require("../models/File");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

exports.Log = async (req, res, next) => {
	var addr = require("os").networkInterfaces();
	var mac = addr["Wi-Fi"][0].mac;
	const task = req.query.task;
	const color = req.query.color;
	const file = req.query.file;
	const log = await new Log({
		Ip: mac,
		task: task,
		color: color,
		file: file,
	});
	await log.save();
	return res.status(200).json({
		log: log,
	});
};

exports.getLogs = async (req, res, next) => {
	const logs = await Log.find().sort({ createdAt: -1 });
	res.status(200).json({
		logs: logs,
	});
};

// @desc    Upload a File
// @route   POST /upload
// @access  Public
exports.uploadFile = async (req, res, next) => {
	const file = req.file;
	const getFile = await File.findOneAndUpdate(
		{ filename: file.originalname },
		{ size: file.size }
	);
	if (!file || file.length === 0) {
		return res.status(200).json({
			success: false,
			file: "No file chosen",
		});
	}
	return res.status(200).json({ success: true, file: getFile });
};

// @desc    Rename a File
// @route   PUT /rename
// @access  Public
exports.renameFile = async (req, res, next) => {
	const { newFilename, oldFilename } = req.query;
	const file = await File.findOne({ filename: oldFilename });
	const newPath =
		"./" +
		`${file.folder}` +
		"/" +
		`${newFilename}` +
		path.extname(oldFilename);
	const oldPath = "./" + `${file.folder}` + "/" + `${oldFilename}`;
	const response = await fs.rename(oldPath, newPath, (err) => {
		if (err) {
			console.log(err);
		}
	});
	console.log(response);
	const updated = await File.findOneAndUpdate(
		{ filename: oldFilename },
		{ filename: newFilename }
	);
	return res.status(200).json({
		success: true,
		message: "File renamed successfully",
	});
};

// @desc    Delete a File
// @route   DELETE /delete/:id
// @access  Public
exports.removeFile = async (req, res, next) => {
	const { filename } = req.query;
	const file = await File.findOne({ filename: filename });
	const folder = file.folder.split("/")[1];
	const dirname = __dirname;
	let urlpath = dirname.replace("controllers", "public");
	urlpath = path.join(urlpath, folder);
	urlpath = path.join(urlpath, file.filename);
	// Delete the file like normal
	await unlinkAsync(urlpath);
	const deleteFile = await File.findOneAndDelete({ filename: filename });
	return res.status(200).json({
		success: true,
		message: "File deleted successfully",
	});
};

// @desc    Get a File
// @route   GET /:filename
// @access  Public

exports.searchFile = asyncHandler(async (req, res, next) => {
	let searchField = req.query.filename;
	const files = await File.find({
		filename: { $regex: searchField, $options: "$i" },
	}).limit(10);
	return res.status(200).json({
		success: true,
		files: files,
	});
});

// @desc    Download a File
// @route   GET /download/:id
// @access  Public
exports.downloadFile = asyncHandler(async (req, res, next) => {
	const { filename } = req.query;
	const file = await File.findOne({ filename: filename });
	const folder = file.folder.split("/")[1];
	const dirname = __dirname;
	let urlpath = dirname.replace("controllers", "public");
	urlpath = path.join(urlpath, folder);
	urlpath = path.join(urlpath, file.filename);
	res.download(urlpath, (err) => {
		return res.status(404).json({
			success: false,
			message: "File does not exist",
		});
	});
});

// @desc    Get All Videos
// @route   GET /videos
// @access  Public
exports.getAllVideoFiles = async (req, res, next) => {
	const videoPath = "public/videos";
	await getFiles(res, videoPath);
};

// @desc    Get All Microsoft Docs
// @route   GET /docs
// @access  Public
exports.getAllMicrosoftDocs = async (req, res, next) => {
	const microsoftPath = "public/docs";
	await getFiles(res, microsoftPath);
};

// @desc    Get All JavaScript and Ecmascript Files
// @route   GET /jsecma
// @access  Public
exports.getAllJavascriptAndEcmascriptFiles = async (req, res, next) => {
	const jsPath = "public/javascript";
	await getFiles(res, jsPath);
};

// @desc    Get All PDFs
// @route   GET /pdfs
// @access  Public
exports.getAllPdfFiles = async (req, res, next) => {
	const pdfsPath = "public/pdfs";
	await getFiles(res, pdfsPath);
};

// @desc    Get All Audio Files
// @route   GET /audio
// @access  Public
exports.getAllAudioFiles = async (req, res, next) => {
	const audioPath = "public/audio";
	await getFiles(res, audioPath);
};

// @desc    Get All Photos
// @route   GET /photos
// @access  Public
exports.getAllImageFiles = async (req, res, next) => {
	const imagePath = "public/images";
	await getFiles(res, imagePath);
};

// @desc    Get All Others FIles with unspecified FIle Types
// @route   GET /others
// @access  Public
exports.getAllOtherFiles = async (req, res, next) => {
	const othersPath = "public/others";
	await getFiles(res, othersPath);
};

// @desc    Get All Public Files
// @route   GET /Public
// @access  Public
exports.getAllPublicFiles = async (req, res, next) => {
	Public.files.find().toArray((err, files) => {
		if (!files || files.length === 0) {
			return res.status(404).json({
				err: "No files exist",
			});
		}

		return res.json(files);
	});
};

const getFiles = async (res, filepath) => {
	const files = await File.find({ folder: filepath });
	return res.status(200).json({
		success: true,
		files: files,
	});
};

exports.retrieveFile = async (req, res, next) => {
	const { filename } = req.query;
	const file = await File.find({ filename: filename });
	return res.status(200).json({
		success: true,
		file: file,
	});
};
