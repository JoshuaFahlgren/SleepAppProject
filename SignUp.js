import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false); // For the Terms and Conditions checkbox
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [termsRead, setTermsRead] = useState(false); // State to track if terms were read

  const validateEmail = (email) => {
    // Ensure email contains '@' and '.com' or '.edu'
    return email.includes('@') && (email.includes('.com') || email.includes('.edu'));
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("All fields are required.");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      Alert.alert("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }

    if (!isChecked) {
      Alert.alert("You must agree to the Terms and Conditions.");
      return;
    }

    try {
      // Check if email already exists
      const existingUsers = await AsyncStorage.getAllKeys();
      for (let key of existingUsers) {
        const userData = JSON.parse(await AsyncStorage.getItem(key));
        if (userData.email === email) {
          Alert.alert("Account Already Exists", "An account with this email already exists. Please use a different email or sign in.");
          return;
        }
      }

      // If email doesn't exist, proceed with storing new user data
      const userData = {
        email,
        password, // In a real app, passwords should be encrypted.
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      Alert.alert("Sign Up Successful!");
      navigation.navigate('SleepGoals');
    } catch (err) {
      Alert.alert("Error storing user data: ", err.message);
    }
  };

  const openTerms = () => {
    setModalVisible(true);
  };

  const closeTerms = () => {
    setModalVisible(false);
    setTermsRead(true); // Set to true after the modal is closed
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Parent Email"
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#36454F"
      />

      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={openTerms}>
          <Text style={styles.termsText}>Read Terms and Conditions</Text>
        </TouchableOpacity>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={setIsChecked}
            disabled={!termsRead}
            style={styles.checkbox}
            color={isChecked ? '#36454F' : undefined}
          />
          <Text style={styles.checkboxLabel}>I agree to the Terms and Conditions</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeTerms}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <Text style={styles.modalText}>
                Last Updated: 8/27/2024 {"\n"}
                {"\n"}
                1. Introduction{"\n"}
                Welcome to Sleep Sync (the "App"). The App is designed to help parents and children aged 6-12 track and improve their sleep patterns. By using the App, you agree to comply with and be bound by these Terms and Conditions (the "Terms"). Please read them carefully before using the App.{"\n"}
                {"\n"}
                2. Definitions{"\n"}
                • "User" refers to anyone using the App, including both parents and children.{"\n"}
                • "Data" refers to the sleep data and any optional information collected by the App.{"\n"}
                • "Service" refers to the features and functionalities provided by the App.{"\n"}
                {"\n"}
                3. Data Collection and Use{"\n"}
                • The App collects sleep data for both the parent and the child.{"\n"}
                • Optional information such as race, sex, height, weight, age, and sleep-related goals may be provided by the User.{"\n"}
                • No personal identifiers such as names are collected.{"\n"}
                • All Data is stored securely in a cloud-based database.{"\n"}
                • The Data will be used solely to provide insights and improve the sleep patterns of the parent and child.{"\n"}
                {"\n"}
                4. User Responsibilities{"\n"}
                • Users must provide accurate and truthful information when using the App.{"\n"}
                • Users are responsible for maintaining the confidentiality of their login information.{"\n"}
                {"\n"}
                5. Intellectual Property{"\n"}
                • All content, features, and functionality of the App, including but not limited to text, graphics, logos, and software, are the exclusive property of Auburn University and are protected by intellectual property laws.{"\n"}
                • Users are granted a limited, non-exclusive, non-transferable, and revocable license to use the App for personal, non-commercial use.{"\n"}
                {"\n"}
                6. Privacy and Data Security{"\n"}
                • We are committed to protecting the privacy and security of your Data.{"\n"}
                • We do not share, sell, or lease your Data to any third parties.{"\n"}
                • Users may request to delete their Data at any time by contacting us at [Contact Information].{"\n"}
                {"\n"}
                7. Disclaimer of Warranties{"\n"}
                • The App is provided on an "as-is" and "as-available" basis without any warranties of any kind, either express or implied.{"\n"}
                • We do not guarantee that the App will be error-free or that the Data provided will be completely accurate.{"\n"}
                {"\n"}
                8. Limitation of Liability{"\n"}
                • To the maximum extent permitted by law, Auburn University shall not be liable for any damages arising out of or in connection with your use of the App.{"\n"}
                • This includes, without limitation, any direct, indirect, incidental, or consequential damages.{"\n"}
                {"\n"}
                9. Termination{"\n"}
                • We reserve the right to terminate or suspend your access to the App at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the App, us, or third parties, or for any other reason.{"\n"}
                {"\n"}
                10. Governing Law{"\n"}
                • These Terms are governed by and construed in accordance with the laws of the State of Alabama.{"\n"}
                • Any disputes arising under or in connection with these Terms shall be resolved in the courts of the State of Alabama.{"\n"}
                {"\n"}
                11. Changes to These Terms{"\n"}
                • We may modify these Terms at any time. If we make changes, we will notify you by revising the date at the top of these Terms.{"\n"}
                • Continued use of the App after changes are made constitutes your acceptance of the new Terms.{"\n"}
                {"\n"}
                12. Contact Us{"\n"}
                • If you have any questions or concerns about these Terms, please contact us at [Contact Information].{"\n"}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeTerms}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#800080',
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 40,
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
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 16,
    color: '#1E90FF',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#36454F',
  },
  signUpButton: {
    backgroundColor: '#800080',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  closeButton: {
    backgroundColor: '#800080',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
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

export default SignUp;
