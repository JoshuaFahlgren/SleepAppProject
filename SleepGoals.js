import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const CustomBubble = ({ value, onValueChange, label }) => {
  return (
    <TouchableOpacity style={styles.bubbleContainer} onPress={onValueChange}>
      <View style={[styles.bubble, value && styles.checkedBubble]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const SleepGoals = () => {
  const [parentGoals, setParentGoals] = useState({
    improveSleepQuality: false,
    increaseSleepDuration: false,
    consistentBedtime: false,
    reduceWakeUps: false,
    betterRestfulness: false,
  });

  const [childGoals, setChildGoals] = useState({
    betterSchoolPerformance: false,
    consistentSleepRoutine: false,
    reduceTechBeforeBed: false,
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
    alert('Sleep goals saved!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Parent Sleep Goals</Text>

      <CustomBubble
        value={parentGoals.improveSleepQuality}
        onValueChange={() => toggleParentGoal('improveSleepQuality')}
        label="Improve Sleep Quality"
      />

      <CustomBubble
        value={parentGoals.increaseSleepDuration}
        onValueChange={() => toggleParentGoal('increaseSleepDuration')}
        label="Increase Sleep Duration"
      />

      <CustomBubble
        value={parentGoals.consistentBedtime}
        onValueChange={() => toggleParentGoal('consistentBedtime')}
        label="Maintain a Consistent Bedtime"
      />

      <CustomBubble
        value={parentGoals.reduceWakeUps}
        onValueChange={() => toggleParentGoal('reduceWakeUps')}
        label="Reduce Nighttime Wake-Ups"
      />

      <CustomBubble
        value={parentGoals.betterRestfulness}
        onValueChange={() => toggleParentGoal('betterRestfulness')}
        label="Feel More Rested Upon Waking"
      />

      <Text style={styles.title}>Child Sleep Goals</Text>

      <CustomBubble
        value={childGoals.betterSchoolPerformance}
        onValueChange={() => toggleChildGoal('betterSchoolPerformance')}
        label="Improve School Performance"
      />

      <CustomBubble
        value={childGoals.consistentSleepRoutine}
        onValueChange={() => toggleChildGoal('consistentSleepRoutine')}
        label="Establish a Consistent Sleep Routine"
      />

      <CustomBubble
        value={childGoals.fewerNightmares}
        onValueChange={() => toggleChildGoal('fewerNightmares')}
        label="Experience Fewer Nightmares"
      />

      <CustomBubble
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
    backgroundColor: '#F4F7F8', // Light gray background from App.js
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#800080', // Purple color for the title from App.js
    fontSize: 36, // Consistent font size with App.js
    fontWeight: '600', // Consistent weight with App.js
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bubble: {
    width: 24,
    height: 24,
    borderRadius: 12, // Rounded to make it circular
    borderWidth: 2,
    borderColor: '#36454F',
    marginRight: 8,
  },
  checkedBubble: {
    backgroundColor: '#36454F', // Filled circle when selected
  },
  label: {
    fontSize: 16,
    color: '#36454F',
  },
  saveButton: {
    backgroundColor: '#800080', // Same button color as App.js
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, // Pill-shaped button style from App.js
    marginTop: 30,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default SleepGoals;
