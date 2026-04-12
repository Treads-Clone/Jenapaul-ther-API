// repostRoutes.js
import { Router } from 'express';
import ThreadRepostController from "../../controllers/v1/repostController.js";
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

// POST v1/repost/
// DELETE v1/repost/{repost_id}
// GET v1/repost/

const repostRouter = new Router();
const threadRepostController = new ThreadRepostController();

repostRouter.use(authorization);

repostRouter.get('/repost/:userId', authentication, threadRepostController.getReposts.bind(threadRepostController));

repostRouter.get('/who-repost/:userId', authentication,  threadRepostController.getUsernameWhoRepost.bind(threadRepostController));

repostRouter.post('/:post_id/repost', authentication, threadRepostController.repost.bind(threadRepostController));

repostRouter.delete('/:post_id/unrepost', authentication, threadRepostController.unrepost.bind(threadRepostController));


export default repostRouter;