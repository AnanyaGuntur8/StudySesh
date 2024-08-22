const postModel = require("../models/postModel")
const userModel = require("../models/userModel")

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
        deletedPost,  
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
  //updating my post
const updatePostController = async (req, res) => {
    const { id } = req.params;
    const { title, description, update, link, color } = req.body;

    try {
        // Validate required fields
        if (!title || !description || !update) {
            return res.status(400).json({ 
                success: false, 
                message: "Title, description, and update fields are required." 
            });
        }

        console.log('Updating post with ID:', id);

        // Check if post exists
        const existingPost = await postModel.findById(id);
        if (!existingPost) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found." 
            });
        }

        // Update the post
        const updatedPost = await postModel.findByIdAndUpdate(
            id,
            {
                title,
                description,
                update,
                link: link || '',
                color: color || '',
            },
            { new: true }
        ).populate({
            path: 'postedBy',
            select: '_id username' // Populate the postedBy field with username
        });

        if (!updatedPost) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found during update." 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Post updated successfully", 
            post: updatedPost 
        });
    } catch (error) {
        console.error("Error updating post:", error); 
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error 
        });
    }
};
const joinPostController = async (req, res) => {
    try {
        const postId = req.params.id;
        const username = req.body.username;
        
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        
        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
    
        // Find the user by username
        const user = await userModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if the post is already followed by the user
        if (post.followedBy.includes(username)) {
            return res.status(400).json({ message: 'Already following this post' });
        }
        
        // Check if the user already followed this post
        if (user.followedPosts.includes(postId)) {
            return res.status(400).json({ message: 'User already followed this post' });
        }
        
        // Update the user's followedPosts and the post's followedBy
        user.followedPosts.push(postId);
        post.followedBy.push(username);
        
        await user.save();
        await post.save();
        
        res.status(200).json({ message: 'Followed post successfully' });
    } catch (error) {
        console.error('Error following post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const unfollowPostController = async (req, res) => {
    try {
        const postId = req.params.id;  // Extract postId from URL parameters
        const username = req.body.username;  // Extract username from request body
        
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the user by username
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is following the post
        const isFollowing = post.followedBy.includes(username);
        if (!isFollowing) {
            return res.status(400).json({ message: 'Not following this post' });
        }

        // Unfollow the post
        post.followedBy = post.followedBy.filter(name => name !== username);
        user.followedPosts = user.followedPosts.filter(id => id.toString() !== postId);

        // Save the changes
        await post.save();
        await user.save();

        console.log('Successfully unfollowed post:', { postId, username });

        res.status(200).json({ message: 'Unfollowed post successfully' });
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
const getPostsFollowedByUserController = async (req, res) => {
    try {
        // Use query parameter for testing
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        console.log('Username received:', username);

        // Find posts followed by the user and populate the postedBy field with the user's information
        const posts = await postModel
            .find({ followedBy: username })
            .populate('postedBy', 'username'); // Populate only the username field of the postedBy user

        console.log('Posts found:', posts);

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching followed posts:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {createPostController,
     getAllPostsController, 
     getUserPostsController, 
     deletePostController, 
     updatePostController, 
     joinPostController, 
     unfollowPostController,
     getPostsFollowedByUserController}