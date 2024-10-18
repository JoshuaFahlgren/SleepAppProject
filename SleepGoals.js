import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';

const CustomCheckbox = ({ value, onValueChange, label }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onValueChange}>
      <View style={[styles.checkbox, value && styles.checkedCheckbox]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const SleepGoals = ({ navigation }) => {
  const [parentGoals, setParentGoals] = useState({
    improveSleepQuality: false,
    increaseSleepDuration: false,
    consistentBedtime: false,
    reduceWakeUps: false,
    betterRestfulness: false,
    learnHowISleep: false,
  });

  const [childGoals, setChildGoals] = useState({
    betterSchoolPerformance: false,
    consistentSleepRoutine: false,
    fewerNightmares: false,
    wakeUpEnergized: false,
  });

  const toggleParentGoal = (goal) => {
    setParentGoals((prevGoals) => ({
      ...prevGoals,
      [goal]: !prevGoals[goal],
    }));
  };

  const toggleChildGoal = (goal) => {
    setChildGoals((prevGoals) => ({
      ...prevGoals,
      [goal]: !prevGoals[goal],
    }));
  };

  const handleSave = () => {
    Alert.alert("Your preferences are saved!", "Now login to explore the app!", [
      {
        text: "OK",
        onPress: () => navigation.navigate('Login'),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Parent Sleep Goals</Text>

      <CustomCheckbox
        value={parentGoals.improveSleepQuality}
        onValueChange={() => toggleParentGoal('improveSleepQuality')}
        label="Improve Sleep Quality"
      />

      <CustomCheckbox
        value={parentGoals.learnHowISleep}
        onValueChange={() => toggleParentGoal('learnHowISleep')}
        label="Learn How I Sleep"
      />

      <CustomCheckbox
        value={parentGoals.increaseSleepDuration}
        onValueChange={() => toggleParentGoal('increaseSleepDuration')}
        label="Increase Sleep Duration"
      />

      <CustomCheckbox
        value={parentGoals.consistentBedtime}
        onValueChange={() => toggleParentGoal('consistentBedtime')}
        label="Maintain a Consistent Bedtime"
      />

      <CustomCheckbox
        value={parentGoals.reduceWakeUps}
        onValueChange={() => toggleParentGoal('reduceWakeUps')}
        label="Reduce Nighttime Wake-Ups"
      />

      <CustomCheckbox
        value={parentGoals.betterRestfulness}
        onValueChange={() => toggleParentGoal('betterRestfulness')}
        label="Feel More Rested Upon Waking"
      />

      <Text style={styles.title}>Child Sleep Goals</Text>

      <CustomCheckbox
        value={childGoals.betterSchoolPerformance}
        onValueChange={() => toggleChildGoal('betterSchoolPerformance')}
        label="Improve School Performance"
      />

      <CustomCheckbox
        value={childGoals.consistentSleepRoutine}
        onValueChange={() => toggleChildGoal('consistentSleepRoutine')}
        label="Establish a Consistent Sleep Routine"
      />

      <CustomCheckbox
        value={childGoals.fewerNightmares}
        onValueChange={() => toggleChildGoal('fewerNightmares')}
        label="Experience Fewer Nightmares"
      />

      <CustomCheckbox
        value={childGoals.wakeUpEnergized}
        onValueChange={() => toggleChildGoal('wakeUpEnergized')}
        label="Wake Up Energized"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Goals</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F7F8', // Light gray background
    alignItems: 'flex-start', // Align items to the start (left)
    padding: 20,
  },
  title: {
    color: '#800080', // Purple color for the title
    fontSize: 24, // Adjusted font size for better fit
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 10,
    letterSpacing: 1,
    alignSelf: 'center', // Center the title horizontally
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10, // Add some left margin
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4, // Square shape with rounded edges
    borderWidth: 2,
    borderColor: '#36454F',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#36454F', // Filled square when selected
  },
  checkmark: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#36454F',
  },
  saveButton: {
    backgroundColor: '#800080', // Purple button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, // Pill-shaped button
    marginTop: 30,
    marginBottom: 40,
    alignSelf: 'center', // Center the button horizontally
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default SleepGoals;
