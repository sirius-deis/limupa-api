const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/user.model');

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new AppError('Sign in before trying to access this route', 401);
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
        throw new AppError('Token verification failed', 401);
    }

    req.user = await User.findById(payload.id);
    next();
});

exports.restrictTo = catchAsync(requiredRole => {
    return (req, res, next) => {
        const user = req.user;

        if (user.role !== requiredRole) {
            throw new AppError("You don't have access to this route", 403);
        }

        next();
    };
});
