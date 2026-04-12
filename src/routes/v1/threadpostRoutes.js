// threadpostRoutes.js
import { Router } from 'express';
import ThreadPostController from "../../controllers/v1/threadpostController.js";
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';


// POST v1/thread/{post_id}
// DELETE v1/thread/{post_id}
// PATCH v1/thread/{post_id}

const threadPostRouter = new Router();
const threadPostController = new ThreadPostController();

threadPostRouter.use(authorization);

threadPostRouter.get('/', authentication,  threadPostController.getAllThreads.bind(threadPostController));

// get the top use hashtags
threadPostRouter.get('/hashtags', authentication, threadPostController.getTopUseHashtags.bind(threadPostController))

threadPostRouter.post('/', authentication,  threadPostController.createThread.bind(threadPostController));

threadPostRouter.delete('/:post_id', authentication,  threadPostController.deleteThread.bind(threadPostController));

threadPostRouter.patch('/:post_id', authentication,  threadPostController.updateThread.bind(threadPostController));

export default threadPostRouter;
