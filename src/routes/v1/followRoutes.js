import { Router } from 'express';

import FollowController from '../../controllers/v1/followController.js';
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

const followRouter = new Router();
const follow = new FollowController();

followRouter.use(authorization);

// follow user
followRouter.post('/:followingId', authentication, follow.followUser.bind(follow));

followRouter.get('/', authentication, follow.followSuggest.bind(follow))

// unfollow
followRouter.delete('/unfollow/:followingId', authentication, follow.unfollowUser.bind(follow));

// get followers
followRouter.get('/followers', authentication, follow.getFollowers.bind(follow));

// get 
followRouter.get('/follow', authentication ,follow.getFollowersNotFollowingBack.bind(follow));

// get following
followRouter.get('/following', authentication, follow.getFollowing.bind(follow));

export default followRouter;