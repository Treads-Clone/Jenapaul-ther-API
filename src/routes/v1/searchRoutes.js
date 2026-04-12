import { Router } from 'express';
import SearchController from '../../controllers/v1/searchController.js';
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js'

const searchRouter = new Router();
const search = new SearchController();

searchRouter.use(authorization);

searchRouter.get('/',authentication, search.searchAll.bind(search));

export default searchRouter;