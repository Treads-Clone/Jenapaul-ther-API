
import { Router } from 'express';
import RepliesController from '../../controllers/v1/repliesController.js';
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

// POST v1/thread/:post_id/reply
// DELETE v1/thread/:post_id/reply/{reply_id}
// PATCH v1/thread/:post_id/reply/{reply_id}
// GET v1/thread/:post_id/reply

const repliesRouter = new Router();
const repliesController = new RepliesController();

repliesRouter.use(authorization);


repliesRouter.post('/:post_id/reply', authentication, repliesController.createReplies.bind(repliesController));


repliesRouter.delete('/:post_id/reply/:reply_id', authentication, repliesController.deleteReplies.bind(repliesController));


repliesRouter.patch('/:post_id/reply/:reply_id', authentication, repliesController.updateReplies.bind(repliesController));


repliesRouter.get('/:post_id/reply', authentication, repliesController.getAllReplies.bind(repliesController));

export default repliesRouter;
