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
      {/* Title */}
      <Text style={styles.title}>Login</Text>
      
      {/* Role Selection */}
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

      {/* Input fields based on selected role */}
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
          
          {/* Login Button */}
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
          
          {/* Login Button */}
          {!isCodeSent && (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Show SMS verification input when code is sent */}
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

      {/* Dynamic Description Box */}
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
    backgroundColor: '#F0FFF0', // Light mint green background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#36454F', // Dark slate gray for the title
    fontSize: 36, // Slightly reduced font size for better balance
    fontWeight: 'bold', // Bold for title emphasis
    textAlign: 'center',
    marginBottom: 30, // Increased margin for spacing
    textShadowColor: '#FFF', // Shadow effect
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    height: 50, // Slightly taller for easier input
    borderColor: '#36454F',
    borderWidth: 2,
    borderRadius: 8, // Increased border-radius for rounded corners
    paddingHorizontal: 15, // Increased padding
    marginBottom: 20,
    width: '100%',
    color: '#36454F',
    fontSize: 16, // Larger font size for input text
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30, // Increased space before inputs
  },
  button: {
    backgroundColor: '#36454F', // Charcoal color for buttons
    paddingVertical: 12,
    paddingHorizontal: 30, // Wider padding
    borderRadius: 25, // Pill-shaped buttons
    alignItems: 'center',
    width: '40%', // Adjusted width for a better fit
  },
  loginButton: {
    backgroundColor: '#36454F', // Same color as other buttons
    paddingVertical: 15,
    paddingHorizontal: 40, // Wider padding for login button
    borderRadius: 25, // Pill-shaped login button
    alignItems: 'center',
    marginTop: 20, // Margin above login button
  },
  verifyButton: {
    backgroundColor: '#28353B', // Slightly different color for verify button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25, // Pill-shaped verify button
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF', // White text on the button
    fontSize: 18,
    fontWeight: '600', // Slightly bolder text
  },
  selectedButton: {
    backgroundColor: '#28353B', // Darker shade for selected role button
  },
  descriptionBox: {
    marginTop: 20,
    backgroundColor: '#E8F6F3', // Light background for the description box
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
