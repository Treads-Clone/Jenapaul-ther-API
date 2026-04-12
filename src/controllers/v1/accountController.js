import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import threadsPost from '../../models/threadpost.js';
import Replies from '../../models/replies.js';
import cloudinary from '../../core/cloudinaryConfig.js';
import getAllUserReposts from '../../models/repost.js';


class AccountController{
    constructor() {
        this.replies = new Replies();
        this.threads = new threadsPost();
        this.user = new User();
        this.reposts = new getAllUserReposts();
    }

    async create(req, res) {
        const { username, email, password, fullname } = req.body || {};
    
        try {
            const response = await this.user.create(username, email, password, fullname, null, null);
    
            res.send({
                success: true,
                data: {
                    recordIndex: response?.insertId,
                },
            });
        } catch (err) {
            
            res.send({
                success: false,
                message: err.message === 'username' || err.message === 'email' ? err.message : 'Failed to create account',
            });
        }
    }

    async uploadProfileImg(req,res){
        try{
            const currentUsername = res.locals.username; 
            const profile_img = req.file
            let profileImgUrl = '';

            if (profile_img){
                profileImgUrl = profile_img.path;
            }

            const response = await this.user.updateUser(currentUsername, null, null, null, null, profileImgUrl);
            if (response.affectedRows > 0){
                const updatedUser = await this.user.getUser(currentUsername);
                
                if (!updatedUser){
                    return res.send({
                        success: false,
                        message: 'User not found after update'
                    });
                }

                res.send({
                    success: true,
                    message: 'Upload successfully'
                })
            }

        } catch (err){
            res.send({
                success: false,
                message: err.message || JSON.stringify(err),
            });
        }
    }

    async login(req, res){
        try{
            const { username, password } = req.body || {}

            const result = await this.user.verify(username,  password);

            console.log(result)

            if(!result?.user_id){
                return res.send({
                    success: false,
                    message: 'Invalid username or password',
                })
            } else {
                res.send({
                    success: true,
                    data: {
                        token: jwt.sign({ 'username': username, 'user_id': result?.user_id }, process.env.API_SECRET_KEY, {
                            expiresIn: '1d',
                        })
                    }
                })
            }
        } catch (err){
            res.send({
                success: false,
                message: err.toString(),
            })
        }
    }

    async profile(req, res){
        try{
            const userInfo = await this.user.getUser(res.locals.username);

            res.send({
                success: true,
                data: {
                    id: res.locals.user_id,
                    username: res.locals.username,
                    bio: userInfo?.bio,
                    email: userInfo?.email,
                    fullname: userInfo?.fullname,
                    profile_img: userInfo?.profile_image,
                    created_at: userInfo?.created_at
                }
            })
        } catch (err){
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }

    async getUsersProfile(req, res){
        try{
            const { userId } = req.params;
            const loginUser = res.locals.user_id;

            if (parseInt(userId, 10) === parseInt(loginUser, 10)){
                return res.send({
                    success: true,
                    redirectToProfile: true,
                })
            }

            const userInfo = await this.user.getSpecificUserAccount(userId,loginUser);

            res.send({
                success: true,
                data: {
                    id: userInfo?.user_id,
                    username: userInfo?.username,
                    bio: userInfo?.bio,
                    email: userInfo?.email,
                    fullname: userInfo?.fullname,
                    is_following: userInfo?.is_following,
                    profile_img: userInfo?.profile_image,
                    created_at: userInfo?.created_at
                }
            })
        } catch (err){
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }

    async updateProfile(req, res){
        try{
            const { username, currentPass, newPassword, confirmPass, bio } = req.body || {};

            const currentUsername = res.locals.username; 
            let confirmPassword = null
            if (newPassword === confirmPass){
                confirmPassword = newPassword
            } else {
                return res.send({
                    success: false,
                    message: "Password not match",
                })
            }
            const result = await this.user.updateUser(currentUsername,username,currentPass,confirmPassword,bio);
            
            if (result.affectedRows > 0) {
                const updatedUser = await this.user.getUser(username || currentUsername);
                
                if (!updatedUser){
                    return res.send({
                        success: false,
                        message: 'User not found after update'
                    });
                }

                /* check if user change username,
                   if true it will give a new jwt token
                   else remain the same
                */
                const newToken = username && username !== currentUsername ? jwt.sign({ 'username': username, 'user_id': res.locals.user_id }, process.env.API_SECRET_KEY,
                     {expiresIn: '1d'}) : null;
                
                res.send({
                    success: true,
                    message: 'Profile Updated!',
                    data: {
                        user_id: res.locals.user_id,
                        data: {
                        token: newToken
                    }
                    }
                })
            } else {
                res.send({
                    success: false,
                    message: 'Profile update failed!'
                })
            }
        } catch (err){
            res.send({
                success: false,
                message: err.toString()
            })
        }
    }

    async deleteUser(req, res){
        try{
            const { password } = req.body || {}

            const currentUsername = res.locals.username;

            const result = await this.user.deleteUser(currentUsername);

            if (result.affectedRows > 0){
                res.send({
                    success: true,
                    message: 'Account Deleted Successfully!',
                });
            } else {
                res.send({
                    success: false,
                    message: 'Failed to delete the user',
                });
            }
        } catch (err){
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }

    async getAccountThreads(req, res) {
        try {
            const user_id = res.locals.user_id;
    
    
            const allPosts = await this.threads.getAccountPost(user_id);
    
    
            const originalPosts = allPosts.filter(post => post.parent_repost_id === null);
    
            res.send({
                success: true,
                data: {
                    result: originalPosts,
                }
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString()
            });
        }
    }

    async getAllUserReposts(req, res) {
        try {
            const user_id = res.locals.user_id;
    
         
            if (!user_id) {
                return res.status(400).json({ success: false, message: 'User ID is required.' });
            }
            
            const reposts = await this.reposts.getAllUserReposts(user_id);
    
            const repostsWithOriginalPosts = reposts.map(repost => ({
                repost: {
                    post_id: repost.parent_repost_id || repost.post_id,
                    content: repost.content,
                    repost_count: repost.repost_count,
                    profile_image: repost.repost_profile_image,
                    username: repost.repost_username,
                    like_count: repost.like_count,
                    replies_count: repost.reply_count
                },
                originalPost: {
                    post_id: repost.post_id,
                    content: repost.content,
                    like_count: repost.like_count,
                    replies_count: repost.reply_count,
                    original_profile_image: repost.original_profile_image,
                    original_username: repost.original_username
                }
            }));
    
            // If reposts are found
            if (repostsWithOriginalPosts.length > 0) {
                return res.status(200).json({ success: true, data: repostsWithOriginalPosts });
            } else {
                return res.status(404).json({ success: false, message: 'No reposts found for this user.' });
            }
        } catch (error) {
            console.error('Error fetching all reposts by user:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
    
    
    async getAllProfileReposts(req, res) {
        try {
            const {userId} = req.params;
    
         
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required.' });
            }
            
            const reposts = await this.reposts.getAllUserReposts(userId);
    
            const repostsWithOriginalPosts = reposts.map(repost => ({
                repost: {
                    post_id: repost.parent_repost_id || repost.post_id,
                    content: repost.content,
                    repost_count: repost.repost_count,
                    profile_image: repost.repost_profile_image,
                    username: repost.repost_username,
                    like_count: repost.like_count,
                    replies_count: repost.reply_count
                },
                originalPost: {
                    post_id: repost.post_id,
                    content: repost.content,
                    like_count: repost.like_count,
                    replies_count: repost.reply_count,
                    original_profile_image: repost.original_profile_image,
                    original_username: repost.original_username
                }
            }));
    
            // If reposts are found
            if (repostsWithOriginalPosts.length > 0) {
                return res.status(200).json({ success: true, data: repostsWithOriginalPosts });
            } else {
                return res.status(404).json({ success: false, message: 'No reposts found for this user.' });
            }
        } catch (error) {
            console.error('Error fetching all reposts by user:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    async requestPasswordReset(req, res) { 
        const { email } = req.body || {};
        try {
            const result = await this.user.requestPasswordReset(email);
            res.status(200).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
        
    }

    async resetPassword(req, res) {
        const { otp, newPassword } = req.body || {};
        try {
            const result = await this.user.resetPassword(otp, newPassword);
            res.status(200).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }



    async getRepliesWithPost(req, res){
        try{
            const userId = res.locals.user_id

            const repliesWithPost = await this.replies.getAccountReplies(userId)

            if (repliesWithPost.lenght === 0){
                return res.send({
                    success: false,
                    message: "You have not replied to any post yet"
                });
            }

            res.send({
                success: true,
                data: repliesWithPost
            })
        } catch (err){
            res.send({
                success: false,
                message: err.toString(),
            })

        }
    }
    
    async getProfileRepliesWithPost(req, res){
        try{
            const {userId} = req.params

            const repliesWithPost = await this.replies.getAccountReplies(userId)

            if (repliesWithPost.lenght === 0){
                return res.send({
                    success: false,
                    message: "You have not replied to any post yet"
                });
            }

            res.send({
                success: true,
                data: repliesWithPost
            })
        } catch (err){
            res.send({
                success: false,
                message: err.toString(),
            })

        }
    }

    async getProfilePost(req, res){
        try {
            const { userId } = req.params;
    
    
            const allPosts = await this.user.getProfileAccountPost(userId);

            console.log(allPosts);
    
    
            const originalPosts = allPosts.filter(post => post.parent_repost_id === null);
            console.log(originalPosts)
            res.send({
                success: true,
                data: {
                    result: originalPosts,
                }
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString()
            });
        }
    }
    

}



export default AccountController;