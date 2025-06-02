import jwt from 'jsonwebtoken';
import  Farmer from '../models/farmerModel.js';
import ErrorHandler from '../utils/errorHandler.js';

export async function auth(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return next(new ErrorHandler('Invalid token format', 401));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Farmer.findById(decodedToken.id);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid token', 401));
  }
}

export async function isAdmin(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await Farmer.findById(userId).select('+password');

    if (!user) {
      return next(new ErrorHandler('Invalid token. User not found.', 401));
    }

    if (user.role !== 'admin') {
      return next(new ErrorHandler('Restricted.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler('Unauthorized.', 401));
  }
}
