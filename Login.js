import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [username, setUsername] = useState(''); // Used for child login to store parent email
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  // Function to check credentials for parent login
  const checkParentCredentials = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser && parsedUser.email === email && parsedUser.password === password) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error retrieving user data from storage:", error);
      return false;
    }
  };

  // Function to verify if the parent email exists for child login
  const verifyParentEmailForChild = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser && parsedUser.email === username) {
        return true; // Parent email exists
      } else {
        return false; // Parent email does not exist
      }
    } catch (error) {
      console.error("Error retrieving user data from storage:", error);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!userRole) {
      Alert.alert("Please select whether you are a parent or a child.");
      return;
    }

    if (userRole === 'parent') {
      if (email && password) {
        const isValid = await checkParentCredentials();
        if (isValid) {
          Alert.alert("SMS code sent to your phone.");
          setIsCodeSent(true);
        } else {
          Alert.alert("Invalid email or password.");
        }
      } else {
        Alert.alert("Please enter email and password.");
      }
    } else if (userRole === 'child') {
      if (username) {
        const isParentEmailValid = await verifyParentEmailForChild();
        if (isParentEmailValid) {
          Alert.alert("SMS code sent to parent's phone for approval.");
          setIsCodeSent(true);
        } else {
          Alert.alert("Invalid parent email. Please try again.");
        }
      } else {
        Alert.alert("Please enter parent email.");
      }
    }
  };

  // Function to verify parent code
  const verifyCodeParent = () => {
    if (smsCode === '1234') {
      setIsApproved(true);
      Alert.alert("Parent SMS verification successful! You are logged in.");
      navigation.navigate('ParentWelcomePage'); // Navigate to ParentWelcomePage for parent
    } else {
      Alert.alert("Invalid code. Please try again.");
    }
  };

  // Function to verify child code
  const verifyCodeChild = () => {
    if (smsCode === '1234') {
      setIsApproved(true);
      Alert.alert("Child SMS verification successful! You are logged in.");
      const sleepData = { totalHours: 7 }; // Replace with actual sleep data logic
      navigation.navigate('GameWelcomeScreen', { sleepData }); // Navigate to GameWelcomeScreen for child
    } else {
      Alert.alert("Invalid code. Please try again.");
    }
  };

  const getDescription = () => {
    if (userRole === 'parent') {
      return 'As a parent, you can view sleep data and learn healthy sleeping habits. You can log in using your email and password. You will receive an SMS code to verify your login.';
    } else if (userRole === 'child') {
      return 'Your child can learn the benefits of consistent sleep through our interactive game. Enter your parent email to send a code for approval. You will need the SMS code to complete the login process.';
    }
    return '';
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>
          ← Back
        </Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Login</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.button, userRole === 'parent' && styles.selectedButton]}
          onPress={() => setUserRole('parent')}
        >
          <Text style={styles.buttonText}>as Parent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, userRole === 'child' && styles.selectedButton]}
          onPress={() => setUserRole('child')}
        >
          <Text style={styles.buttonText}>for Child</Text>
        </TouchableOpacity>
      </View>

      {userRole === 'parent' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
          {isCodeSent ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter SMS Code"
                value={smsCode}
                onChangeText={setSmsCode}
                keyboardType="numeric" // Numeric keyboard for SMS code input
              />
              <TouchableOpacity onPress={verifyCodeParent} style={styles.verifyButton}>
                <Text style={styles.verifyButtonText}>Verify Code</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {userRole === 'child' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Parent Email"
            value={username}
            onChangeText={setUsername}
          />
          {isCodeSent ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter SMS Code"
                value={smsCode}
                onChangeText={setSmsCode}
                keyboardType="numeric" // Numeric keyboard for SMS code input
              />
              <TouchableOpacity onPress={verifyCodeChild} style={styles.verifyButton}>
                <Text style={styles.verifyButtonText}>Verify Code</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Conditionally render the description box only if a user role is selected */}
      {userRole && (
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{getDescription()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',  // Light gray background from App.js
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',  // Ensures back button is positioned properly
  },
  title: {
    color: '#800080',  // Purple color for the title from App.js
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderColor: '#36454F',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    color: '#36454F',
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#800080',  // Purple buttons from App.js
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,  // Pill-shaped buttons from App.js
    alignItems: 'center',
    width: '40%',
  },
  loginButton: {
    backgroundColor: '#800080',  // Same button style as App.js
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,  // Pill-shaped login button from App.js
    alignItems: 'center',
    marginTop: 20,
  },
  verifyButton: {
    backgroundColor: '#28353B',  // Slightly different color for verify button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,  // Pill-shaped verify button
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  descriptionBox: {
    backgroundColor: '#E0E0E0',  // Light background for description box
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
  },
  descriptionText: {
    color: '#36454F',  // Dark text color for better readability
    fontSize: 16,
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#A9A9A9',  // Light gray for selected button
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#F4F7F8',
    borderColor: '#800080',
    borderWidth: 2,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#800080',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Login;

