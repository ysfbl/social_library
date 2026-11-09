import { Request, Response } from 'express';
import { query } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { sendPasswordResetEmail } from '../utils/email';
import crypto from 'crypto';

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, password_confirm, avatar_id, bio } = req.body;

    // Validation
    if (!username || !email || !password || !password_confirm) {
      res.status(400).json({
        success: false,
        message: 'Tüm alanları doldurun',
      });
      return;
    }

    if (password !== password_confirm) {
      res.status(400).json({
        success: false,
        message: 'Şifreler eşleşmiyor',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      const existingEmail = await query('SELECT id FROM users WHERE email = $1', [email]);
      const existingUsername = await query('SELECT id FROM users WHERE username = $1', [username]);

      if (existingEmail.rows.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Bu e-posta adresi zaten kullanımda',
        });
        return;
      }

      if (existingUsername.rows.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Bu kullanıcı adı zaten kullanımda',
        });
        return;
      }
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const avatarIdToUse = avatar_id || 1; // Default to avatar 1 if not provided
    const bioToUse = bio || null; // Bio is optional
    const result = await query(
      'INSERT INTO users (username, email, password_hash, avatar_id, bio) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, avatar_id, bio, created_at',
      [username, email, password_hash, avatarIdToUse, bioToUse]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
          avatar_id: newUser.avatar_id,
          bio: newUser.bio,
          created_at: newUser.created_at,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gereklidir',
      });
      return;
    }

    // Find user
    const result = await query(
      'SELECT id, username, email, password_hash, avatar, avatar_id, bio, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı',
      });
      return;
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          avatar_id: user.avatar_id,
          bio: user.bio,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş sırasında bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get current user profile
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const result = await query(
      'SELECT id, username, email, avatar, avatar_id, bio, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı bilgileri alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Forgot password - send reset email
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'E-posta adresi gereklidir',
      });
      return;
    }

    // Find user by email
    const userResult = await query(
      'SELECT id, username, email FROM users WHERE email = $1',
      [email]
    );

    // Don't reveal if user exists or not for security
    if (userResult.rows.length === 0) {
      res.status(200).json({
        success: true,
        message: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama linki gönderilecektir',
      });
      return;
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Delete any existing tokens for this user
    await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [user.id]);

    // Store reset token in database
    await query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, resetTokenHash, expiresAt]
    );

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, user.username, resetToken);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      res.status(500).json({
        success: false,
        message: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Şifre sıfırlama linki e-posta adresinize gönderildi',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama işlemi başarısız oldu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password, password_confirm } = req.body;

    // Validation
    if (!token || !password || !password_confirm) {
      res.status(400).json({
        success: false,
        message: 'Tüm alanları doldurun',
      });
      return;
    }

    if (password !== password_confirm) {
      res.status(400).json({
        success: false,
        message: 'Şifreler eşleşmiyor',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır',
      });
      return;
    }

    // Hash the provided token
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid reset token
    const tokenResult = await query(
      'SELECT user_id FROM password_reset_tokens WHERE token_hash = $1 AND expires_at > NOW()',
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token',
      });
      return;
    }

    const userId = tokenResult.rows[0].user_id;

    // Hash new password
    const password_hash = await hashPassword(password);

    // Update user password
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      password_hash,
      userId,
    ]);

    // Delete used token
    await query('DELETE FROM password_reset_tokens WHERE token_hash = $1', [tokenHash]);

    res.status(200).json({
      success: true,
      message: 'Şifreniz başarıyla sıfırlandı. Artık giriş yapabilirsiniz',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama işlemi başarısız oldu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};
