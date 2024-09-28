import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Login from './Login';  // Correct path to Login component
import SignUp from './SignUp';  // Correct path to SignUp component
import SleepGoals from './SleepGoals';  // Correct path to SleepGoals component

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SleepGoals" component={SleepGoals} />
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
    backgroundColor: '#F0FFF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    color: '#36454F',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  text: {
    color: '#36454F',
    fontSize: 25,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    backgroundColor: '#36454F',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,  // Makes the button pill-shaped
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});
