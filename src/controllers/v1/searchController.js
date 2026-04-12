import Search from "../../models/search.js";
import User from '../../models/user.js';

class SearchController {
    constructor() {
        this.search = new Search();
    }

    async searchAll(req, res){
        try{
            const { query } = req.query;

            const userId = res.locals.user_id

            console.log(userId)

            let postsResult = [];
            let usersResult = [];

            const hastagRegex = /^#(\w+)/

            if(hastagRegex.test(query)){
                const searchTerm = query.match(hastagRegex)[1];
                postsResult = await this.search.searchPostsWithHashtags(searchTerm);

            } else {
                usersResult = await this.search.searchUsers(query, userId);
                postsResult = await this.search.searchPosts(query);
            }

            res.send({
                success: true,
                data: {
                    users: usersResult,
                    posts: postsResult,
                }
            })
        } catch (err) {
            res.send({
                success: false,
                message: err.toString(),
            })
        }
    }
}

export default SearchController;