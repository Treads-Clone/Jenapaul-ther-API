import { connection } from "../core/database.js";
import { transporter } from "../core/nodeMailer.js";
import {encryptPassword} from "../utils/hash.js"

class ForgotPassword {
    constructor() {
        this.forgot = connection;
    }

    async requestOTP(email) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const expires = new Date(Date.now() + 300000);

            const [result] = await connection.execute(
                'UPDATE users SET reset_otp = ?, reset_expr = ? WHERE email = ?',
                [otp, expires, email]
            );

            if (result.affectedRows === 0) {
                throw new Error('No user found with that email address.');
            }

            await transporter.sendMail({
                to: email,
                subject: 'Password Reset OTP',
                html: `<h1>Password Reset OTP</h1><p>Enter the following reset code: <strong>${otp}</strong></p><p>Didn't request this code? Don't mind that.</p>`
            });

            return { message: 'OTP sent to your email.' };
        } catch (err) {
            console.error('<error> ForgotPassword.requestOTP:', err);
            throw new Error('Failed to send OTP.');
        }
    }

    async verifyOTP(email, otp) {
        try {
            const [result] = await connection.execute(
                'SELECT * FROM users WHERE email = ? AND reset_expr > NOW()',
                [email]
            );

            if (!result.length || result[0].reset_otp !== parseInt(otp, 10)) {
                throw new Error('Invalid or expired OTP.');
            }

            return { message: 'OTP verified. Proceed to reset password.' };
        } catch (err) {
            console.error('<error> ForgotPassword.verifyOTP:', err);
            throw new Error('Failed to verify OTP.');
        }
    }

    async updatePassword( newPassword) {
        try { 
            const hashedPassword = await encryptPassword(newPassword);
    
            await connection.execute(
                'UPDATE users SET password = ?, reset_otp = NULL, reset_expr = NULL ',
                [hashedPassword]
            );
    
            return { message: 'Password has been reset successfully.' };
        } catch (err) {
            console.error('<error> ForgotPassword.updatePassword:', err);
            throw new Error('Failed to update password.');
        }
    }
    
}

export default ForgotPassword;
