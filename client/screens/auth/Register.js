import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import InputBox from '../../components/forms/InputBox';
import SubmitButton from '../../components/forms/SubmitButton';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({ navigation }) => {
  const [state, setState] = useContext(AuthContext);

  // States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Function
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password) {
        Alert.alert('Please Fill All Fields');
        setLoading(false);
        return;
      }

      const { data } = await axios.post('/auth/register', { name, email, password });
      setState(data);
      await AsyncStorage.setItem('@auth', JSON.stringify(data));
      Alert.alert(data && data.message);
      navigation.navigate('Login');
      console.log('Register Data =>', { name, email, password });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'An error occurred');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>@Register</Text>
        <View style={{ marginHorizontal: 20 }}>
          <InputBox
            inputTitle={'Name'}
            value={name}
            setValue={setName}
            autoCapitalize={true}
          />
          <InputBox
            inputTitle={'Email'}
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            setValue={setEmail}
          />
          <InputBox
            inputTitle={'Password'}
            secureTextEntry={true}
            autoComplete="password"
            value={password}
            setValue={setPassword}
          />
        </View>
        <SubmitButton
          btnTitle="Sign Up"
          loading={loading}
          handleSubmit={handleSubmit}
        />
        <Text style={styles.linkText}>
          Already Have An Account?
          <Text
            style={styles.linkText2}
            onPress={() => navigation.navigate('Login')}
          >
            {' '}
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '050315',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: '050315',
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#23CAFF',
  },
  inputBox: {
    height: 40,
    marginBottom: 20,
    backgroundColor: '050315',
    borderRadius: 15,
    borderColor: '#23CAFF',
    borderWidth: 2,
    color: '#23CAFF',
    paddingLeft: 10,
  },
  linkText: {
    fontSize: 15,
    color: '#23CAFF',
    textAlign: 'center',
  },
  linkText2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#23CAFF',
    textAlign: 'center',
  },
});

export default Register;