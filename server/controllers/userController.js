const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel')
const registerController = async (req, res)=>{
    try{
        const {name, username, email, password} = req.body
        //validation
        if(!name){
            return res.status(400).send({
                sucess: false,
                message:'name is required'
            })
            
        }
        if(!username){
            return res.status(400).send({
                sucess: false,
                message:'username is required'
                });
            }
        if(!email){
            return res.status(400).send({
                sucess: false,
                message:'email is required'
            });
        }
        if(!password || password.length < 10){
            return res.status(400).send({
                sucess: false,
                message:'password is required'
            }); 
        }
        //existing user
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(500).send({
                success: false, 
                message:'User already registered with this email'
            });
        }
        //hashed password:
        const hashedPassword = await hashPassword(password);

        const user = await userModel({name, username, email, password: hashedPassword}).save()
        return res.status(201).send({
            success:true, 
            message: 'Registration Sucessful! Please Log in'
        });
        //save user
       
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in registration API',
            error,
        });

    }
};

//login
const loginController = async (req, res) =>{
    try{
        const { email, password} = req.body
        if (!email || !password){
            return res.status(500).send({
                success: false,
                message: 'Please provide Email or Password'
            })
        }
        //find user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(500).send({
                success: false,
                message: 'User not found'
            })
        }
        //match password
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(500).send({
                success: false,
                message: 'Invalid Username or Password does not match'
                })
            }
            //token JWT
            const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{
                expiresIn:'7d'
            })
            user.password = undefined;
            res.status(200).send({
                success: true,
                message: 'Login Successful',
                token,
                user,
                
            })
    } catch (error){
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in login API',
            error,
        })
    }
}
//updating hte user 
const updateUserController = async (req, res) => {
    try {
        const { name, password, email, username } = req.body;
        
        // Find user by email or username
        const user = await userModel.findOne({
            $or: [{ email: email }, { username: username }]
        });
        // if (!user) {
        //     return res.status(404).send({
        //         success: false,
        //         message: 'User not found'
        //     });
        // }
        //password validation
        if(password && password.length<10){
            return res.status(400).send({
                success:false,
                message: 'Password is required and must be at least 10 characters'
            })
        }
       const hashedPassword = password ? await hashPassword(password): undefined
       //update the user now
       const updatedUser = await userModel.findOneAndUpdate({email},{
        name: name || user.name,
        password: hashedPassword || user.password
       }, {new: true})
       res.status(200).send({
        success: true,
        message: 'Profile Updated', 
        updatedUser
       })
        
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in update API', error

        })
    }
}
module.exports = {registerController, loginController,updateUserController}