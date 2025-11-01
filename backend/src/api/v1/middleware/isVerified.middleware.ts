import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';

export const isVerified = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }
  if (!req.user.isEmailVerified) {
    throw new ApiError(403, 'Email verification required. Please check your inbox.');
  }
  next();
});
