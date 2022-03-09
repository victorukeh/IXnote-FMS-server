const mongoose = require('mongoose')

let images
let videos
let js
let microsoft
let audio
let others
let pdfs
let private

mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  images = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' })
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  videos = new mongoose.mongo.GridFSBucket(db, { bucketName: 'videos' })
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  audio = new mongoose.mongo.GridFSBucket(db, { bucketName: 'audio' })
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  others = new mongoose.mongo.GridFSBucket(db, { bucketName: 'others' })
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  pdfs = new mongoose.mongo.GridFSBucket(db, { bucketName: 'pdfs' })
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  js = new mongoose.mongo.GridFSBucket(db, { bucketName: 'javascript/ecma' })
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  microsoft = new mongoose.mongo.GridFSBucket(db, { bucketName: 'microsoft' })
})
mongoose.connection.on('connected', () => {
  var db = mongoose.connections[0].db
  private = new mongoose.mongo.GridFSBucket(db, { bucketName: 'private' })
})

// @desc    Upload a File
// @route   POST /upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  const file = req.file
  if (!file || file.length === 0) {
    res.status(200).json({
      success: false,
      file: 'No file chosen',
    })
  }
  res.status(200).json({ file: file })
}

// @desc    Delete a File
// @route   DELETE /delete/:id
// @access  Private
exports.removeFile = async (req, res, next) => {
  images.delete(mongoose.Types.ObjectId(req.params.id), (err, gridStore) => {
    if (err) {
      videos.delete(
        mongoose.Types.ObjectId(req.params.id),
        (err, gridStore) => {
          if (err) {
            pdfs.delete(
              mongoose.Types.ObjectId(req.params.id),
              (err, gridStore) => {
                if (err) {
                  microsoft.delete(
                    mongoose.Types.ObjectId(req.params.id),
                    (err, gridStore) => {
                      if (err) {
                        audio.delete(
                          mongoose.Types.ObjectId(req.params.id),
                          (err, gridStore) => {
                            if (err) {
                              js.delete(
                                mongoose.Types.ObjectId(req.params.id),
                                (err, gridStore) => {
                                  if (err) {
                                    others.delete(
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
                                    res.status(200).json({
                                      success: true,
                                      message: 'Deleted',
                                    })
                                  }
                                }
                              )
                            } else {
                              res.status(200).json({
                                success: true,
                                message: 'Deleted',
                              })
                            }
                          }
                        )
                      } else {
                        res.status(200).json({
                          success: true,
                          message: 'Deleted',
                        })
                      }
                    }
                  )
                } else {
                  res.status(200).json({
                    success: true,
                    message: 'Deleted',
                  })
                }
              }
            )
          } else {
            res.status(200).json({
              success: true,
              message: 'Deleted',
            })
          }
        }
      )
    } else {
      res.status(200).json({
        success: true,
        message: 'Deleted',
      })
    }
  })
}

// @desc    Get a File
// @route   GET /:filename
// @access  Public
exports.getFile = async (req, res, next) => {
  images.find({ filename: req.params.filename }).toArray((err, file) => {
    if (!file || file.length === 0) {
      videos.find({ filename: req.params.filename }).toArray((err, file) => {
        if (!file || file.length === 0) {
          js.find({ filename: req.params.filename }).toArray((err, file) => {
            if (!file || file.length === 0) {
              microsoft
                .find({ filename: req.params.filename })
                .toArray((err, file) => {
                  if (!file || file.length === 0) {
                    audio
                      .find({ filename: req.params.filename })
                      .toArray((err, file) => {
                        if (!file || file.length === 0) {
                          pdfs
                            .find({ filename: req.params.filename })
                            .toArray((err, file) => {
                              if (!file || file.length === 0) {
                                others
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
// @route   GET /delete/:id
// @access  Public
exports.downloadFile = async (req, res, next) => {
  images.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      videos.find({ filename: req.params.filename }).toArray((err, files) => {
        if (!files || files.length === 0) {
          js.find({ filename: req.params.filename }).toArray((err, files) => {
            if (!files || files.length === 0) {
              microsoft
                .find({ filename: req.params.filename })
                .toArray((err, files) => {
                  if (!files || files.length === 0) {
                    audio
                      .find({ filename: req.params.filename })
                      .toArray((err, files) => {
                        if (!files || files.length === 0) {
                          pdfs
                            .find({ filename: req.params.filename })
                            .toArray((err, files) => {
                              if (!files || files.length === 0) {
                                others
                                  .find({ filename: req.params.filename })
                                  .toArray((err, files) => {
                                    if (!files || files.length === 0) {
                                      return next(
                                        res.status(404).json({
                                          success: false,
                                          err: 'File not found',
                                        })
                                      )
                                    } else {
                                      return others
                                        .openDownloadStreamByName(
                                          req.params.filename
                                        )
                                        .pipe(res)
                                    }
                                  })
                              } else {
                                return pdfs
                                  .openDownloadStreamByName(req.params.filename)
                                  .pipe(res)
                              }
                            })
                        } else {
                          return audio
                            .openDownloadStreamByName(req.params.filename)
                            .pipe(res)
                        }
                      })
                  } else {
                    return microsoft
                      .openDownloadStreamByName(req.params.filename)
                      .pipe(res)
                  }
                })
            } else {
              return js.openDownloadStreamByName(req.params.filename).pipe(res)
            }
          })
        } else {
          return videos.openDownloadStreamByName(req.params.filename).pipe(res)
        }
      })
    } else {
      return images.openDownloadStreamByName(req.params.filename).pipe(res)
    }
  })
}

// @desc    Get All Videos
// @route   GET /videos
// @access  Public
exports.getAllVideoFiles = async (req, res, next) => {
  videos.find().toArray((err, files) => {
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
  microsoft.find().toArray((err, files) => {
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
  js.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Get All PDFs
// @route   GET /pdfs
// @access  Public
exports.getAllPdfFiles = async (req, res, next) => {
  pdfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Get All Audio Files
// @route   GET /audio
// @access  Public
exports.getAllAudioFiles = async (req, res, next) => {
  audio.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Get All Photos
// @route   GET /photos
// @access  Public
exports.getAllImageFiles = async (req, res, next) => {
  images.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Get All Others FIles with unspecified FIle Types
// @route   GET /others
// @access  Public
exports.getAllOtherFiles = async (req, res, next) => {
  others.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Upload a Private File
// @route   POST /private/upload
// @access  Private
exports.uploadPrivateFile = async (req, res, next) => {
  const file = req.file
  if (!file || file.length === 0) {
    res.status(200).json({
      success: false,
      file: 'No file chosen',
    })
  }
  res.status(200).json({ file: file })
}

// @desc    Get a Private File
// @route   GET /private/:filename
// @access  Private
exports.getPrivateFile = async (req, res, next) => {
  private.find({ filename: req.params.filename }).toArray((err, file) => {
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
}

// @desc    Get All Private Files
// @route   GET /private
// @access  Private
exports.getAllPrivateFiles = async (req, res, next) => {
  private.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      })
    }

    return res.json(files)
  })
}

// @desc    Download a File
// @route   GET private/delete/:id
// @access  Private
exports.downloadPrivateFile = async (req, res, next) => {
  private.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return next(
        res.status(404).json({
          success: false,
          err: 'File not found',
        })
      )
    } else {
      return private.openDownloadStreamByName(req.params.filename).pipe(res)
    }
  })
}

// @desc    Delete a File
// @route   DELETE /private/delete/:id
// @access  Private
exports.removePrivateFile = async (req, res, next) => {
  private.delete(mongoose.Types.ObjectId(req.params.id), (err, gridStore) => {
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
  })
}
