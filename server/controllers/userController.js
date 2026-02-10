import User from '../models/user.js';

async function getAllUsers(_req, res, next) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

export { getAllUsers };
