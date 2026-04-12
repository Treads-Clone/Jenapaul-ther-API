import { connection } from "../core/database.js";

class Search{
    constructor(){
        this.thread = connection;
    }

    async searchUsers(searchTerm, userId=null){
        try{
            const [result,] = await connection.execute(
                `SELECT 
                u.user_id, 
                u.username, 
                u.fullname, 
                u.profile_image, 
                COUNT(f.following_user_id) AS followers_count,
                IF(
                    ? IS NOT NULL AND EXISTS (
                        SELECT 1
                        FROM followers
                        WHERE following_user_id = u.user_id
                        AND follower_user_id = ?
                    ),
                    1,
                    0
                ) AS is_following,
                IF(u.user_id = ?, 1, 0) AS loginUserId 
                FROM users u 
                LEFT JOIN followers f ON u.user_id = f.following_user_id
                WHERE username LIKE ?
                GROUP BY u.user_id`,
                [userId,userId,userId,`%${searchTerm}%`]
            );

            return result;
        } catch (err){
            console.error('<error>', err)
            throw err;
        }
    }

    async searchPostsWithHashtags(searchTerm) {
        try {
            const hashtagSearch = `%#${searchTerm}%`; 
    
            const [result] = await connection.execute(
                `SELECT 
                    u.user_id, 
                    p.post_id, 
                    u.username,
                    u.profile_image,
                    p.content, 
                    p.parent_repost_id,
                    COALESCE(l.like_count, 0) AS like_count,
                    COALESCE(r.replies_count, 0) AS replies_count,
                    COALESCE(repost_count.repost_count, 0) AS repost_count
                FROM posts p 
                JOIN users u ON u.user_id = p.user_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS like_count 
                     FROM likes 
                     GROUP BY post_id) l ON p.post_id = l.post_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS replies_count 
                     FROM replies 
                     GROUP BY post_id) r ON p.post_id = r.post_id
                LEFT JOIN 
                    (SELECT parent_repost_id, COUNT(*) AS repost_count 
                     FROM posts 
                     WHERE parent_repost_id IS NOT NULL 
                     GROUP BY parent_repost_id) repost_count ON p.post_id = repost_count.parent_repost_id
                LEFT JOIN post_hashtag ph ON p.post_id = ph.post_id
                LEFT JOIN hashtag h ON ph.hashtag_id = h.hashtag_id
                WHERE h.hashtag_text LIKE ?
                ORDER BY p.created_at DESC`, // Optional: Add sorting by recent posts
                [hashtagSearch]
            );
    
            return result;
        } catch (err) {
            console.error('<Database Query Error>', err.message);
            throw err; // Rethrow error for upstream handling
        }
    }
    

    async searchPosts(searchTerm) {
        try {
            const [result] = await connection.execute(
                `SELECT 
                    u.user_id, 
                    p.post_id, 
                    u.username,
                    u.profile_image,
                    p.content, 
                    p.parent_repost_id,
                    COALESCE(l.like_count, 0) AS like_count,
                    COALESCE(r.replies_count, 0) AS replies_count,
                    (SELECT COUNT(*) 
                     FROM posts 
                     WHERE parent_repost_id = p.post_id) AS repost_count
                FROM posts p
                JOIN users u ON u.user_id = p.user_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS like_count 
                     FROM likes 
                     GROUP BY post_id) l ON p.post_id = l.post_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS replies_count 
                     FROM replies 
                     GROUP BY post_id) r ON p.post_id = r.post_id
                LEFT JOIN post_hashtag ph ON p.post_id = ph.post_id
                LEFT JOIN post_hashtag parent_ph ON p.parent_repost_id = parent_ph.post_id
                WHERE p.content LIKE ? 
                  AND ph.post_id IS NULL  -- Exclude posts with hashtags
                  AND parent_ph.post_id IS NULL  -- Exclude reposts of posts with hashtags
                  AND p.content NOT LIKE '%#%'  -- Optional: Exclude content containing hashtags explicitly
                ORDER BY p.created_at DESC`, // Optionally sort by most recent
                [`%${searchTerm}%`]
            );
    
            return result;
        } catch (err) {
            console.error('<Database Query Error>', err.message);
            throw err;
        }
    }
    


    
    
}

export default Search;