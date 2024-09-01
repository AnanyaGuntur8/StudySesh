const postModel = require("../models/postModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose');

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
// const updateUserPostController = async (req, res) => {
//     try {
//         const { oldUsername, newUsername } = req.body;
        
//         // Update the username in posts
//         const result = await postModel.updateMany(
//             { 'postedBy.username': oldUsername },
//             { $set: { 'postedBy.username': newUsername } }
//         );

//         // Optionally, update the username in the User model if needed
//         await userModel.updateOne({ username: oldUsername }, { $set: { username: newUsername } });

//         res.json({
//             success: true,
//             result
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
const joinPostController = async (req, res) => {
    try {
        const postId = req.params.id; // Extract postId from URL parameters
        const username = req.params.username; // Extract username from URL parameters

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        // Ensure the function is async and use await for promises
        const [post, user] = await Promise.all([
            postModel.findById(postId),
            userModel.findOne({ username })
        ]);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize followedBy and followedPosts arrays if they are undefined
        post.followedBy = post.followedBy || [];
        user.followedPosts = user.followedPosts || [];

        // Convert ObjectIds to strings for comparison
        const userIdStr = user._id.toString();
        const postIdStr = post._id.toString();

        if (post.followedBy.map(id => id.toString()).includes(userIdStr)) {
            return res.status(400).json({ message: 'Already following this post' });
        }

        // if (user.followedPosts.map(id => id.toString()).includes(postIdStr)) {
        //     return res.status(400).json({ message: 'User already followed this post' });
        // }

        post.followedBy.push(user._id);
        user.followedPosts.push(post._id);

        await Promise.all([
            post.save(),
            user.save()
        ]);

        res.status(200).json({ message: 'Successfully followed the post' });
    } catch (error) {
        console.error('Error following post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const unfollowPostController = async (req, res) => {
    try {
        const { id: postId, username } = req.params;  // Extract post ID and username from URL parameters

        // Validate the post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
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

        // Initialize followedBy and followedPosts arrays if they are undefined
        post.followedBy = post.followedBy || [];
        user.followedPosts = user.followedPosts || [];

        // Check if the user is following the post
        const isFollowing = post.followedBy.includes(user._id.toString());
        // if (!isFollowing) {
        //     return res.status(400).json({ message: 'User is not following this post' });
        // }

        // Unfollow the post
        post.followedBy = post.followedBy.filter(id => id.toString() !== user._id.toString());
        user.followedPosts = user.followedPosts.filter(id => id.toString() !== postId);

        await Promise.all([post.save(), user.save()]);  // Save changes concurrently

        return res.status(200).json({ message: 'Unfollowed post successfully' });
    } catch (error) {
        console.error('Error processing unfollow request:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getPostsFollowedByUserController = async (req, res) => {
    try {
        // Use query parameter for testing or retrieve from authenticated context
        const userId = req.query.userId || req.auth._id;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        console.log('User ID received:', userId);

        // Find the user by userId
        const user = await userModel.findById(userId).select('followedPosts');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user has no followed posts
        if (user.followedPosts.length === 0) {
            return res.status(200).json({ message: 'No posts followed by this user' });
        }

        // Find the posts followed by the user and populate the postedBy field with the user's information
        const posts = await postModel
            .find({ _id: { $in: user.followedPosts } })
            .populate('postedBy', 'username'); // Populate only the username field of the postedBy user

        console.log('Posts found:', posts);
        res.setHeader('Cache-Control', 'no-store');

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
     
 joinPostController
    , 
     unfollowPostController,
     getPostsFollowedByUserController}