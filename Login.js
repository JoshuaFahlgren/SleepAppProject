import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, StatusBar } from 'react-native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [smsCode, setSmsCode] = useState(''); 
  const [username, setUsername] = useState(''); // Username for child login
  const [isCodeSent, setIsCodeSent] = useState(false); // State to track if code was sent
  const [userRole, setUserRole] = useState(null); // State for user role
  const [isApproved, setIsApproved] = useState(false); // State for approval (after SMS verification)

  const handleLogin = () => {
    if (!userRole) {
      Alert.alert("Please select whether you are a parent or a child.");
      return;
    }

    if (userRole === 'parent') {
      if (email && password) {
        Alert.alert("SMS code sent to your phone.");
        setIsCodeSent(true);
      } else {
        Alert.alert("Please enter email and password.");
      }
    } else if (userRole === 'child') {
      if (username) {
        Alert.alert("SMS code sent to parent's phone for approval.");
        setIsCodeSent(true);
      } else {
        Alert.alert("Please enter parent email.");
      }
    }
  };

  const verifyCode = () => {
    if (smsCode === '1234') { // For demo purposes, assume code is 1234
      setIsApproved(true);
      Alert.alert("SMS verification successful! You are logged in.");
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
    return ''; // No description when no role is selected
  };

  return (
    <View style={styles.container}>
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
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#36454F"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#36454F"
          />
          
          {!isCodeSent && (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {userRole === 'child' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Parent Email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#36454F"
          />
          
          {!isCodeSent && (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {isCodeSent && !isApproved && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter SMS Code"
            value={smsCode}
            onChangeText={setSmsCode}
            keyboardType="numeric"
            placeholderTextColor="#36454F"
          />
          <TouchableOpacity style={styles.verifyButton} onPress={verifyCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
        </>
      )}

      {userRole && (
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{getDescription()}</Text>
        </View>
      )}

      <StatusBar style="auto" />
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
  selectedButton: {
    backgroundColor: '#28353B',  // Darker shade for selected role button
  },
  descriptionBox: {
    marginTop: 20,
    backgroundColor: '#E8F6F3',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  descriptionText: {
    color: '#36454F',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Login;
