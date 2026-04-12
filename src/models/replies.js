import { connection } from "../core/database.js";

class Replies{
    constructor() {
        this.thread = connection;
    }

    async createReplies(post_id, user_id, comment_text, parent_reply_id = null) {
        try {
            
            if (parent_reply_id) {
                const [rows] = await this.thread.execute(
                    'SELECT COUNT(*) as count FROM replies WHERE replies_id = ?',
                    [parent_reply_id]
                );
    
                if (rows[0].count === 0) {
                    throw new Error(`Invalid parent reply ID: ${parent_reply_id}`);
                }
    
                
                const [parentReply] = await this.thread.execute(
                    'SELECT parent_reply_id FROM replies WHERE replies_id = ?',
                    [parent_reply_id]
                );
                if (parentReply[0].parent_reply_id !== null) {
                    throw new Error(`Only top-level replies can be replied to.`);
                }
            }
    
            const [result] = await this.thread.execute(
                "INSERT INTO replies (post_id, user_id, comment_text, parent_reply_id) VALUES (?, ?, ?, ?)",
                [post_id, user_id, comment_text, parent_reply_id]
            );
    
            return result;
    
        } catch (err) {
            if (err.errno === 1452) {
                throw new Error(`Cannot add replies: post_id ${post_id} does not exist.`);
            } else {
                throw err;
            }
        }
    }
    async getReplies(post_id) {
        try {
            const [result] = await this.thread.execute(
                `SELECT 
                    u.user_id, 
                    u.username,
                    u.profile_image, 
                    r.replies_id, 
                    r.post_id, 
                    r.comment_text,
                    r.parent_reply_id,
                    r.created_at,
                    COALESCE(l.reply_likes_count, 0) AS reply_likes_count,
                    (
                        SELECT COUNT(*)
                        FROM posts reposts
                        WHERE reposts.parent_repost_id = r.replies_id
                    ) AS repost_count
                FROM 
                    replies r 
                JOIN 
                    users u ON r.user_id = u.user_id 
                LEFT JOIN 
                    (SELECT replies_id, COUNT(*) AS reply_likes_count
                    FROM reply_likes
                    GROUP BY replies_id) l ON r.replies_id = l.replies_id
                WHERE 
                    r.post_id = ?;`, // Only fetch replies for the specified post_id
                [post_id]
            );
    
            const repliesMap = {};
            result.forEach(reply => {
                reply.replies = [];
                repliesMap[reply.replies_id] = reply;
            });
    
            const nestedReplies = [];
            result.forEach(reply => {
                if (reply.parent_reply_id && !repliesMap[reply.parent_reply_id].parent_reply_id) {
                    repliesMap[reply.parent_reply_id].replies.push(reply);
                } else if (!reply.parent_reply_id) {
                    nestedReplies.push(reply);
                }
            });
    
            return nestedReplies;
        } catch (err) {
            console.error('<error> getAllReplies', err);
            throw err;
        }
    }
    
    async getAccountReplies(user_id) {
        try {
            const [result] = await this.thread.execute(
                `SELECT 
                    r.replies_id, 
                    r.comment_text, 
                    p.post_id, 
                    p.content, 
                    u_reply.username AS reply_username, 
                    u_reply.profile_image AS reply_profile_image, 
                    u_post.username AS post_username, 
                    u_post.profile_image AS post_profile_image,
                    r.user_id AS reply_user_id,
                    p.user_id AS post_user_id, 
                    COALESCE(l.like_count, 0) AS like_count, 
                    COALESCE(rpc.replies_count, 0) AS replies_count,
                    COALESCE(rep.repost_count, 0) AS repost_count
                FROM replies r
                JOIN posts p ON r.post_id = p.post_id
                JOIN users u_reply ON r.user_id = u_reply.user_id
                JOIN users u_post ON p.user_id = u_post.user_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS like_count 
                     FROM likes 
                     GROUP BY post_id) l ON p.post_id = l.post_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS replies_count 
                     FROM replies 
                     GROUP BY post_id) rpc ON p.post_id = rpc.post_id
                LEFT JOIN 
                    (SELECT parent_repost_id, COUNT(*) AS repost_count 
                     FROM posts 
                     WHERE parent_repost_id IS NOT NULL
                     GROUP BY parent_repost_id) rep ON p.post_id = rep.parent_repost_id
                WHERE r.user_id = ?
                ORDER BY r.created_at DESC`,
                [user_id]
            );
            return result;
        } catch (err) {
            console.error('<error> getAccountReplies', err);
            throw err;
        }
    }
    

    async updateReplies(replies_id, user_id, post_id, comment_text,  parent_reply_id) {

        try {
    
            const [result] = await connection.execute(
                "UPDATE replies SET comment_text = ? WHERE replies_id = ? AND user_id = ? AND post_id = ?",
                
                [comment_text, replies_id, user_id, post_id, parent_reply_id] 
            );
            
            if (result.affectedRows === 0) {
               
                throw new Error(`Failed to update replies: Either replies_id ${replies_id} does not exist or user_id ${user_id} does not have permission.`);
            }
    
            return {
                success: true,
                message: `Replies ${replies_id} updated successfully.`,
                post_id: post_id,
                affectedRows: result.affectedRows,
            };
           
        } catch (err) {
            console.error('<error> updateReplies');
                throw err;
        }
    }

    async deleteReplies(replies_id, post_id, user_id) {
        try {
            const [result] = await connection.execute(
                "DELETE FROM replies WHERE replies_id = ? AND post_id = ? AND user_id = ?",
                [replies_id, post_id, user_id]
            );
            return result;
        } catch (err) {
            console.error('<error> deleteReplies', err);
            throw err;
        }
    }

    async getReplyById(replies_id) {
        try {
            const [rows] = await this.thread.execute(
                "SELECT * FROM replies WHERE replies_id = ?", 
                [replies_id]
            );
            return rows.length > 0 ? rows[0] : null; 
        } catch (err) {
            console.error('<error> Replies.getReplyById:', err);
            throw err; 
        }
    }
}


export default Replies;