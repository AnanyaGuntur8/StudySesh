const postModel = require("../models/postModel")

//creating the post
const createPostController = async (req, res)=> {
    try{
        const {title, description, update} = req.body
        //validate 
        if(!title || !description || !update){
            return res.status(500).send({
                message: "Please fill all the fields"
            })
        }
        const post = await postModel({
            title, 
            description,
            update,
            postedBy: req.auth._id

        }).save()
        res.status(201).send({
            success:true, 
            message: "Post created successfully",
            post,
        }); 
        // console.log(req)
    }catch (error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error creating post API",
            error
        })
    }
}
// get all the posts
const getAllPostsController = async (req, res) =>{
    try{
        const posts = await postModel.find()
        .populate("postedBy", "_id username")
        .sort({createdAt: -1})
        res.status(200).send({
            success: true,
            message: "All posts fetched successfully",
            posts,
            })
    }catch(error){
        console.log(error)
        res.status(500).send(
            {
                success: false,
                message: "Error GETALLPOSTS API",
                error
            }
        )
    }
}
module.exports = {createPostController, getAllPostsController}