import React, {createContext,useState, useEffect} from 'react';
import axios from  'axios'
//context
const PostContext = createContext()//empty context

//making the post provider
const PostProvider = ({children}) => {
const[loading, setLoading] = useState(false)
const[posts, setPosts] = useState([]) //initial post is an arrya of post
//getting all the posts
const getAllPosts =  async ()=>{
    try{
        const {data} = await axios.get('/post/get-all-posts')
        setLoading(false)
        setPosts(data?.posts)

    }
    catch(error){
        console.log(error),
        setLoading(false)
    }
};
//initial posts
useEffect(()=>{
    getAllPosts()
},[])
return(
    <PostContext.Provider value={[posts, setPosts]}>
        {children}
    </PostContext.Provider>
)
}
//global state

//exporting the module
export {PostContext,PostProvider}