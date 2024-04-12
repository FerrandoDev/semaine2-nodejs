import express from "express";
import {upload} from "../server/controllers/multerController.js";
import * as blogsController from "../server/controllers/blogController.js"

const router = express.Router();

router.get('/', blogsController.getLastThreePosts)
router.get('/admin', blogsController.getAllPost)
router.get('/view/:id', blogsController.getPost)
router.get('/add' , blogsController.createPostPage)
router.post('/add' ,upload.single('picture') ,blogsController.createPost)
router.post('/add/cat' ,blogsController.createCat)
router.get('/delete/:id' , blogsController.deletePost)
router.get('/edit/:id' , blogsController.getPost)
router.post('/edit/:id' ,upload.single('picture') ,  blogsController.updatePost)

export default router;
/*



 */