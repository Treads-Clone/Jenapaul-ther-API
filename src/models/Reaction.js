import { connection } from "../core/database.js";

class ThreadLikePost {
    constructor() {
        this.like = connection;  
    }

    async hasUserLikedPost(post_id, user_id) {
        try {
            const [rows] = await this.like.execute(
                "SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
                [post_id, user_id]
            );
            return rows.length > 0; 
        } catch (err) {
            console.error('<error> ThreadLikePost.hasUserLikedPost:', err);
            throw err;
        }
    }


    async likePost(post_id, user_id) {
        try {
            const alreadyLiked = await this.hasUserLikedPost(post_id, user_id);
    
            if (alreadyLiked) {
                return {
                    affectedRows: 0,
                    message: "User has already liked this post."
                };
            }
    
            const [insertResult] = await this.like.execute(
                "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
                [post_id, user_id]
            );

            const [countResult] = await this.like.execute(
                "SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?",
                [post_id]
            );

            const updatedLikeCount = countResult[0].like_count;
    
            return {
                affectedRows: insertResult.affectedRows,
                like_count: updatedLikeCount,
                message: "Post liked successfully."
            };
        } catch (err) {
            console.error('<error> ThreadLikePost.likePost:', err);
            throw err;
        }
    }

    async getLikesCountForPost(post_id) {
        try {
            const [rows] = await this.like.execute(
                "SELECT COUNT(*) AS likesCount FROM likes WHERE post_id = ?",
                [post_id]
            );
            return rows[0].likesCount;  // Corrected to use 'rows' instead of 'result'
        } catch (err) {
            console.error('<error> ThreadLikePost.getLikesCountForPost:', err);
            throw err;
        }
    }
     

    
    
    

    async unlikePost(post_id, user_id) {
        try {
            const [result] = await this.like.execute(
                "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
                [post_id, user_id]
            );
            return result;
        } catch (err) {
            console.error('<error> ThreadLikePost.unlikePost:', err);
            throw err;
        }
    }

    async findOne({ post_id, user_id }) {
        try {
            const [rows] = await this.like.execute(
                "SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
                [post_id, user_id]
            );
            return rows.length > 0 ? rows[0] : null; 
        } catch (err) {
            console.error('<error> ThreadLikePost.findOne:', err);
            throw err;
        }
    }

    async getLikeCount(post_id) {
        try {
            const [result] = await this.like.execute(
                "SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?",
                [post_id]
            );
    
            return result[0].like_count; 
        } catch (err) {
            console.error('<error> threadsPost.getLikeCount', err);
            throw err; 
        }
    }


    async getwhoLike(post_id) {
        try {
            const [rows] = await this.like.execute(
                `SELECT u.user_id, u.username 
                 FROM likes l 
                 JOIN users u ON l.user_id = u.user_id 
                 WHERE l.post_id = ?`,
                [post_id]
            );
    
            return rows; 
        } catch (err) {
            console.error('<error> threadsPost.getwhoLike:', err);
            throw err;
        }
    }
    
    async hasUserLikedReply(reply_id, user_id) {
        try {
            const [rows] = await this.like.execute(
                "SELECT * FROM reply_likes WHERE replies_id = ? AND user_id = ?",
                [reply_id, user_id]
            );
            // Return true if the user has liked the reply
            return rows.length > 0;
        } catch (err) {
            console.error('<error> hasUserLikedReply:', err);
            throw err;
        }
    }
    
    // Logic to handle liking a reply
    async likeReply(reply_id, user_id) {
        try {
            // Check if the user exists in the database
            const [userCheck] = await this.like.execute(
                "SELECT * FROM users WHERE user_id = ?",
                [user_id]
            );
    
            if (userCheck.length === 0) {
                return {
                    affectedRows: 0,
                    message: "User does not exist."
                };
            }
    
            // Check if the reply exists in the database
            const [replyCheck] = await this.like.execute(
                "SELECT * FROM replies WHERE replies_id = ?",
                [reply_id]
            );
    
            if (replyCheck.length === 0) {
                return {
                    affectedRows: 0,
                    message: "Reply does not exist."
                };
            }
    
            // Check if the user has already liked the reply
            const alreadyLiked = await this.hasUserLikedReply(reply_id, user_id);
    
            if (alreadyLiked) {
                return {
                    affectedRows: 0,
                    message: "User has already liked this reply."
                };
            }
    
            // Insert the like into the database
            const [insertResult] = await this.like.execute(
                "INSERT INTO reply_likes (replies_id, user_id) VALUES (?, ?)",
                [reply_id, user_id]
            );
    
            // Fetch the updated like count for the reply
            const [countResult] = await this.like.execute(
                "SELECT COUNT(*) AS like_count FROM reply_likes WHERE replies_id = ?",
                [reply_id]
            );
    
            const updatedLikeCount = countResult[0].like_count;
    
            return {
                affectedRows: insertResult.affectedRows,
                like_count: updatedLikeCount,
                message: "Reply liked successfully."
            };
        } catch (err) {
            console.error('<error> likeReply:', err);
            throw err;
        }
    }
    

    async unlikeReply(replies_id, user_id) {
        try {
            const [result] = await this.like.execute(
                "DELETE FROM reply_likes WHERE replies_id = ? AND user_id = ?",
                [replies_id, user_id]
            );
            return result;
        } catch (err) {
            console.error('<error> ThreadLikePost.unlikeReply:', err);
            throw err;
        }
    }
    

    async findOneonreply({ replies_id, user_id }) {
        try {
            const [rows] = await this.like.execute(
                "SELECT * FROM reply_likes WHERE replies_id = ? AND user_id = ?",
                [replies_id, user_id]
            );
            return rows.length > 0 ? rows[0] : null; 
        } catch (err) {
            console.error('<error> ThreadLikePost.findOneonreply:', err);
            throw err;
        }
    }

    async getLikeCountReply(replies_id) {
        try {
            const [result] = await this.like.execute(
                "SELECT COUNT(*) AS like_count FROM reply_likes WHERE replies_id = ?",
                [replies_id]
            );
    
            return result.like_count; 
        } catch (err) {
            console.error('<error> threadsPost.getLikeCountReply', err);
            throw new Error('Failed to get like count for reply');
        }
    }
    

    async getWhoLikeReply(replies_id) {
        try {
            const [rows] = await this.like.execute(
                `SELECT 
                     u.user_id, 
                     u.username,
                     COUNT(l.replies_id) AS replylike_count
                 FROM reply_likes l
                 JOIN users u ON l.user_id = u.user_id
                 WHERE l.replies_id = ?
                 GROUP BY u.user_id, u.username`,
                [replies_id]
            );
    
            return rows; 
        } catch (err) {
            console.error('<error> threadsPost.getWhoLikeReply:', err);
            throw new Error('Failed to fetch users who liked the reply');
        }
    }
    
    
}

export default ThreadLikePost;

