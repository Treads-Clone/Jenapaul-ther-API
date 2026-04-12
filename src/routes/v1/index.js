import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import homeRouter from './homeRoutes.js';
import followRouter from './followRoutes.js';
import threadPostRouter from './threadpostRoutes.js';
import searchRouter from './searchRoutes.js';
import repliesRouter from './replyRoutes.js';
import reactionRouter from './reactionRoutes.js';
import repostRouter from './repostRoutes.js';
import forgotpasswordRouter from './forgotpasswordRoutes.js'

const v1 = new Router();

// search
v1.use('/search', searchRouter);

// follow
v1.use('/follow', followRouter);

// account
v1.use('/account', accountRouter);

// Forgot Password
v1.use('/forgotpassword', forgotpasswordRouter)

// home
v1.use('/', homeRouter);

// reaction
v1.use('/threads', reactionRouter)

// threads
v1.use('/threads', threadPostRouter)

// replies
v1.use('/threads', repliesRouter)

// repost
v1.use('/threads', repostRouter)

export default v1;
