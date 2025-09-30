import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatCardProps = {
  title: string;
  text: string;
};

const RoundedTextBox = ({title, text}: StatCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.roundedRectangle}>
        
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.text}>{text}</Text>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  roundedRectangle: {
    // Use RGBA (or 8-digit hex) to make only the background translucent
    backgroundColor: 'rgba(128,128,128,0.2)', // grey @ 20% alpha
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15, // Adjust this value for more or less rounded corners
    width : 200,
    marginBottom : 30,
  },
  titleText : {
    color: 'purple', // Text color
    fontSize: 30,
    fontWeight: 'bold',
    
  },
  text: {
    color: '#FFFFFF', // Text color
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf : 'center',
    verticalAlign : 'middle'
  },
});

export default RoundedTextBox;
