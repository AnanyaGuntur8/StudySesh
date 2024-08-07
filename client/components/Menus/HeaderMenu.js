import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import React, { useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HeaderMenu = ({ title }) => {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <View style={styles.titleAndIconsContainer}>
          <Text style={styles.title1}>
            Study<Text style={styles.title2}>Sesh</Text>
          </Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity>
              <Entypo name='notification' style={styles.iconStyle} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name='message-badge' style={styles.anothericon} />
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: '#050315',
  },
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  titleAndIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title1: {
    fontSize: 30,
    color: '#fff',
  },
  title2: {
    fontSize: 30,
    color: '#23CAFF',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    fontSize: 25,
    color: '#23CAFF',
    marginRight: 15,
  },
  anothericon: {
    fontSize: 25,
    color: '#23CAFF',
    marginRight: 15,
  },
  searchBar: {
    marginTop: 30,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#23CAFF',
    paddingHorizontal: 20,
    color: 'white',
  },
});

export default HeaderMenu;
