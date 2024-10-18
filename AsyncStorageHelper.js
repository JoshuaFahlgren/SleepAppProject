import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data asynchronously
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));  // Store as a string
    console.log("Data stored successfully");
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

// Retrieve data asynchronously
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);  // Parse the string back to JSON
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

// Remove data asynchronously
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Data removed successfully");
  } catch (error) {
    console.error("Error removing data:", error);
  }
};
