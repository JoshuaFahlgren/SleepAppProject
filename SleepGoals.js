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

  const handleSave = () => {
    Alert.alert("Your preferences are saved!", "Now login to explore the app!", [
      {
        text: "OK",
        onPress: () => navigation.navigate('Login'),
      },
    ]);
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
          value={goals.fewerNightmares}
          onValueChange={() => toggleGoal('fewerNightmares')}
          label="Experience Fewer Nightmares"
        />

        <CustomCheckbox
          value={goals.wakeUpEnergized}
          onValueChange={() => toggleGoal('wakeUpEnergized')}
          label="Wake Up Energized"
        />
      </View>

      {/* Sleep Questionnaire Section */}
      <Text style={styles.questionnaireTitle}>Sleep Questionnaire</Text>
      
      <Text style={styles.subTitle}>Parent</Text>
      {renderYesNoSelector("Are you a light sleeper?", isLightSleeper.parent, (value) => setIsLightSleeper({ ...isLightSleeper, parent: value }))}
      {renderYesNoSelector("Do you have trouble falling asleep?", troubleFallingAsleep.parent, (value) => setTroubleFallingAsleep({ ...troubleFallingAsleep, parent: value }))}
      {renderYesNoSelector("Do you wake up in the middle of the night?", wakesUpInNight.parent, (value) => setWakesUpInNight({ ...wakesUpInNight, parent: value }))}
      {renderYesNoSelector("Do you wake up well rested?", wakesUpWellRested.parent, (value) => setWakesUpWellRested({ ...wakesUpWellRested, parent: value }))}

      <Text style={styles.subTitle}>Child</Text>
      {renderYesNoSelector("Is your child a light sleeper?", isLightSleeper.child, (value) => setIsLightSleeper({ ...isLightSleeper, child: value }))}
      {renderYesNoSelector("Does your child have trouble falling asleep?", troubleFallingAsleep.child, (value) => setTroubleFallingAsleep({ ...troubleFallingAsleep, child: value }))}
      {renderYesNoSelector("Does your child wake up in the middle of the night?", wakesUpInNight.child, (value) => setWakesUpInNight({ ...wakesUpInNight, child: value }))}
      {renderYesNoSelector("Does your child wake up well rested?", wakesUpWellRested.child, (value) => setWakesUpWellRested({ ...wakesUpWellRested, child: value }))}

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
    fontSize: 26, // Increased font size for the title
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 10,
    letterSpacing: 1,
    alignSelf: 'center', // Center the title horizontally
  },
  questionnaireTitle: {
    color: '#800080', // Purple color for the questionnaire title
    fontSize: 26, // Increased font size for the questionnaire title
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 10,
    letterSpacing: 1,
    alignSelf: 'center', // Center the questionnaire title horizontally
  },
  subTitle: {
    color: '#800080',
    fontSize: 22, // Slightly larger font size for subtitles
    marginTop: 20,
    marginBottom: 10,
  },
  goalsContainer: {
    marginBottom: 20,
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
  selectorContainer: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    color: '#36454F',
    marginBottom: 5,
  },
  selectorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectorButton: {
    padding: 10,
    borderRadius: 30, // Pill-shaped
    width: '40%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#800080', // Selected button color
  },
  unselectedButton: {
    backgroundColor: '#E0E0E0', // Unselected button color
  },
  selectorButtonText: {
    color: '#FFF',
    fontSize: 16,
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
