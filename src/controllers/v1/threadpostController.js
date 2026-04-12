import threadsPost from '../../models/threadpost.js';

class ThreadPostController {
    constructor() {
        this.post = new threadsPost();
    }

    async createThread(req, res) {
        try {
            const user_id = res.locals.user_id;
            const { content } = req.body;
    
            const result = await this.post.createPost(user_id, content);
    
            if (result && result.affectedRows > 0) {
                const post_id = result.insertId; 
    
                const hashtags = content.match(/#\w+/g); 
                console.log("Extracted Hashtags:", hashtags);
    
                if (hashtags) {
                    for (let hashtag of hashtags) {
                        const cleanHashtag = hashtag.trim(); 
    
                        const hashtagId = await this.post.insertHashtag(cleanHashtag);
    
                        await this.post.linkHashtagToPost(post_id, hashtagId);
                    }
                }
    
                res.send({
                    success: true,
                    data: {
                        user_id: user_id,
                        username: res.locals.username,
                        content: content,
                        created_at: new Date().toISOString(),
                        hashtags: hashtags || [],
                    }
                });
            } else {
                res.send({
                    success: false,
                    message: 'Failed to create post',
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error.toString(),
            });
        }
    }
    

    async updateThread(req, res) {
        try {
            const user_id = res.locals.user_id;
            const { post_id } = req.params;
            const { content } = req.body;

            const result = await this.post.updatePost(user_id, post_id, content);
    
            if (result && result.affectedRows > 0) {

                const hashtags = content.match(/#\w+/g);
                console.log("Extracted Hashtags:", hashtags);
    
                if (hashtags && hashtags.length > 0) {
                    for (let hashtag of hashtags) {
                        const cleanHashtag = hashtag.trim();

                        const hashtagId = await this.post.insertHashtag(cleanHashtag);
    
                        await this.post.linkHashtagToPost(post_id, hashtagId);
                    }
                }

                res.send({
                    success: true,
                    message: "Post edited successfully.",
                    post_id: post_id,
                    hashtags: hashtags || [] 
                });
            } else {

                res.status(404).send({
                    success: false,
                    message: 'Failed to edit post. The post may not exist or you do not have permission to edit it.',
                });
            }
        } catch (error) {

            console.error('<error> updateThread:', error);
    
            res.status(500).send({
                success: false,
                message: `Error while editing post: ${error.message}`,
            });
        }
    }


    async deleteThread(req, res) { 
        try {
            const user_id = res.locals.user_id;
            const { post_id } = req.params; 
            

            const result = await this.post.deletePost(user_id, post_id);

            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: "Deleted Post successfully."
                });
            } else {
                res.send({
                    success: false,
                    message: 'Failed to Delete Post: No such post found or not authorized.'
                });
            }
        } catch (error) {
            console.error('<error> deleteThread', error);
            res.send({
                success: false,
                message: error.toString()
            });
        }
    }
    
    async getTopUseHashtags(req, res){
        try{
            const limit = 5;
            const result = await this.post.getTopHashtags(limit);
            console.log(result)
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

    async getAllThreads(req, res){
        try {

            const result = await this.post.getPost();

            res.send({
                success: true,
                data: {
                    result,
                }
            });
        } catch (err){
            res.send({
                success: true,
                message: err.toString()
            });
        }
    }
    
    

}

export default ThreadPostController;
