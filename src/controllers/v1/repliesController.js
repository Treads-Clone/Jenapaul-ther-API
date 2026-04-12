import Replies from "../../models/replies.js";


class RepliesController {
    constructor() {
        this.replies = new Replies(); 
    }

    async createReplies(req, res) {
        try {
            const user_id = res.locals.user_id;
            const { post_id } = req.params;
            const { comment_text, parent_reply_id } = req.body || {};
            const postIdInt = Number(post_id);

            console.log(req.params); 

            console.log(`Attempting to add reply to post_id: ${post_id}`);

            

            const result = await this.replies.createReplies(post_id, user_id, comment_text, parent_reply_id);
            

            if (result.affectedRows > 0) {
                res.status(201).send({
                    success: true,
                    data: {
                        user_id,
                        post_id:  postIdInt,
                        replies_id: result.replies_id, 
                        comment_text,
                        created_at: new Date().toISOString(),
                        parent_reply_id: parent_reply_id || null}
                });
            } else {
                res.send({
                    success: false,
                    message: "Failed to reply.",
                });
            }
        } catch (error) {
            res.send({
                success: false,
                message: error.toString(),
            });
        }
    }

    

    async updateReplies(req, res) {
        try {
            const user_id = res.locals.user_id;
            const { reply_id } = req.params;  
            const { post_id } = req.params;
            const { comment_text } = req.body; 

            const result = await this.replies.updateReplies(reply_id, user_id , post_id, comment_text);

            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: "Reply edit successfully.",
                });
            } else {
                res.send({
                    success: false,
                    message: "Failed to edit reply.",
                });
            }
        } catch (error) {
            res.send({
                success: false,
                message: error.toString(),
            });
        }
     
    }
 
    async deleteReplies(req, res) {
        try {
            const user_id = res.locals.user_id; 
            const { reply_id, post_id } = req.params;



            const result = await this.replies.deleteReplies(reply_id, post_id, user_id);

            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: "Deleted reply successfully.",
                });
            } else {
                res.send({
                    success: false,
                    message: "Failed to delete reply.",
                });
            }
        } catch (error) {
            res.send({
                success: false,
                message: error.toString(),
            });
        }

    }

   
    async getAllReplies(req, res) {
        try {
            const { post_id } = req.params; 

            const result = await this.replies.getReplies(post_id);

            res.send({
                success: true,
                data: { result,
                }
            });
        } catch (error) {
            res.send({
                success: false,
                message: error.toString(),
            });
        }
    }
}

export default RepliesController;
