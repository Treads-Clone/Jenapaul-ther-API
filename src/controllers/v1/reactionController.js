import ThreadLikePost from '../../models/Reaction.js';
import ThreadPostController from '../../models/threadpost.js';
import RepliesController from '../../models/replies.js';

class ReactionController {
    constructor() {
        this.like = new ThreadLikePost();
        this.post = new ThreadPostController();
        this.reply = new RepliesController();
    }

    async likeThread(req, res) {
        try {
            const { post_id } = req.params;
            const user_id = res.locals.user_id; 
    
            const result = await this.like.likePost(post_id, user_id);
    
            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: "Post liked successfully.",
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: result.message || "Failed to like the post.",
                });
            }
        } catch (error) {
            console.error('<error> likeThread:', error);
            res.status(500).send({
                success: false,
                message: `Error while liking the post: ${error.message}`,
            });
        }
    }

    
    
    async unlikeThread(req, res) {
        try {
            const { post_id } = req.params;
            const user_id = res.locals.user_id;
    
            const post = await this.post.getPostById(post_id);
            if (!post) {
                return res.status(404).send({
                    success: false,
                    message: 'Post not found.',
                });
            }
    
            const existingLike = await this.like.hasUserLikedPost(post_id, user_id);
            if (!existingLike) {
                return res.status(400).send({
                    success: false,
                    message: 'Post not liked by the user.',
                });
            }
    
            const result = await this.like.unlikePost(post_id, user_id);
    
            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: "Post unliked successfully.",
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: "Failed to unlike the post.",
                });
            }
        } catch (error) {
            console.error('<error> unlikeThread:', error);
            res.status(500).send({
                success: false,
                message: `Error while unliking the post: ${error.message}`,
            });
        }
    }

    async getAllLike(req, res) {
        try {
            const { post_id } = req.params;
            const result = await this.like.getwhoLike(post_id);

            if (result.length > 0) {
                res.send({
                    success: true,
                    message: "Users who liked the post retrieved successfully.",
                    likes: result, 
                });
            } else {
                res.send({
                    success: false,
                    message: "No users have liked this post yet.",
                    likes: [],
                });
            }
        } catch (err) {
            res.status(500).send({ 
                success: false,
                message: err.toString()
            });
        }
    }


    async getLikesCount(req, res) {
        try {
            const { post_id } = req.params;
    
            // Assuming `getLikesCountForPost` is a method that retrieves the number of likes
            const likesCount = await this.like.getLikesCountForPost(post_id);
    
            if (likesCount !== null) {
                res.send({
                    success: true,
                    message: "Likes count retrieved successfully.",
                    likesCount: likesCount,
                });
            } else {
                res.send({
                    success: false,
                    message: "Failed to retrieve likes count.",
                });
            }
        } catch (err) {
            res.status(500).send({ 
                success: false,
                message: err.toString()
            });
        }
    }
    

    async likeReply(req, res) {
        try {
            const { replies_id } = req.params;
            const user_id = res.locals.user_id

            const result = await this.like.likeReply(replies_id, user_id);

            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: "replies liked successfully.",
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: result.message || "Failed to like the replies.",
                });
            }
        } catch (error) {
            console.error('<error> likeReply:', error);
            res.status(500).send({
                success: false,
                message: `Error while liking the replies: ${error.message}`,
            });
        }
    
    }

    async unlikeReplies(req, res) {
        try {
            const { replies_id } = req.params; 
            const user_id = res.locals.user_id;
    
            const reply = await this.reply.getReplyById(replies_id); // Change to getReplyById
            if (!reply) {
                return res.status(404).send({
                    success: false,
                    message: 'Reply not found.',
                });
            }
    
            const existingLike = await this.like.hasUserLikedReply(replies_id, user_id); // Change to hasUser LikedReply
            if (!existingLike) {
                return res.status(400).send({
                    success: false,
                    message: 'Reply not liked by the user.',
                });
            }
    
            const result = await this.like.unlikeReply(replies_id, user_id); // Change to unlikeReply
    
            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: "Reply unliked successfully.",
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: "Failed to unlike the reply.",
                });
            }
        } catch (error) {
            console.error('<error> unlikeReplies:', error);
            res.status(500).send({
                success: false,
                message: `Error while unliking the reply: ${error.message}`,
            });
        }
    }

    async getAllLikeReply(req, res) {
        try {
            const { replies_id } = req.params;
            const result = await this.like.getwhoLikeReply(replies_id);

            if (result.length > 0) {
                res.send({
                    success: true,
                    message: "Users who liked the reply retrieved successfully.",
                    likes: result, 
                });
            } else {
                res.send({
                    success: false,
                    message: "No users have liked this post yet.",
                    likes: [],
                });
            }
        } catch (err) {
            res.status(500).send({ 
                success: false,
                message: err.toString()
            });
        }
    }

}

export default ReactionController;