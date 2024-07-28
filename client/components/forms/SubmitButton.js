import { View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import React from 'react'

const SubmitButton = ({handleSubmit, btnTitle, loading}) => {
  return (
    <View>
      <TouchableOpacity style = {styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.btnText}>
            {loading ? 'Please wait...' : btnTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    submitBtn: {
        backgroundColor: "#23CAFF",
        height: 40,
        marginHorizontal: 100,
        borderRadius: 15,
        justifyContent: "center",
        marginBottom: 10,
        paddingHorizontal: 10,
      },
    btnText:{
        color:'white',
        textAlign:'center',
        fontSize: 15,
        fontWeight: 'bold',
    }
})

export default SubmitButton