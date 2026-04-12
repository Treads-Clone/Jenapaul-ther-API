import Follow from '../../models/follow.js';

class FollowController{
    constructor(){
        this.follow = new Follow()
    }

    async followUser(req, res){
        try{
            const followerId = res.locals.user_id;
            const { followingId } = req.params;
            console.log(followingId);

            const result = await this.follow.followUser(followerId, followingId);

            if (result.affectedRows > 0) {
                if (followerId !== followingId){
                    res.send({
                        success: true,
                        message: "User followed successfully.",
                        data: {
                            user_id: followerId,
                            followed_user_id: followingId,
                            followed_at: new Date().toISOString(),
                        }
                    });
                } else{
                    res.send({
                        success: true,
                        message: "You can't follow yourself!!!!",
                    });
                }
            } else {
                res.send({
                    success: false,
                    message: 'Failed to follow user',
                });
            }
        } catch (err){
            res.send({
                success: false,
                message: err.toString()
            })
        }
    }

    async unfollowUser(req, res){
        try{
            const followerId = res.locals.user_id;
            const { followingId } = req.params;

            const result = await this.follow.unfollowUser(followerId,followingId);

            if (result.affectedRows > 0){
                res.send({
                    success: true,
                    message: 'User unfollowed successfully',
                    data: {
                        user_id: followerId,
                        unfollowed_user_id: followingId,
                        unfollowed_at: new Date().toISOString(),
                    }
                });
            } else {
                res.send({
                    success: false,
                    message: 'Failed to unfollow'
                });
            }
        } catch (err){
            res.send({
                success: false,
                message: err.toString()
            });
        }
    }

    async getFollowers(req, res){
        try{
            const userId  = res.locals.user_id;
            console.log(userId)

            const result = await this.follow.getFollowers(userId);

            res.send({
                success: true,
                data: {
                    result,
                }
            });
        } catch (err){
            res.send({
                success: false,
                message: err.toString()
            });
        }
    }

    async getFollowing(req,res){
        try{
            const userId  = res.locals.user_id;

            const result = await this.follow.getFollowing(userId);

            res.send({
                success: true,
                data: {
                    result,
                }
            });
        } catch (err){
            res.send({
                success: false,
                message: err.toString()
            });
        }
    }

    async getFollowersNotFollowingBack(req, res){
        try{
            const userId = res.locals.user_id

            const result = await this.follow.getFollowersNotFollowingBack(userId);

            res.send({
                success: true,
                data: {
                    result,
                }
            })
        } catch (err){
            res.send({
                success: false,
                message: err.toString()
            })
        }
    }

    async followSuggest(req, res){
        try{
            const user_id = res.locals.user_id
            console.log(user_id)
            const result = await this.follow.getFollowSuggestion(user_id)

            res.send({
                success: true,
                data: {
                    result,
                }
            })
        } catch (err){
            res.send({
                success: false,
                message: err.toString()
            })
        }
    }
}

export default FollowController;