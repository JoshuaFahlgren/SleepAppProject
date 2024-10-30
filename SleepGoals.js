import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const CustomCheckbox = ({ value, onValueChange, label }) => {
  const scaleValue = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onValueChange();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity style={styles.checkboxContainer} onPress={handlePress}>
        <View style={[styles.checkbox, value && styles.checkedCheckbox]}>
          {value && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SleepGoals = ({ navigation }) => {
  const [goals, setGoals] = useState({
    improveSleepQuality: false,
    increaseSleepDuration: false,
    consistentBedtime: false,
    reduceWakeUps: false,
    betterRestfulness: false,
    learnHowISleep: false,
    betterSchoolPerformance: false,
    consistentSleepRoutine: false,
    fewerNightmares: false,
    wakeUpEnergized: false,
  });

  // Sleep quality state
  const [isLightSleeper, setIsLightSleeper] = useState({ parent: false, child: false });
  const [troubleFallingAsleep, setTroubleFallingAsleep] = useState({ parent: false, child: false });
  const [wakesUpInNight, setWakesUpInNight] = useState({ parent: false, child: false });
  const [wakesUpWellRested, setWakesUpWellRested] = useState({ parent: false, child: false });

  const toggleGoal = (goal) => {
    setGoals((prevGoals) => ({
      ...prevGoals,
      [goal]: !prevGoals[goal],
    }));
  };

  const handleSave = async () => {
    try {
      // Retrieve user data from AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Save sleep questionnaire responses
        const sleepData = {
          isLightSleeper,
          troubleFallingAsleep,
          wakesUpInNight,
          wakesUpWellRested,
        };

        // Combine user data with sleep data
        const updatedUserData = {
          ...parsedUser,
          sleepData, // Add the sleep data to the user data
        };

        // Store updated user data back to AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));

        Alert.alert("Your preferences are saved!", "Now login to explore the app!", [
          {
            text: "OK",
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      }
    } catch (err) {
      Alert.alert("Error saving sleep data: ", err.message);
    }
  };

  const renderYesNoSelector = (label, value, onChange) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <View style={styles.selectorButtons}>
        <TouchableOpacity
          style={[styles.selectorButton, value ? styles.selectedButton : styles.unselectedButton]}
          onPress={() => onChange(true)}
        >
          <Text style={styles.selectorButtonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectorButton, !value ? styles.selectedButton : styles.unselectedButton]}
          onPress={() => onChange(false)}
        >
          <Text style={styles.selectorButtonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sleep Goals</Text>

      {/* Sleep Goals Section */}
      <View style={styles.card}>
        <View style={styles.goalsContainer}>
          <CustomCheckbox
            value={goals.improveSleepQuality}
            onValueChange={() => toggleGoal('improveSleepQuality')}
            label="Improve Sleep Quality"
          />

          <CustomCheckbox
            value={goals.learnHowISleep}
            onValueChange={() => toggleGoal('learnHowISleep')}
            label="Learn How I Sleep"
          />

          <CustomCheckbox
            value={goals.increaseSleepDuration}
            onValueChange={() => toggleGoal('increaseSleepDuration')}
            label="Increase Sleep Duration"
          />

          <CustomCheckbox
            value={goals.consistentBedtime}
            onValueChange={() => toggleGoal('consistentBedtime')}
            label="Maintain a Consistent Bedtime"
          />

          <CustomCheckbox
            value={goals.reduceWakeUps}
            onValueChange={() => toggleGoal('reduceWakeUps')}
            label="Reduce Nighttime Wake-Ups"
          />

          <CustomCheckbox
            value={goals.betterRestfulness}
            onValueChange={() => toggleGoal('betterRestfulness')}
            label="Feel More Rested Upon Waking"
          />

          <CustomCheckbox
            value={goals.betterSchoolPerformance}
            onValueChange={() => toggleGoal('betterSchoolPerformance')}
            label="Improve School Performance"
          />

          <CustomCheckbox
            value={goals.consistentSleepRoutine}
            onValueChange={() => toggleGoal('consistentSleepRoutine')}
            label="Establish a Consistent Sleep Routine"
          />

          <CustomCheckbox
            value={goals.wakeUpEnergized}
            onValueChange={() => toggleGoal('wakeUpEnergized')}
            label="Wake Up Energized"
          />
        </View>
      </View>

      {/* Sleep Questionnaire Section */}
      <Text style={styles.questionnaireTitle}>Sleep Questionnaire</Text>
      
      <View style={styles.card}>
        <Text style={styles.subTitle}>Parent</Text>
        {renderYesNoSelector("Are you a light sleeper?", isLightSleeper.parent, (value) => setIsLightSleeper({ ...isLightSleeper, parent: value }))}
        {renderYesNoSelector("Do you have trouble falling asleep?", troubleFallingAsleep.parent, (value) => setTroubleFallingAsleep({ ...troubleFallingAsleep, parent: value }))}
        {renderYesNoSelector("Do you wake up in the middle of the night?", wakesUpInNight.parent, (value) => setWakesUpInNight({ ...wakesUpInNight, parent: value }))}
        {renderYesNoSelector("Do you wake up well rested?", wakesUpWellRested.parent, (value) => setWakesUpWellRested({ ...wakesUpWellRested, parent: value }))}
      </View>

      <View style={styles.card}>
        <Text style={styles.subTitle}>Child</Text>
        {renderYesNoSelector("Is your child a light sleeper?", isLightSleeper.child, (value) => setIsLightSleeper({ ...isLightSleeper, child: value }))}
        {renderYesNoSelector("Does your child have trouble falling asleep?", troubleFallingAsleep.child, (value) => setTroubleFallingAsleep({ ...troubleFallingAsleep, child: value }))}
        {renderYesNoSelector("Does your child wake up in the middle of the night?", wakesUpInNight.child, (value) => setWakesUpInNight({ ...wakesUpInNight, child: value }))}
        {renderYesNoSelector("Does your child wake up well rested?", wakesUpWellRested.child, (value) => setWakesUpWellRested({ ...wakesUpWellRested, child: value }))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Goals</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F7F8',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: '#800080',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  questionnaireTitle: {
    color: '#800080',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  subTitle: {
    color: '#800080',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
  },
  goalsContainer: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#800080',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#800080',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  selectorContainer: {
    marginBottom: 15,
  },
  selectorLabel: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
    fontWeight: '500',
  },
  selectorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectorButton: {
    padding: 12,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#800080',
  },
  unselectedButton: {
    backgroundColor: '#E9ECEF',
  },
  selectorButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#800080',
    paddingVertical: 16,
    paddingHorizontal: 45,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default SleepGoals;
