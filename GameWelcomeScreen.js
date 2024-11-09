import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

/**
 * GameWelcomeScreen component - Main game selection interface
 * Displays available games and their descriptions
 * Passes sleep data to selected games
 * 
 * @param {Object} navigation - Navigation object for screen transitions
 * @param {Object} route - Contains navigation parameters including sleepData
 */
const GameWelcomeScreen = ({ navigation, route }) => {
  // Retrieve sleepData passed from Login.js
  const { sleepData } = route.params;

  /**
   * Renders the main game selection interface including:
   * - Welcome header
   * - Game selection subtitle
   * - Herdle game description and start button
   * - Sheep Dash game description and start button
   * 
   * Each game section includes:
   * - Game icon
   * - Game title
   * - Description of gameplay and sleep-based features
   * - Start button that navigates to the game
   */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F8" />
      
      {/* Header Section */}
      <Text style={styles.title}>Welcome to the Sheep Games</Text>
      <Text style={styles.subtitle}>Choose your game below:</Text>

      {/* Herdle Game Section */}
      <View style={styles.itemBox}>
        <View style={styles.iconBox}>
          <Text style={styles.iconPlaceholder}>🐑</Text> 
        </View>
        <Text style={styles.itemText}>
          <Text style={styles.gameTitle}>Herdle:</Text> Guess the 5-letter word! Your number of attempts depends on how many hours of sleep you got last night.
        </Text>
      </View>

      {/* Herdle Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Herdle', { sleepData })}
      >
        <Text style={styles.startButtonText}>Play Herdle</Text>
      </TouchableOpacity>

      {/* Sheep Dash Game Section */}
      <View style={styles.itemBox}>
        <View style={styles.iconBox}>
          <Text style={styles.iconPlaceholder}>🏃‍♂️🐑</Text> 
        </View>
        <Text style={styles.itemText}>
          <Text style={styles.gameTitle}>Sheep Dash:</Text> Jump over fences and avoid obstacles! The number of revives you have is based on your sleep.
        </Text>
      </View>

      {/* Sheep Dash Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('SheepJumpGame', { sleepData })}
      >
        <Text style={styles.startButtonText}>Play Sheep Dash</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Styles for GameWelcomeScreen component
 * 
 * Layout:
 * - Container uses flex layout with light gray background
 * - Elements are centered with consistent padding
 * 
 * Typography:
 * - Title: Large purple text (38px)
 * - Subtitle: Medium gray text (20px)
 * - Game descriptions: Regular dark gray text (18px)
 * 
 * Interactive Elements:
 * - Start buttons are purple with white text
 * - Buttons have pill shape and subtle elevation
 * 
 * Game Items:
 * - Horizontal layout with icon and description
 * - Icons are centered in fixed-width container
 * - Descriptions have consistent line height
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',
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
