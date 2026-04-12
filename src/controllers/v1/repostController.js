import threadRepost from '../../models/repost.js';

class ThreadRepostController {
    constructor() {
        this.reposts = new threadRepost();
    }

    async repost(req, res) {
        try {
            const user_id = res.locals.user_id;
            const { post_id } = req.params;
    
            const content = await this.reposts.getOriginalPostContent(post_id);
    
            if (!content) {
                return res.status(404).send({
                    success: false,
                    message: `Original post with post_id ${post_id} does not exist.`,
                });
            }
    
            const repostId = await this.reposts.createRepost(user_id, post_id, content);
    
            if (repostId) {
                return res.status(200).send({
                    success: true,
                    data: {
                        user_id,
                        post_id,
                        content,
                        parent_repost_id: repostId,
                        created_at: new Date().toISOString(),
                    },
                });
            } else {
                return res.status(500).send({
                    success: false,
                    message: 'Failed to repost.',
                });
            }
        } catch (error) {
            res.send({
                success: false,
                message: error.toString()
            });
        }
    }
    
    
    async unrepost(req, res) {
        try {
            const user_id = res.locals.user_id;
            const { post_id } = req.params;
    
            
            if (typeof user_id === 'undefined' || typeof post_id === 'undefined') {
                return res.status(400).send({
                    success: false,
                    message: 'User  ID or Post ID is missing.',
                });
            }
    
           
            const reposts = await this.reposts.getRepostsByParentId(post_id, user_id);
            
            if (!reposts || reposts.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: 'Repost not found.',
                });
            }
    
            
            const repost = reposts[0]; 
            if (repost.user_id !== user_id) {
                console.log('Current User ID:', user_id);
                console.log('Repost User ID:', repost.user_id);
                return res.status(403).send({
                    success: false,
                    message: 'You do not have permission to delete this repost.',
                });
            }
    
           
            const result = await this.reposts.deleteRepost(repost.post_id, user_id);
    
            if (result.success) {
                return res.send({
                    success: true,
                    message: 'Repost deleted successfully.',
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Failed to delete repost.',
                });
            }
        } catch (error) {
            console.error('<error> unrepost controller:', error);
            res.send({
                success: false,
                message: error.toString()
            
            });
        }
    }
    
    
    


    async getReposts(req, res) {
        try {
            const userId = res.locals.user_id
            const result = await this.reposts.getAllUserReposts(userId);

            res.send({
                success: true,
                data: {
                    result: result,
                }
            });
        } catch (error) {
            res.send({
                success: false,
                message: error.toString()
            });
        }
    }

    async getUsernameWhoRepost(req, res) {
        try {
            const userId = res.locals.user_id; 
            const result = await this.reposts.getUsernameWhoRepost(userId);
    
       
            res.status(200).send({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('Error in getUsernameWhoRepost:', error.message);
    
            res.status(500).send({
                success: false,
                message: 'Failed to retrieve usernames for reposts. Please try again.',
            });
        }
    }
    



}

export default ThreadRepostController;