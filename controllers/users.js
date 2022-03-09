const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get All Users
// @route   POST /users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()
  if (users) {
    res.status(200).json({
      success: true,
      users: users,
    })
  }
})

// @desc    Create a User
// @route   POST /users/new
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  const { name, role, password, username } = req.body
  if (!name || !role || !password || !username) {
    return next(new ErrorResponse('Some parameters are empty', 400))
  }
  const findUser = await User.findOne({ username: username })
  if (findUser) {
    return next(new ErrorResponse('User already exists', 400))
  } else {
    const user = await User.create({ name, role, password, username })
    return next(
      res.status(201).json({
        success: true,
        user: user,
      })
    )
  }
}

//@desc         Update User
//@route        PUT /users/:id
//@access       Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!user) {
      return next(new ErrorResponse(`User does not exist`, 404))
    }
    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    return next(
      new ErrorResponse(`User not found with an id of ${req.params.id}`, 404)
    )
  }
})

//@desc         Delete User
//@route        DELETE users/:id
//@access       Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return next(new ErrorResponse(`User does not exist`, 404))
    }
    res.status(200).json({
      success: true,
      message: 'User deleted',
    })
  } catch (err) {
    return next(new ErrorResponse(`User does not exist`, 404))
  }
}

//@desc         Login To User Account
//@route        POST authlogin
//@access       Public
exports.login = async (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    return next(new ErrorResponse('Please provide an username and password', 400))
  }
  const user = await User.findOne({ username }).select('+password')
  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401))
  }
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid Password', 401))
  }
  sendTokenResponse(user, 200, res)
}

// @desc      Log user out / clear cookie
// @route     GET auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({
    success: true,
    message: 'You have been logged out',
  })
})

//@desc         Change Password
//@route        PUT auth/changePassword
//@access       Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  if(req.user.id === undefined || req.user.id === null){
    return next(new ErrorResponse('You are not logged in', 404))
  }
  const password = req.body.password
  const repeatPassword = req.body.repeatPassword
  if(!password || !repeatPassword){
    return next(new ErrorResponse('Passwords cannot be empty', 400))
  }
  if(password !== repeatPassword){
    return next(new ErrorResponse('Passwords do not match', 400))
  }
  const user = await User.findByIdAndUpdate(req.user.id)
  user.password = password
  await user.save()
  res.status(200).json({
    success: true,
    user: user
  })

})

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      //to get 30days
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  // Key is the 'token'
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token })
}
