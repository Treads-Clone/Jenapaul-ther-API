import { Router } from 'express';
import ReactionController from "../../controllers/v1/reactionController.js";
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

const ReactionRouter = new Router();
const reactionController = new ReactionController();

ReactionRouter.use(authorization);

//like for post
ReactionRouter.post('/:post_id/like', authentication, reactionController.likeThread.bind(reactionController));

ReactionRouter.delete('/:post_id/unlike', authentication, reactionController.unlikeThread.bind(reactionController));

ReactionRouter.get('/:post_id/likes', authentication, reactionController.getAllLike.bind(reactionController));

ReactionRouter.get('/:post_id/count-likes', authentication, reactionController.getLikesCount.bind(reactionController));
// like for comment
ReactionRouter.post('/:post_id/reply/:replies_id/like', authentication, reactionController.likeReply.bind(reactionController));

ReactionRouter.delete('/:post_id/reply/:replies_id/unlike', authentication, reactionController.unlikeReplies.bind(reactionController));

ReactionRouter.get('/:post_id/reply/:replies_id/likes', authentication, reactionController.getAllLikeReply.bind(reactionController));




export default ReactionRouter;


//Like a post
// Like a post
// threadPostRouter.post('/:post_id/like', authentication, threadPostController.likeThread.bind(threadPostController));

// // Route to Unlike a post
// threadPostRouter.delete('/:post_id/unlike', authentication,  threadPostController.unlikeThread.bind(threadPostController));

// // Route to get all liked posts for the authenticated user
// threadPostRouter.get('/posts/:post_id/like', authentication,  threadPostController.getLikedThreads.bind(threadPostController));

// // Get User Who LIKE POST
// threadPostRouter.get('/posts/:post_id/likes',  authentication,  threadPostController.getUsersWhoLikedThread.bind(threadPostController));

