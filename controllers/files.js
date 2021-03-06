const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const getIP = require('ipware')().get_ip
const asyncHandler = require('../middleware/async')
const Log = require('../models/Log')
let images, imageBucket
let videos, videoBucket
let js, jsBucket
let microsoft, microsoftBucket
let audio, audioBucket
let others, othersBucket
let pdfs, pdfBucket

mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  imageBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' })
  images = Grid(db, mongoose.mongo)
  images.collection('images')
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  videoBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'videos' })
  videos = Grid(db, mongoose.mongo)
  videos.collection('videos')
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  audioBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'audio' })
  audio = Grid(db, mongoose.mongo)
  audio.collection('audio')
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  othersBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'others' })
  others = Grid(db, mongoose.mongo)
  others.collection('others')
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  pdfBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'pdfs' })
  pdfs = Grid(db, mongoose.mongo)
  pdfs.collection('pdfs')
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  jsBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'javascript/ecma',
  })
  js = Grid(db, mongoose.mongo)
  js.collection('javascript/ecma')
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  microsoftBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'microsoft',
  })
  microsoft = Grid(db, mongoose.mongo)
  microsoft.collection('microsoft')
})

exports.Log = async (req, res, next) => {
  // const ipInfo = JSON.stringify(getIP(req)).split(',')[0]
  // const clientIp = ipInfo.split('::')[1].split(':')[1]
  // const Ip = clientIp.replace('"', '')
  var addr = require('os').networkInterfaces()
  var mac = addr['Wi-Fi'][0].mac
  const task = req.query.task
  const color = req.query.color
  const file = req.query.file
  const log = await new Log({
    Ip: mac,
    task: task,
    color: color,
    file: file,
  })
  await log.save()
  return res.status(200).json({
    log: log,
  })
}

exports.getLogs = async (req, res, next) => {
  const logs = await Log.find().sort({ createdAt: -1 })
  res.status(200).json({
    logs: logs,
  })
}

// @desc    Upload a File
// @route   POST /upload
// @access  Public
exports.uploadFile = async (req, res, next) => {
  const file = req.file
  if (!file || file.length === 0) {
    return res.status(200).json({
      success: false,
      file: 'No file chosen',
    })
  }
  return res.status(200).json({ file: file })
}

// @desc    Rename a File
// @route   PUT /rename
// @access  Public
exports.renameFile = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.query.id)
  const filename = req.query.name
  await imageBucket.rename(id, filename, (err, gridStore) => {
    if (err) return
    return res.status(200).json({
      success: true,
    })
  })
  await videoBucket.rename(id, filename, (err, gridStore) => {
    if (err) return
    return res.status(200).json({
      success: true,
    })
  })
  await pdfBucket.rename(id, filename, (err, gridStore) => {
    if (err) return
    return res.status(200).json({
      success: true,
    })
  })
   await audioBucket.rename(id, filename, (err, gridStore) => {
    if (err) return
    return res.status(200).json({
      success: true,
    })
  })
  await microsoftBucket.rename(id, filename, (err, gridStore) => {
    if (err) return
    return res.status(200).json({
      success: true,
    })
  })
  await jsBucket.rename(id, filename, (err, gridStore) => {
    if (err) return
    return res.status(200).json({
      success: true,
    })
  })
  await othersBucket.rename(id, filename, (err, gridStore) => {
    if (err) return
    return res.status(200).json({
      success: true,
    })
  })
}

// @desc    Delete An Image File
// @route   DELETE /image/:id
// @access  Public
exports.removeImageFile = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  imageBucket.delete(id, (err, gridStore) => {
    if (err)
      return res.status(404).json({
        message: 'File does not exist',
      })
    return res.status(200).json({ success: true })
  })
}

// @desc    Delete An Audio File
// @route   DELETE /audio/:id
// @access  Public
exports.removeAudioFile = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  audioBucket.delete(id, (err, gridStore) => {
    if (err)
      return res.status(404).json({
        error: 'File does not exist',
      })
    return res.status(200).json({ success: true })
  })
}

// @desc    Delete A Video File
// @route   DELETE /video/:id
// @access  Public
exports.removeVideoFile = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  videoBucket.delete(id, (err, gridStore) => {
    if (err)
      return res.status(404).json({
        error: 'File does not exist',
      })
    return res.status(200).json({ success: true })
  })
}

// @desc    Delete A JsEcma File
// @route   DELETE /others/:id
// @access  Public
exports.removeJsEcmaFile = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  jsBucket.delete(id, (err, gridStore) => {
    if (err)
      return res.status(404).json({
        error: 'File does not exist',
      })
    return res.status(200).json({ success: true })
  })
}

// @desc    Delete A PDF File
// @route   DELETE /pdfs/:id
// @access  Public
exports.removePdfFile = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  pdfBucket.delete(id, (err, gridStore) => {
    if (err)
      return res.status(404).json({
        error: 'File does not exist',
      })
    return res.status(200).json({ success: true })
  })
}

// @desc    Delete A Microsoft File
// @route   DELETE /microsoft/:id
// @access  Public
exports.removeMicrosoftFile = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  microsoftBucket.delete(id, (err, gridStore) => {
    if (err)
      return res.status(404).json({
        error: 'File does not exist',
      })
    return res.status(200).json({ success: true })
  })
}

// @desc    Delete An Others File
// @route   DELETE /others/:id
// @access  Public
exports.removeOthersFile = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  if (!id) return
  othersBucket.delete(id, (err, gridStore) => {
    if (err)
      return res.status(404).json({
        error: 'File does not exist',
      })
    return res.status(200).json({ success: true })
  })
}
// @desc    Delete a File
// @route   DELETE /delete/:id
// @access  Public
exports.removeFile = async (req, res, next) => {
  imageBucket.delete(
    mongoose.Types.ObjectId(req.params.id),
    (err, gridStore) => {
      if (err) {
        videoBucket.delete(
          mongoose.Types.ObjectId(req.params.id),
          (err, gridStore) => {
            if (err) {
              pdfBucket.delete(
                mongoose.Types.ObjectId(req.params.id),
                (err, gridStore) => {
                  if (err) {
                    microsoftBucket.delete(
                      mongoose.Types.ObjectId(req.params.id),
                      (err, gridStore) => {
                        if (err) {
                          audioBucket.delete(
                            mongoose.Types.ObjectId(req.params.id),
                            (err, gridStore) => {
                              if (err) {
                                jsBucket.delete(
                                  mongoose.Types.ObjectId(req.params.id),
                                  (err, gridStore) => {
                                    if (err) {
                                      othersBucket.delete(
                                        mongoose.Types.ObjectId(req.params.id),
                                        (err, gridStore) => {
                                          if (err) {
                                            return res.status(404).json({
                                              success: false,
                                              err: 'File does not exist',
                                            })
                                          } else {
                                            res.status(200).json({
                                              success: true,
                                              message: 'Deleted',
                                            })
                                          }
                                        }
                                      )
                                    } else {
                                      return res.status(200).json({
                                        success: true,
                                        message: 'Deleted',
                                      })
                                    }
                                  }
                                )
                              } else {
                                return res.status(200).json({
                                  success: true,
                                  message: 'Deleted',
                                })
                              }
                            }
                          )
                        } else {
                          return res.status(200).json({
                            success: true,
                            message: 'Deleted',
                          })
                        }
                      }
                    )
                  } else {
                    return res.status(200).json({
                      success: true,
                      message: 'Deleted',
                    })
                  }
                }
              )
            } else {
              return res.status(200).json({
                success: true,
                message: 'Deleted',
              })
            }
          }
        )
      } else {
        return res.status(200).json({
          success: true,
          message: 'Deleted',
        })
      }
    }
  )
}

// @desc    Get a File
// @route   GET /:filename
// @access  Public

exports.searchFile = asyncHandler(async (req, res, next) => {
  let search = []
  let searchField = req.query.filename
  await images.files
    .find({ filename: { $regex: searchField, $options: '$i' } })
    .limit(10)
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        search.push.apply(search, [])
      } else {
        search.push.apply(search, files)
      }
    })
  await videos.files
    .find({ filename: { $regex: searchField, $options: '$i' } })
    .limit(10)
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        search.push.apply(search, [])
      } else {
        search.push.apply(search, files)
      }
    })
  await pdfs.files
    .find({ filename: { $regex: searchField, $options: '$i' } })
    .limit(10)
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        search.push.apply(search, [])
      } else {
        search.push.apply(search, files)
      }
    })
  await microsoft.files
    .find({ filename: { $regex: searchField, $options: '$i' } })
    .limit(10)
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        search.push.apply(search, [])
      } else {
        search.push.apply(search, files)
      }
    })
  await js.files
    .find({ filename: { $regex: searchField, $options: '$i' } })
    .limit(10)
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        search.push.apply(search, [])
      } else {
        search.push.apply(search, files)
      }
    })
  await audio.files
    .find({ filename: { $regex: searchField, $options: '$i' } })
    .limit(10)
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        search.push.apply(search, [])
      } else {
        search.push.apply(search, files)
      }
    })
  await others.files
    .find({ filename: { $regex: searchField, $options: '$i' } })
    .limit(10)
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        search.push.apply(search, [])
      } else {
        search.push.apply(search, files)
      }
      return res.status(200).json(search)
    })
})
// @desc    Get a File
// @route   GET /:filename
// @access  Public
exports.getFile = async (req, res, next) => {
  imageBucket.find({ filename: req.params.filename }).toArray((err, file) => {
    if (!file || file.length === 0) {
      videoBucket
        .find({ filename: req.params.filename })
        .toArray((err, file) => {
          if (!file || file.length === 0) {
            jsBucket
              .find({ filename: req.params.filename })
              .toArray((err, file) => {
                if (!file || file.length === 0) {
                  microsoftBucket
                    .find({ filename: req.params.filename })
                    .toArray((err, file) => {
                      if (!file || file.length === 0) {
                        audioBucket
                          .find({ filename: req.params.filename })
                          .toArray((err, file) => {
                            if (!file || file.length === 0) {
                              pdfBucket
                                .find({ filename: req.params.filename })
                                .toArray((err, file) => {
                                  if (!file || file.length === 0) {
                                    othersBucket
                                      .find({ filename: req.params.filename })
                                      .toArray((err, file) => {
                                        if (!file || file.length === 0) {
                                          return next(
                                            res.status(404).json({
                                              success: false,
                                              err: 'File not found',
                                            })
                                          )
                                        } else {
                                          return res.json(file)
                                        }
                                      })
                                  } else {
                                    return res.json(file)
                                  }
                                })
                            } else {
                              return res.json(file)
                            }
                          })
                      } else {
                        return res.json(file)
                      }
                    })
                } else {
                  return res.json(file)
                }
              })
          } else {
            return res.json(file)
          }
        })
    } else {
      return res.json(file)
    }
  })
}

// @desc    Download a File
// @route   GET /download/:id
// @access  Public
exports.downloadFile = asyncHandler(async (req, res, next) => {
  // console.log(req.params.filename)
  await images.files.findOne(
    { filename: req.params.filename },
     async function (err, files) {
      if (!files || files.length === 0) return
      const response = imageBucket
        .openDownloadStreamByName(req.params.filename)
        .pipe(res)
      return response
    }
  )
  await videos.files.findOne(
    { filename: req.params.filename },
     async function (err, files) {
      if (!files || files.length === 0) return
      const response = videoBucket
        .openDownloadStreamByName(req.params.filename)
        .pipe(res)
      return response
    }
  )
  await js.files.findOne(
    { filename: req.params.filename },
     async function (err, files) {
      if (!files || files.length === 0) return
      const response = jsBucket
        .openDownloadStreamByName(req.params.filename)
        .pipe(res)
      return response
    }
  )
  await microsoft.files.findOne(
    { filename: req.params.filename },
     async function (err, files) {
      if (!files || files.length === 0) return
      const response = microsoftBucket
        .openDownloadStreamByName(req.params.filename)
        .pipe(res)
      return response
    }
  )
  await pdfs.files.findOne(
    { filename: req.params.filename },
     async function (err, files) {
      if (!files || files.length === 0) return
      const response = pdfBucket
        .openDownloadStreamByName(req.params.filename)
        .pipe(res)
      return response
    }
  )
  await audio.files.findOne(
    { filename: req.params.filename },
     async function (err, files) {
      if (!files || files.length === 0) return
      const response = audioBucket
        .openDownloadStreamByName(req.params.filename)
        .pipe(res)
      return response
    }
  )
  await others.files.findOne(
    { filename: req.params.filename },
     async function (err, files) {
      if (!files || files.length === 0) return
      const response = othersBucket
        .openDownloadStreamByName(req.params.filename)
        .pipe(res)
      return response
    }
  )
})

// @desc    Get All Videos
// @route   GET /videos
// @access  Public
exports.getAllVideoFiles = async (req, res, next) => {
  videos.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Get All Microsoft Docs
// @route   GET /docs
// @access  Public
exports.getAllMicrosoftDocs = async (req, res, next) => {
  microsoft.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Get All JavaScript and Ecmascript Files
// @route   GET /jsecma
// @access  Public
exports.getAllJavascriptAndEcmascriptFiles = async (req, res, next) => {
  js.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      const files = []
      return res.status(200).json(files)
    }

    return res.json(files)
  })
}

// @desc    Get All PDFs
// @route   GET /pdfs
// @access  Public
exports.getAllPdfFiles = async (req, res, next) => {
  pdfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      const files = []
      return res.status(200).json(files)
    }

    return res.json(files)
  })
}

// @desc    Get All Audio Files
// @route   GET /audio
// @access  Public
exports.getAllAudioFiles = async (req, res, next) => {
  audio.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      const files = []
      return res.status(200).json(files)
    }
    return res.status(200).json(files)
  })
}

// @desc    Get All Photos
// @route   GET /photos
// @access  Public
exports.getAllImageFiles = async (req, res, next) => {
  images.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    } else {
      return res.status(200).json(files)
    }
  })
}

// @desc    Get All Others FIles with unspecified FIle Types
// @route   GET /others
// @access  Public
exports.getAllOtherFiles = async (req, res, next) => {
  others.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      const files = []
      return res.status(200).json(files)
    }

    return res.json(files)
  })
}

// @desc    Upload a Public File
// @route   POST /Public/upload
// @access  Public
exports.uploadPublicFile = async (req, res, next) => {
  const file = req.file
  if (!file || file.length === 0) {
    return res.status(200).json({
      success: false,
      file: 'No file chosen',
    })
  }
  return res.status(200).json({ file: file })
}

// @desc    Get a Public File
// @route   GET /Public/:filename
// @access  Public
exports.getPublicFile = async (req, res, next) => {
  Public.find({ filename: req.params.filename }).toArray((err, file) => {
    if (!file || file.length === 0) {
      const files = []
      return res.status(200).json(files)
    } else {
      return res.json(file)
    }
  })
}

// @desc    Get All Public Files
// @route   GET /Public
// @access  Public
exports.getAllPublicFiles = async (req, res, next) => {
  Public.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Download a File
// @route   GET Public/delete/:id
// @access  Public
exports.downloadPublicFile = async (req, res, next) => {
  const filename = req.params.filename
  Public.files.findOne({ filename: filename }, function (err, files) {
    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        err: 'File not found',
      })
    } else {
      return PublicBucket.openDownloadStreamByName(req.params.filename).pipe(
        res
      )
    }
  })
}
