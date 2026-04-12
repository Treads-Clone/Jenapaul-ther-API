import { connection } from '../core/database.js';

class Follow {
    constructor(){
        this.thread = connection
    }

    async followUser(followerId, followingId){
        try{
            const [result,] = await connection.execute(
                'INSERT INTO followers(follower_user_id,following_user_id) VALUES (?, ?)',
                [followerId,followingId]
            );

            return result;
        } catch (err){
            console.error('<error> followUser', err);
            throw err;
        }
    }

    async unfollowUser(followerId,followingId){
        try{
            const [result,] = await connection.execute(
                'DELETE FROM followers WHERE follower_user_id = ? AND following_user_id = ?',
                [followerId, followingId]
            );

            return result;
        } catch (err){
            console.error('<error> unfollowUser', err);
            throw err;
        }
    }

    async getFollowers(userId){
        try{
            const [result,] = await connection.execute(
                `SELECT 
                u.user_id, 
                u.username,
                u.fullname, 
                u.profile_image,
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM followers
                        WHERE following_user_id = u.user_id
                        AND follower_user_id = ?
                    ) THEN 1
                    ELSE 0
                END AS is_following 
                FROM followers f 
                JOIN users u ON f.follower_user_id = u.user_id 
                WHERE f.following_user_id = ?`,
                [userId,userId]
            );

            return result;
        } catch (err){
            console.error('<error> getFollowers', err)
            throw err;
        }
    }

    async getFollowing(userId){
        try{
            const [result,] = await connection.execute(
                `SELECT 
                u.user_id, 
                u.username,
                u.fullname, 
                u.profile_image,
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM followers
                        WHERE follower_user_id = u.user_id
                        AND following_user_id = ?
                    ) THEN 1
                    ELSE 0
                END AS is_followed_back
                FROM followers f 
                JOIN users u 
                ON f.following_user_id = u.user_id 
                WHERE f.follower_user_id = ?`,
                [userId, userId]
            );

            return result;
        } catch (err){
            console.error('<error> getFollowing', err);
            throw err;
        }
    }

    async getFollowSuggestion(userId){
        try{
            const [result,] = await connection.execute(
                `SELECT u.user_id, u.username, u.fullname, u.profile_image, COUNT(f.following_user_id) AS followers_count 
                FROM users u
                 LEFT JOIN followers f ON f.following_user_id = u.user_id
                WHERE u.user_id != ? AND u.user_id NOT IN (
                SELECT following_user_id FROM followers WHERE follower_user_id = ?)
                GROUP BY u.user_id 
                ORDER BY RAND() 
                LIMIT 15;`,
                [userId, userId]
            )
            return result;
        } catch (err){
            console.error('<error>', err)
            throw err 
        }
    }

    async getFollowersNotFollowingBack(userId){
        try{
            const [result,] = await connection.execute(
                `SELECT 
                u.username, 
                u.user_id,
                u.fullname, 
                u.profile_image,
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM followers
                        WHERE following_user_id = u.user_id
                        AND follower_user_id = ?
                    ) THEN 1
                    ELSE 0
                END AS is_following 
                FROM followers f 
                JOIN users u ON f.follower_user_id = u.user_id
                WHERE f.following_user_id = ?
                AND u.user_id NOT IN (
                    SELECT following_user_id
                    FROM followers
                    WHERE follower_user_id = ?
                )
                `,[userId,userId,userId]
            );
            return result;
        } catch (err){
            console.error('<error> getFollowersNotFollowingBack', err)
            throw err;
        }
    }
}

export default Follow;