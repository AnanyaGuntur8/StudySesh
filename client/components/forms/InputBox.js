import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const InputBox = ({ 
        inputTitle, 
        keyboardType, 
        autoComplete, 
        autoCapitalize = false,
        secureTextEntry=false, 
        value,
        setValue
    }) => {
    
  return (
    <View>
        <Text style={styles.inputTitle}>{inputTitle}</Text>
        <TextInput style={styles.inputBox}
        placeholder={inputTitle}
        placeholderTextColor="#888"
        autoCorrect={false}
        keyboardType={keyboardType}
        autoComplete = {autoComplete}
        secureTextEntry = {secureTextEntry}
        value = {value}
        onChangeText={(text) => setValue(text)}
        autoCapitalize={autoCapitalize}
        />
    </View>
  );
};
const styles = StyleSheet.create({
    inputTitle: {
        color: '#0F141F', // Change this to the desired color
        marginBottom: 5,
    },
    inputBox:{
        height:40,
        marginBottom: 20,
        backgroundColor: '#0F141F',
        borderRadius:15,
        borderColor:'#23CAFF',
        borderWidth: 2,
        color: '#23CAFF',
        paddingLeft:10,

    }
});

export default InputBox