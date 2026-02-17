import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError.js';
import User from '../models/user.js';

const getAllUsers = async (_req, res, next) => {
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
};

const registration = async (req, res, next) => {
  try {
    const { email, password, userType, username } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password'));
    }

    if (!req.file) {
      return next(ApiError.badRequest('Аватар пользователя обязателен'));
    }

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'));
    }

    const avatarImage = `/static/${req.file.filename}`;
    const hashPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
      email,
      userType,
      username,
      avatar: avatarImage,
      password: hashPassword,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatar,
        isPro: user.userType === 'pro',
      },
    });
  } catch (error) {
    return next(ApiError.internal('Ошибка регистрации'));
  }
};

export { getAllUsers, registration };
