import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PostCard = ({ route }) => {
  const { data } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <Text style={styles.update}>{data.update}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00CFFF',
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
  update: {
    fontSize: 16,
    color: '#000',
    marginTop: 20,
  },
});

export default PostCard;