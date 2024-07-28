import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert } from 'react-native'
import React, {useState,useContext} from 'react'
import InputBox from '../../components/forms/InputBox';
import SubmitButton from '../../components/forms/SubmitButton';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/authContext';


const Login = ({navigation}) => {
//global state
const [state,setState] = useContext(AuthContext)


    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    //function
    //btn function
    const handleSubmit = async () =>{
      try{
          setLoading(true)
          if(!email || !password){
              Alert.alert('Please Fill All Fields');
              setLoading(false);
              return;
          }
          setLoading(false)
          const {data} = await axios.post('/auth/login' ,{ email, password} );
          setState(data)
          await AsyncStorage.setItem('@auth', JSON.stringify(data));
          alert(data && data.message);
          navigation.navigate('Home');
        console.log('Login Data =>', {email, password})
          //catching the error afterwards
      } catch(error){
          alert(error.response.data.message);
          setLoading(false)
          console.log(error);
      }
    }
    
    return (
      <SafeAreaView style={styles.safeArea}>
          <View style = {styles.container}>
          <Text style = {styles.pageTitle}>@Login</Text>
          <View style = {{ marginHorizontal: 20 }}>
              <InputBox 
                  inputTitle ={'Email'}
                  keyboardType="email-address"
                  autoComplete="email"
                  value = {email} setValue = {setEmail}
                  />
              <InputBox 
                  inputTitle ={'Password'}
                  secureTextEntry={true}
                  autoComplete = "password"
                  value = {password} setValue = {setPassword}
                  />
                 
  
              {/* <Text>confirm password</Text>
              <TextInput 
                  style={styles.inputBox}
                  placeholder="Confirm password" 
                  placeholderTextColor="#888"/> */}
  
              </View>
              {/* <Text>{JSON.stringify({name, email, password}, null, 4)}</Text> */}
              <SubmitButton 
              btnTitle="Log in"
              loading = {loading}
              handleSubmit={handleSubmit}
              />
              <Text style = {styles.linkText}> Don't Have An Account? 
                <Text 
                    style={styles.linkText2}
                    onPress={() => navigation.navigate("Register")}> Sign Up</Text>{" "}
              <Text/>
              </Text>
          </View>
       </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#050315',
    },
    container:{
        flex:1,
        justifyContent:'center',
        marginHorizontal: 20,
        backgroundColor: '#030918',
        
    },
    pageTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign:'left',
        color: '#23CAFF',
    },
    inputBox:{
        height:40,
        marginBottom: 20,
        backgroundColor: '#050315',
        borderRadius:15,
        borderColor:'#23CAFF',
        borderWidth: 2,
        color: '#23CAFF',
        paddingLeft:10,

    },
    linkText: {
        fontSize: 15,
        color: '#23CAFF',
        textAlign:'center'
    },
    linkText2: {
        fontSize: 15,
        fontWeight:'bold',
        color: '#23CAFF',
        textAlign:'center'
    }
});

export default Login;