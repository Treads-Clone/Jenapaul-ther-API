import { Router } from 'express';

import AccountController from '../../controllers/v1/accountController.js';

import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js'
import upload from '../../core/multerConfig.js';

const accountRouter = new Router();
const account = new AccountController();

accountRouter.use(authorization);

// Login
accountRouter.post('/login',account.login.bind(account));

// create Account
accountRouter.post('/', upload.single('profile_img') ,account.create.bind(account));


// upload_image
accountRouter.patch('/upload', upload.single('profile_img'),authentication, account.uploadProfileImg.bind(account));

// get profile
accountRouter.get('/profile/:userId', authentication, account.getUsersProfile.bind(account));

// Get Profile
accountRouter.get('/', authentication, account.profile.bind(account));

// Get your Threads POST
accountRouter.get('/post' ,authentication,account.getAccountThreads.bind(account));

accountRouter.get('/profile/post/:userId', authentication,account.getProfilePost.bind(account))

accountRouter.get('/profile/replies/:userId', authentication, account.getProfileRepliesWithPost.bind(account))

accountRouter.get('/profile/repost/:userId', authentication, account.getAllProfileReposts.bind(account))

accountRouter.get('/replies', authentication, account.getRepliesWithPost.bind(account));

accountRouter.get('/repost', authentication, account.getAllUserReposts.bind(account));


// Update Profile
accountRouter.patch('/', authentication, account.updateProfile.bind(account));

// Delete Account
accountRouter.delete('/', authentication, account.deleteUser.bind(account));

// Forget Password
accountRouter.post('/forgot', authentication, account.requestPasswordReset.bind(account));

// Reset Password
accountRouter.post('/reset', authentication, account.resetPassword.bind(account));
// accountRouter.use(authorization);
// accountRouter.get('/', getUsers);
// accountRouter.post('/', createUser);
// accountRouter.get('/:id', getUserId);
// accountRouter.delete('/:id',deleteUser);
// accountRouter.patch('/:id', updateUser)

export default accountRouter;