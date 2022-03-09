const express = require('express')
const { mongo_uri } = require('./config/db')
const { GridFsStorage } = require('multer-gridfs-storage')
const errorHandler = require('./middleware/error')
const dotenv = require('dotenv')
const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  })
)
dotenv.config({
  path: './config/config.env',
})

// Authenticated GridFsStorage
const private = new GridFsStorage({
  url: mongo_uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname
      const fileinfo = {
        filename: filename,
        bucketName: 'private',
      }
      resolve(fileinfo)
    })
  },
})

// Unauthenticated GridFsStorage
const public = new GridFsStorage({
  url: mongo_uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname
      if (file.mimetype.split('/')[0] === 'image') {
        const fileinfo = {
          filename: filename,
          bucketName: 'images',
        }
        resolve(fileinfo)
      } else if (file.mimetype.split('/')[0] === 'audio') {
        const fileinfo = {
          filename: filename,
          bucketName: 'audio',
        }
        resolve(fileinfo)
      } else if (file.mimetype.split('/')[0] === 'video') {
        const fileinfo = {
          filename: filename,
          bucketName: 'videos',
        }
        resolve(fileinfo)
      } else if (
        file.mimetype === 'application/javascript' ||
        file.mimetype === 'application/ecmascript' ||
        file.mimetype === 'text/jscript' ||
        file.mimetype === 'text/livescript' ||
        file.mimetype === 'application/x-javascript' ||
        file.mimetype === 'application/x-ecmascript'
      ) {
        const fileinfo = {
          filename: filename,
          bucketName: 'javascript/ecma',
        }
        resolve(fileinfo)
      } else if (file.mimetype === 'application/pdf') {
        const fileinfo = {
          filename: filename,
          bucketName: 'pdfs',
        }
        resolve(fileinfo)
      } else if (
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype ===
          'application/application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-powerpoint'
      ) {
        const fileinfo = {
          filename: filename,
          bucketName: 'microsoft',
        }
        resolve(fileinfo)
      } else {
        const fileinfo = {
          filename: filename,
          bucketName: 'others',
        }
        resolve(fileinfo)
      }
    })
  },
})
module.exports = { public, private }

const uploads = require('./routers/files')
const users = require('./routers/users')
const auth = require('./routers/auth')

app.use('/auth', auth)
app.use('/users', users)
app.use('/', uploads)

app.use(errorHandler)

const port = process.env.PORT || 2000
const server = app.listen(port, console.log(`server running on port ${port}`))
