import { View, Text } from 'react-native'
import React,{useContext} from 'react'
import Home from '../../screens/Home'
import Welcome from '../../screens/auth/Welcome'
import Register from '../../screens/auth/Register'
import Login from '../../screens/auth/Login'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from '../../context/authContext'
import HeaderMenu from './HeaderMenu'
import Sesh from '../../screens/Sesh'
import Profile from '../../screens/Profile'
import HeaderMenu2 from './HeaderMenu2'

const ScreenMenu = () => {

    //global state
    const [state] = useContext(AuthContext)
    //auth condition true and false 
    const authenticatedUser = state?.user && state?.token
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator initialRouteName='Welcome'>
            {authenticatedUser ? 
            (<>
            <Stack.Screen 
            name="Home" 
            component={Home}
            options={{
                header: () => <HeaderMenu/>
                
            }}/>
            <Stack.Screen 
            name="Sesh" 
            component={Sesh}
            options={{
                headerBackTitle:"Back",
                header: () => <HeaderMenu2 title="Sesh"/>
                
            }}/>
            <Stack.Screen 
            name="Profile" 
            component={Profile}
            options={{
                header: () => <HeaderMenu2 title="Profile"/>
                
            }}/>

            </>) : 
            (   <>
            <Stack.Screen 
            name="Welcome" 
            component={Welcome}
            options={{headerShown: false}}/>
            <Stack.Screen 
            name="Register" 
            component={Register}
            options={{headerShown: false}}/>
            <Stack.Screen 
            name="Login" 
            component={Login}
            options={{headerShown:false}}/>
                </>
            ) }
        
          
        </Stack.Navigator>
    )
}

export default ScreenMenu