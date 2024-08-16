const postModel = require("../models/postModel")

//creating the post
const createPostController = async (req, res) => {
    try {
        const { title, description, update, color, link } = req.body;

        // Validate fields
        if (!title || !description || !update) {
            return res.status(400).send({
                success: false,
                message: "Please fill all the fields"
            });
        }

        // Create and save the post
        const post = await postModel.create({
            title,
            description,
            update,
            color,  //add the color field so that the color updates
            link,
            postedBy: req.auth._id
        });
//success statement
        res.status(201).send({
            success: true,
            message: "Post created successfully",
            post,
        });
        //error statement
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error creating post API",
            error
        });
    }
};
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

const getUserPostsController = async (req, res) => {
    try {
        const userPosts = await postModel.find({ postedBy: req.auth._id })
            .populate({
                path: 'postedBy',
                select: '_id username' //enforcing the username aspect, issue shown when adding posts. 
            });

        res.status(200).send({
            success: true,
            message: "User posts fetched successfully",
            userPosts,
        });
    } catch (error) {
        console.error('Error in getUserPostsController:', error);
        res.status(500).send({
            success: false,
            message: "Error GETUSERPOSTS API",
            error
        });
    }
}

//DELETING THE USER'S POSTS
const deletePostController = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the post by its ID
      const deletedPost = await postModel.findByIdAndDelete(id);
  
      if (!deletedPost) {
        return res.status(404).send({
          success: false,
          message: "Post not found",
        }); //seeign if the post is not found send an error
      }
  
      res.status(200).send({
        success: true,
        message: "Post deleted successfully",
        deletedPost,  // Optionally return the deleted post data
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).send({
        success: false,
        message: "Error deleting post",
        error,
      });
    }
  };


module.exports = {createPostController, getAllPostsController, getUserPostsController, deletePostController}