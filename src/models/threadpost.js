import { connection } from "../core/database.js";

class threadsPost {
    constructor() {
        this.thread = connection;
    
    }

    async createPost(user_id, content) {
        try {
            const [result] = await this.thread.execute(
                "INSERT INTO posts (user_id, content) VALUES (?, ?)", 
                [user_id, content]
            );
    
            if (!result || result.affectedRows === undefined) {
                throw new Error('Failed to insert post. No affected rows.');
            }
    
            return result;
    
        } catch (err) {
            console.error('<error> threadsPost.createPost', err);
            throw err;
        }
    }

    async insertHashtag(hashtag) {
        try {
            const [existingHashtag] = await this.thread.execute(
                "SELECT hashtag_id FROM hashtag WHERE hashtag_text = ?", 
                [hashtag]
            );
    
            if (existingHashtag.length > 0) {
                console.log(`Hashtag "${hashtag}" already exists with ID:`, existingHashtag[0].hashtag_id);
                return existingHashtag[0].hashtag_id; 
            }
    
            const [result] = await this.thread.execute(
                "INSERT INTO hashtag (hashtag_text) VALUES (?)", 
                [hashtag]
            );
            console.log(`Inserted new hashtag "${hashtag}" with ID:`, result.insertId); 
    
            return result.insertId; 
    
        } catch (err) {
            console.error('Error inserting hashtag:', err);
            throw err;
        }
    }

    async linkHashtagToPost(post_id, hashtag_id) {
        try {
            const result = await this.thread.execute(
                "INSERT INTO post_hashtag (post_id, hashtag_id) VALUES (?, ?)", 
                [post_id, hashtag_id]
            );
            console.log(`Linked post ${post_id} with hashtag ${hashtag_id}`); 
        } catch (err) {
            console.error('Error linking hashtag to post:', err);
            throw err;
        }
    }

    async removePostHashtags(post_id) {
        try {
            const result = await this.thread.execute(
                "DELETE FROM post_hashtag WHERE post_id = ?", 
                [post_id]
            );
            console.log(`Removed hashtags linked to post ${post_id}`);
        } catch (err) {
            console.error('Error removing hashtags for post:', err);
            throw err;
        }
    }

    async updatePost(user_id, post_id, newContent) {
        try {
            const [result] = await this.thread.execute(
                `UPDATE posts SET content = ? WHERE post_id = ? AND user_id = ?`,
                [newContent, post_id, user_id]
            );
    
            if (result.affectedRows === 0) {
                throw new Error(`Failed to update post: Either post_id ${post_id} does not exist or user_id ${user_id} does not have permission.`);
            }

            await this.removePostHashtags(post_id);

            const hashtags = newContent.match(/#\w+/g);
            console.log("Extracted Hashtags:", hashtags);
    
            if (hashtags && hashtags.length > 0) {
                for (let hashtag of hashtags) {
                    const cleanHashtag = hashtag.trim();

                    const hashtagId = await this.insertHashtag(cleanHashtag);

                }
            }
    
            return {
                success: true,
                message: `Post ${post_id} updated successfully.`,
                post_id: post_id,
                affectedRows: result.affectedRows,
            };
    
        } catch (err) {
            console.error('<error> threadsPost.updatePost', err);
            throw err; 
        }
    }

    async deletePost(user_id, post_id) {
        try {
            const [result] = await this.thread.execute(
                "DELETE FROM posts WHERE post_id = ? AND user_id = ?",
                [post_id, user_id]
            );
            return result;
        } catch (err) {
            console.error('<error> threadsPost.deletePost', err);
            throw err;
        }
    }

    async getPost() {
        try {
            const [result] = await this.thread.execute(
                `SELECT 
                    u.user_id, 
                    p.post_id, 
                    u.username,
                    u.profile_image,
                    p.content, 
                    p.parent_repost_id,
                    COALESCE(l.like_count, 0) AS like_count,
                    COALESCE(r.replies_count, 0) AS replies_count,
                    (SELECT COUNT(*) FROM posts WHERE parent_repost_id = p.post_id) AS repost_count
                 FROM 
                    posts p
                 JOIN 
                    users u ON p.user_id = u.user_id 
                 LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS like_count 
                     FROM likes 
                     GROUP BY post_id) l 
                 ON p.post_id = l.post_id
                 LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS replies_count 
                     FROM replies 
                     GROUP BY post_id) r 
                 ON p.post_id = r.post_id
                 ORDER BY 
                    p.created_at DESC;`
            );
            return result;
        } catch (err) {
            console.error('<error> threadsPost.getPost', err);
            throw new Error('An error occurred while fetching posts. Please try again later.');
        }
    }

    async getAccountPost(user_id) {
        try {
            const [result] = await this.thread.execute(
                `SELECT 
                    u.user_id, 
                    u.username, 
                    p.content,
                    p.post_id,
                    p.parent_repost_id,
                    u.profile_image,
                    COALESCE(l.like_count, 0) AS like_count,
                    COALESCE(r.replies_count, 0) AS replies_count,
                    (SELECT COUNT(*) FROM posts WHERE parent_repost_id = p.post_id) AS repost_count
                FROM posts p 
                JOIN users u ON p.user_id = u.user_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS like_count 
                     FROM likes 
                     GROUP BY post_id) l 
                ON p.post_id = l.post_id
                LEFT JOIN 
                    (SELECT post_id, COUNT(*) AS replies_count 
                     FROM replies 
                     GROUP BY post_id) r 
                ON p.post_id = r.post_id
                WHERE u.user_id = ?
                ORDER BY p.created_at DESC;`,
                [user_id]
            );
            return result;
        } catch (err) {
            console.error('<error> threadsPost.getAccountPost', err);
            throw err;
        }
    }
    

    async getPostById(post_id) {
        try {
            const [rows] = await this.thread.execute(
                "SELECT * FROM posts WHERE post_id = ?", 
                [post_id]
            );
            return rows.length > 0 ? rows[0] : null; 
        } catch (err) {
            console.error('<error> ThreadPost.getPostById:', err);
            throw err; 
        }
    }

    async getTopHashtags(limit) {
        try {
            const [result] = await this.thread.execute(
                `SELECT 
                    h.hashtag_text, 
                    COUNT(ph.hashtag_id) AS usage_count
                 FROM 
                    post_hashtag ph
                 JOIN 
                    hashtag h ON ph.hashtag_id = h.hashtag_id
                 GROUP BY 
                    h.hashtag_id, h.hashtag_text
                 ORDER BY 
                    usage_count DESC
                 LIMIT ?`,
                [limit]
            );

            return result;
        } catch (err) {
            console.error('<error> threadsPost.getTopHashtags:', err);
            throw new Error('Failed to retrieve top hashtags for recommendations. Please try again.');
        }
    }
    
    
}

export default threadsPost;
