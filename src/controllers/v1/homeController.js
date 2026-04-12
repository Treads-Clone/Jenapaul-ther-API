import threadsPost from '../../models/threadpost.js';

class HomeController{
    constructor(){
        this.threads = new threadsPost();
        this.__controllerName = 'Home';
    }

    async getAllThreads(req, res){
        try {

            const result = await this.threads.getPost();

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

export default HomeController