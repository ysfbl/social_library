import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Check if email is configured
const isEmailConfigured = !!(
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASSWORD
);

// Create reusable transporter (only if email is configured)
const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

// Send password reset email
export const sendPasswordResetEmail = async (
  to: string,
  username: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  // If email is not configured (development), just log the reset URL
  if (!isEmailConfigured) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 [DEV MODE] Password Reset Request');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 User: ${username} (${to})`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log('⏰ Token expires in: 1 hour');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Şifre Sıfırlama Talebi - Social Library',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Merhaba ${username},</h2>
        <p>Şifrenizi sıfırlamak için bir talepte bulundunuz.</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #4CAF50;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    display: inline-block;">
            Şifremi Sıfırla
          </a>
        </div>
        <p>Veya aşağıdaki linki tarayıcınıza kopyalayın:</p>
        <p style="color: #666; font-size: 12px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Bu link 1 saat içinde geçersiz olacaktır.
        </p>
        <p style="color: #999; font-size: 12px;">
          Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 11px; text-align: center;">
          © 2025 Social Library Platform
        </p>
      </div>
    `,
  };

  try {
    await transporter!.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (to: string, username: string): Promise<void> => {
  // If email is not configured (development), just log
  if (!isEmailConfigured) {
    console.log(`✅ [DEV MODE] Welcome email would be sent to ${username} (${to})`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Hoş Geldiniz! - Social Library',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hoş Geldiniz ${username}!</h2>
        <p>Social Library platformuna başarıyla kayıt oldunuz.</p>
        <p>Artık:</p>
        <ul>
          <li>Kitap ve filmleri keşfedebilir</li>
          <li>İzledikleriniz ve okuduklarınız için kütüphane oluşturabilir</li>
          <li>İçerikleri puanlayıp yorumlayabilir</li>
          <li>Diğer kullanıcıları takip edebilir</li>
          <li>Sosyal akışta aktiviteleri görebilirsiniz</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}"
             style="background-color: #2196F3;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    display: inline-block;">
            Platformu Keşfet
          </a>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 11px; text-align: center;">
          © 2025 Social Library Platform
        </p>
      </div>
    `,
  };

  try {
    await transporter!.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    // Don't throw error for welcome email, it's not critical
  }
};

export default {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
