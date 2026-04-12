import { connection } from "../core/database.js";

class threadRepost {
    constructor() {
        this.repost = connection;
    }

    async createRepost(user_id, original_post_id, content) {
        try {
            const [existingRepost] = await this.repost.execute(
                'SELECT * FROM posts WHERE user_id = ? AND parent_repost_id = ?',
                [user_id, original_post_id]
            );
    
            if (existingRepost.length > 0) {
                throw new Error('You have already reposted this post.');
            }
 
            const [result] = await this.repost.execute(
                `INSERT INTO posts (user_id, content, parent_repost_id, created_at, updated_at)
                 VALUES (?, ?, ?, NOW(), NOW())`,
                [user_id, content, original_post_id]
            );
    
            return result.insertId; 
        } catch (err) {
            console.error('<error> threadRepost.createRepost:', err);
            throw new Error('already reposted');
        }
    }


    async getRepostsByParentId(parent_repost_id, user_id) {
        try {
            console.log('rpost', parent_repost_id);
            const [rows] = await this.repost.execute(
                'SELECT * FROM posts WHERE parent_repost_id = ? AND user_id = ?',
                [parent_repost_id, user_id]
            );
    
            if (rows.length === 0) {
                return null; 
            }
    
            return rows;
        } catch (err) {
            console.error('<error> threadRepost.getRepostsByParentId:', err);
            throw new Error('Failed to fetch reposts');
        }
    }
    
    async deleteRepost(post_id, user_id) {
        try {
            console.log('Attempting to delete repost with post_id:', post_id, 'and user_id:', user_id);
    
            const [result] = await this.repost.execute(
                `DELETE FROM posts 
                 WHERE post_id = ? 
                 AND user_id = ?`,
                [post_id, user_id]
            );
    
            if (result.affectedRows === 0) {
                console.log('No repost found for deletion.');
                return { success: false, message: 'No repost found to delete' };
            }
    
            console.log('Repost deleted successfully');
            return { success: true, message: 'Repost deleted successfully' };
        } catch (err) {
            console.error('<error> threadRepost.deleteRepost:', err);
            throw new Error('Failed to delete repost');
        }
    }
    
    async getOriginalPostContent(post_id) {
        try {
            console.log('Fetching original post content for post_id:', post_id); 
            const [rows] = await this.repost.execute(
                'SELECT content FROM posts WHERE post_id = ?',
                [post_id]
            );
    
            if (rows.length === 0) {
                console.log('No content found for post_id:', post_id); 
                return null; 
            }
            return rows[0].content;
        } catch (err) {
            console.error('<error> threadRepost.getOriginalPostContent:', err);
            throw new Error('Failed to fetch original post content');
        }
    }
    

    async getAllUserReposts(user_id) {
        try {
            const [reposts] = await this.repost.execute(
                `
                SELECT 
                    p1.*, 
                    p2.*, 
                    u1.username AS repost_username, 
                    u1.profile_image AS repost_profile_image,
                    u2.username AS original_username,
                    u2.profile_image AS original_profile_image,
                    (SELECT COUNT(*) 
                     FROM posts p3 
                     WHERE p3.parent_repost_id = p2.post_id) AS repost_count,
                    (SELECT COUNT(*) 
                     FROM likes l 
                     WHERE l.post_id = p2.post_id) AS like_count,
                    (SELECT COUNT(*) 
                     FROM replies rp 
                     WHERE rp.post_id = p2.post_id) AS reply_count  
                FROM 
                    posts p1
                LEFT JOIN 
                    posts p2 ON p1.parent_repost_id = p2.post_id
                LEFT JOIN 
                    users u1 ON p1.user_id = u1.user_id  -- User who reposted
                LEFT JOIN 
                    users u2 ON p2.user_id = u2.user_id  -- User of the original post
                WHERE 
                    p1.user_id = ? 
                    AND p1.parent_repost_id IS NOT NULL
                `,
                [user_id]
            );
    
            return reposts; 
        } catch (error) {
            console.error('Error fetching all reposts by user:', error);
            throw new Error('An error occurred while fetching reposts. Please try again later.');
        }
    }
    
    async  getUsernameWhoRepost(userId) {
        try {
            const [result] = await repost.execute(
                `SELECT 
                    u.user_id, 
                    u.username, 
                    u.profile_image
                FROM posts p
                JOIN users u ON p.user_id = u.user_id
                WHERE p.parent_repost_id = ?`,
                [userId]
            );
    
            return result;
        } catch (err) {
            console.error('<Database Query Error>', err.message);
            throw err;
        }
    }




    
    
}
export default threadRepost;
