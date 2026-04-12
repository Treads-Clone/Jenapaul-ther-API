import { Router } from 'express';
import ForgotPasswordController from "../../controllers/v1/forgotPasswordController.js";

const forgotpasswordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();

forgotpasswordRouter.post('/request_otp', forgotPasswordController.requestOtp.bind(forgotPasswordController));
forgotpasswordRouter.post('/verify_otp', forgotPasswordController.verifyOtp.bind(forgotPasswordController));
forgotpasswordRouter.post('/reset_password', forgotPasswordController.resetPassword.bind(forgotPasswordController));

export default forgotpasswordRouter;
