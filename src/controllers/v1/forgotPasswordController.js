import ForgotPassword from "../../models/forgotpassword.js";

class ForgotPasswordController {
    constructor() {
        this.passwordService = new ForgotPassword();
    }

    async requestOtp(req, res) {
        const { email } = req.body;
        try {
            const result = await this.passwordService.requestOTP(email);
            res.send({
                success: true,
                data: {
                    message: result.message
                }
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString()
            });
        }
    }

    async verifyOtp(req, res) {
        const { email, otp } = req.body;
        try {
            const result = await this.passwordService.verifyOTP(email, otp);
            res.send({
                success: true,
                data: {
                    message: result.message
                }
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString()
            });
        }
    }

    async resetPassword(req, res) {
        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.send({
                success: false,
                message: 'Passwords do not match'
            });
        }

        try {
            const result = await this.passwordService.updatePassword( newPassword);
            res.send({
                success: true,
                data: {
                    message: result.message
                }
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString()
            });
        }
    }
}

export default ForgotPasswordController;
