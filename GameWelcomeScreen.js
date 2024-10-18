import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

const GameWelcomeScreen = ({ navigation, route }) => {
  const { sleepData } = route.params; // Retrieve sleepData passed from Login.js

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F8" />
      
      <Text style={styles.title}>Welcome to the Sheep Games</Text>
      <Text style={styles.subtitle}>Choose your game below:</Text>

      {/* Herdle Game Description */}
      <View style={styles.itemBox}>
        <View style={styles.iconBox}>
          <Text style={styles.iconPlaceholder}>🐑</Text> 
        </View>
        <Text style={styles.itemText}>
          <Text style={styles.gameTitle}>Herdle:</Text> Guess the 5-letter word! Your number of attempts depends on how many hours of sleep you got last night.
        </Text>
      </View>

      {/* Start Herdle Game Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Herdle', { sleepData })}
      >
        <Text style={styles.startButtonText}>Play Herdle</Text>
      </TouchableOpacity>

      {/* Sheep Dash Game Description */}
      <View style={styles.itemBox}>
        <View style={styles.iconBox}>
          <Text style={styles.iconPlaceholder}>🏃‍♂️🐑</Text> 
        </View>
        <Text style={styles.itemText}>
          <Text style={styles.gameTitle}>Sheep Dash:</Text> Jump over fences and avoid obstacles! The number of revives you have is based on your sleep.
        </Text>
      </View>

      {/* Start Sheep Dash Game Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('SheepJumpGame', { sleepData })}
      >
        <Text style={styles.startButtonText}>Play Sheep Dash</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',  // Light gray background for consistency
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#800080',  // Purple title
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#28353B',  // Darker gray for subtitle
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align icons and text to the top
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  iconBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconPlaceholder: {
    fontSize: 32,
  },
  itemText: {
    fontSize: 18,
    color: '#36454F',
    lineHeight: 24,
    flex: 1,
  },
  gameTitle: {
    fontWeight: 'bold',
    color: '#800080',
  },
  startButton: {
    backgroundColor: '#800080',  // Purple start button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,  // Pill-shaped button for consistency
    marginTop: 10,
    marginBottom: 40,
    elevation: 3, // Add slight elevation for shadow effect
  },
  startButtonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default GameWelcomeScreen;
