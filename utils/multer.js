const multer = require("multer");
const File = require("../models/File");
const storage = multer.diskStorage({
	destination: async function (req, file, cb) {
		if (file.mimetype.split("/")[0] === "image") {
			const folder = "public/images";
			await createFile(file, folder);
			cb(null, "public/images");
		} else if (file.mimetype.split("/")[0] === "audio") {
			const folder = "public/audio";
			await createFile(file, folder);
			cb(null, "public/audio");
		} else if (file.mimetype.split("/")[0] === "video") {
			const folder = "public/videos";
			await createFile(file, folder);
			cb(null, "public/videos");
		} else if (
			file.mimetype === "application/javascript" ||
			file.mimetype === "application/ecmascript" ||
			file.mimetype === "text/jscript" ||
			file.mimetype === "text/livescript" ||
			file.mimetype === "application/x-javascript" ||
			file.mimetype === "application/x-ecmascript"
		) {
			const folder = "public/javascript";
			await createFile(file, folder);
			cb(null, "public/javascript");
		} else if (file.mimetype === "application/pdf") {
			const folder = "public/pdfs";
			await createFile(file, folder);
			cb(null, "public/pdfs");
		} else if (
			file.mimetype ===
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
			file.mimetype ===
				"application/application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
			file.mimetype ===
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			file.mimetype === "application/vnd.ms-powerpoint"
		) {
			const folder = "public/docs";
			await createFile(file, folder);
			cb(null, "public/docs");
		} else {
			const folder = "public/others";
			await createFile(file, folder);
			cb(null, "public/others");
		}
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

module.exports = {
	storage,
};

const createFile = async (file, folder) => {
	const type = file.mimetype;
	const check = await File.create({
		filename: file.originalname,
		folder: folder,
		type: type,
	});
	return check;
};
