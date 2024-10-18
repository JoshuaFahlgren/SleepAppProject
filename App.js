import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Login from './Login';  // Correct path to Login component
import SignUp from './SignUp';  // Correct path to SignUp component
import SleepGoals from './SleepGoals';  // Correct path to SleepGoals component
import SheepJumpGame from './SheepJumpGame';
import GameWelcomeScreen from './GameWelcomeScreen';
import Herdle from './Herdle';
import ParentWelcomePage from './ParentWelcomePage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SleepGoals" component={SleepGoals} />
        <Stack.Screen name="SheepJumpGame" component={SheepJumpGame} />
        <Stack.Screen name="GameWelcomeScreen" component={GameWelcomeScreen} />
        <Stack.Screen name="Herdle" component={Herdle} />
        <Stack.Screen name="ParentWelcomePage" component={ParentWelcomePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/HomePageImage.jpg')} 
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>Sleep Sync</Text>
      <Text style={styles.text}>Rest, Reflect, Connect</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',  // Light gray background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
  },
  title: {
    color: '#800080',  // Purple color for the title
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  text: {
    color: '#36454F',
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    lineHeight: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    backgroundColor: '#800080',  // Purple buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});
