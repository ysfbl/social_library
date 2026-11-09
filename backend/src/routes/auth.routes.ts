import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Kullanıcı adı 3-50 karakter olmalıdır')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi girin')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
  body('password_confirm')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Şifreler eşleşmiyor'),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi girin')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Şifre gereklidir'),
];

const forgotPasswordValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi girin')
    .normalizeEmail(),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token gereklidir'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
  body('password_confirm')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Şifreler eşleşmiyor'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

export default router;
