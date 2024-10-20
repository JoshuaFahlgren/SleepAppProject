import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const ParentWelcomePage = () => {
  const [selectedUser, setSelectedUser] = useState('parent'); // Parent or Child
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('lastNight'); // lastNight, week, or month
  const [sleepData, setSleepData] = useState({ parent: [], child: [] });
  const [modalVisible, setModalVisible] = useState(false); // For modal to add or edit data
  const [editingIndex, setEditingIndex] = useState(null); // Keep track of editing index
  const [day, setDay] = useState('');
  const [totalSleep, setTotalSleep] = useState('');
  const [remSleep, setRemSleep] = useState('');
  const [coreSleep, setCoreSleep] = useState('');
  const [deepSleep, setDeepSleep] = useState('');
  const [awakeTime, setAwakeTime] = useState('');

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const storedSleepData = await AsyncStorage.getItem(
            `sleepData_${parsedUser.email}`
          );
          if (storedSleepData) {
            setSleepData(JSON.parse(storedSleepData));
          }
        }
      } catch (err) {
        console.error('Error retrieving sleep data:', err);
      }
    };

    fetchSleepData();
  }, []);

  const handleAddOrEditSleep = async () => {
    if (!day || !totalSleep || !remSleep || !coreSleep || !deepSleep || !awakeTime) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const newSleepEntry = {
      day,
      totalSleep,
      remSleep,
      coreSleep,
      deepSleep,
      awakeTime,
    };

    const updatedSleepData = { ...sleepData };

    if (editingIndex !== null) {
      // Update existing entry if in edit mode
      updatedSleepData[selectedUser][editingIndex] = newSleepEntry;
    } else {
      // Add new entry if not in edit mode
      updatedSleepData[selectedUser] = [...updatedSleepData[selectedUser], newSleepEntry];
    }

    // Sort the data by day
    updatedSleepData[selectedUser].sort((a, b) => moment(a.day).diff(moment(b.day)));

    setSleepData(updatedSleepData);
    setModalVisible(false);
    setEditingIndex(null); // Reset editing state

    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        await AsyncStorage.setItem(
          `sleepData_${parsedUser.email}`,
          JSON.stringify(updatedSleepData)
        );
        Alert.alert('Sleep data saved successfully!');
      }
    } catch (err) {
      Alert.alert('Error storing sleep data: ', err.message);
    }

    // Clear inputs
    setDay('');
    setTotalSleep('');
    setRemSleep('');
    setCoreSleep('');
    setDeepSleep('');
    setAwakeTime('');
  };

  const handleEditSleep = (index) => {
    const entry = sleepData[selectedUser][index];
    setDay(entry.day);
    setTotalSleep(entry.totalSleep);
    setRemSleep(entry.remSleep);
    setCoreSleep(entry.coreSleep);
    setDeepSleep(entry.deepSleep);
    setAwakeTime(entry.awakeTime);
    setEditingIndex(index);
    setModalVisible(true);
  };

  const handleDeleteSleep = async (index) => {
    const updatedSleepData = { ...sleepData };
    updatedSleepData[selectedUser].splice(index, 1); // Remove the entry

    setSleepData(updatedSleepData);

    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        await AsyncStorage.setItem(
          `sleepData_${parsedUser.email}`,
          JSON.stringify(updatedSleepData)
        );
        Alert.alert('Sleep entry deleted successfully!');
      }
    } catch (err) {
      Alert.alert('Error deleting sleep entry: ', err.message);
    }
  };

  const filterSleepData = (userType, timeframe) => {
    const data = sleepData[userType] || [];
    const today = moment();
    let filteredData = [];

    if (timeframe === 'lastNight') {
      filteredData = data.filter(entry => moment(entry.day).isSame(today, 'day'));
    } else if (timeframe === 'week') {
      filteredData = data.filter(entry =>
        moment(entry.day).isBetween(today.clone().subtract(7, 'days'), today, null, '[]')
      );
    } else if (timeframe === 'month') {
      filteredData = data.filter(entry =>
        moment(entry.day).isBetween(today.clone().subtract(30, 'days'), today, null, '[]')
      );
    }

    return filteredData;
  };

  const userData = filterSleepData(selectedUser, selectedTimeFrame);

  const calculateAverages = (data) => {
    if (data.length === 0) return {};

    const total = data.length;
    const totals = data.reduce((acc, entry) => {
      acc.totalSleep += parseFloat(entry.totalSleep || 0);
      acc.remSleep += parseFloat(entry.remSleep || 0);
      acc.coreSleep += parseFloat(entry.coreSleep || 0);
      acc.deepSleep += parseFloat(entry.deepSleep || 0);
      acc.awakeTime += parseFloat(entry.awakeTime || 0);
      return acc;
    }, {
      totalSleep: 0,
      remSleep: 0,
      coreSleep: 0,
      deepSleep: 0,
      awakeTime: 0,
    });

    return {
      totalSleep: (totals.totalSleep / total).toFixed(1),
      remSleep: (totals.remSleep / total).toFixed(1),
      coreSleep: (totals.coreSleep / total).toFixed(1),
      deepSleep: (totals.deepSleep / total).toFixed(1),
      awakeTime: (totals.awakeTime / total).toFixed(1),
    };
  };

  const averages = calculateAverages(userData);

  const generateLineChartData = (data, metric) => {
    const labels = [];
    const values = [];
    data.forEach((entry) => {
      const value = parseFloat(entry[metric] || 0);
      if (!isNaN(value)) {
        labels.push(moment(entry.day).format('MMM D'));
        values.push(value);
      }
    });

    return {
      labels,
      datasets: [{ data: values }],
    };
  };

  const renderSleepTips = () => {
    const sleepAdvice = {
      adult: {
        totalSleep: { range: '7-9 hours', advice: 'Aim for at least 7 hours of total sleep. Consider adjusting your schedule for more rest.' },
        remSleep: { range: '1.5-2.5 hours', advice: 'Increase relaxation time before bed to improve REM sleep.' },
        deepSleep: { range: '1.5-2 hours', advice: 'Create a dark, cool environment to enhance deep sleep quality.' },
        awakeTime: { range: '0.5-1 hour', advice: 'Limit caffeine and screen time before bed to reduce awake time.' },
      },
      child: {
        totalSleep: { range: '9-12 hours', advice: 'Ensure a consistent bedtime to meet sleep requirements.' },
        remSleep: { range: '1.5-3 hours', advice: 'Encourage a calming bedtime routine to enhance REM sleep.' },
        deepSleep: { range: '2-4 hours', advice: 'Consider eliminating distractions to improve deep sleep duration.' },
        awakeTime: { range: '0.5-1 hour', advice: 'Monitor evening activities that could prolong awake time.' },
      },
    };

    const selectedAdvice = selectedUser === 'parent' ? sleepAdvice.adult : sleepAdvice.child;

    return (
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Sleep Tips</Text>
        
        {/* Display Average Metrics */}
        <View style={styles.averageContainer}>
          <Text style={styles.metricLabel}>Average Total Sleep: <Text style={styles.metricValue}>{averages.totalSleep} hours</Text></Text>
          <Text style={styles.metricLabel}>Average REM Sleep: <Text style={styles.metricValue}>{averages.remSleep} hours</Text></Text>
          <Text style={styles.metricLabel}>Average Core Sleep: <Text style={styles.metricValue}>{averages.coreSleep} hours</Text></Text>
          <Text style={styles.metricLabel}>Average Deep Sleep: <Text style={styles.metricValue}>{averages.deepSleep} hours</Text></Text>
          <Text style={styles.metricLabel}>Average Awake Time: <Text style={styles.metricValue}>{averages.awakeTime} hours</Text></Text>
        </View>

        {/* Tips Based on Averages */}
        {/* Total Sleep Tips */}
        {parseFloat(averages.totalSleep) < 7 && selectedUser === 'parent' && (
          <Text style={styles.tipText}>You are undersleeping. {selectedAdvice.totalSleep.advice}</Text>
        )}
        {parseFloat(averages.totalSleep) < 9 && selectedUser === 'child' && (
          <Text style={styles.tipText}>You are undersleeping. {selectedAdvice.totalSleep.advice}</Text>
        )}

        {/* REM Sleep Tips */}
        {parseFloat(averages.remSleep) < 1.5 && selectedUser === 'parent' && (
          <Text style={styles.tipText}>You are undersleeping in REM sleep. {selectedAdvice.remSleep.advice}</Text>
        )}
        {parseFloat(averages.remSleep) < 1.5 && selectedUser === 'child' && (
          <Text style={styles.tipText}>You are undersleeping in REM sleep. {selectedAdvice.remSleep.advice}</Text>
        )}

        {/* Deep Sleep Tips */}
        {parseFloat(averages.deepSleep) < 1.5 && selectedUser === 'parent' && (
          <Text style={styles.tipText}>You are undersleeping in deep sleep. {selectedAdvice.deepSleep.advice}</Text>
        )}
        {parseFloat(averages.deepSleep) < 2 && selectedUser === 'child' && (
          <Text style={styles.tipText}>You are undersleeping in deep sleep. {selectedAdvice.deepSleep.advice}</Text>
        )}

        {/* Awake Time Tips */}
        {parseFloat(averages.awakeTime) > 1 && selectedUser === 'parent' && (
          <Text style={styles.tipText}>Your awake time is too high. {selectedAdvice.awakeTime.advice}</Text>
        )}
        {parseFloat(averages.awakeTime) > 1 && selectedUser === 'child' && (
          <Text style={styles.tipText}>Your awake time is too high. {selectedAdvice.awakeTime.advice}</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Page Title */}
      <Text style={styles.pageTitle}>View Sleep</Text>

      {/* Toggle Buttons for Parent/Child */}
      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, selectedUser === 'parent' ? styles.selectedButton : styles.unselectedButton]}
          onPress={() => setSelectedUser('parent')}
        >
          <Text style={selectedUser === 'parent' ? styles.selectedButtonText : styles.unselectedButtonText}>
            Parent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, selectedUser === 'child' ? styles.selectedButton : styles.unselectedButton]}
          onPress={() => setSelectedUser('child')}
        >
          <Text style={selectedUser === 'child' ? styles.selectedButtonText : styles.unselectedButtonText}>
            Child
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Frame Selector */}
      <View style={styles.timeFrameSelector}>
        <TouchableOpacity
          style={[styles.timeFrameButton, selectedTimeFrame === 'lastNight' ? styles.selectedButton : styles.unselectedButton]}
          onPress={() => setSelectedTimeFrame('lastNight')}
        >
          <Text style={selectedTimeFrame === 'lastNight' ? styles.selectedButtonText : styles.unselectedButtonText}>
            Last Night
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeFrameButton, selectedTimeFrame === 'week' ? styles.selectedButton : styles.unselectedButton]}
          onPress={() => setSelectedTimeFrame('week')}
        >
          <Text style={selectedTimeFrame === 'week' ? styles.selectedButtonText : styles.unselectedButtonText}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeFrameButton, selectedTimeFrame === 'month' ? styles.selectedButton : styles.unselectedButton]}
          onPress={() => setSelectedTimeFrame('month')}
        >
          <Text style={selectedTimeFrame === 'month' ? styles.selectedButtonText : styles.unselectedButtonText}>
            Month
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Sleep Data Button */}
      <TouchableOpacity style={styles.addSleepButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addSleepButtonText}>+ Add Sleep</Text>
      </TouchableOpacity>

      {/* Line Charts for Sleep Metrics */}
      {userData.length > 0 && (
        <>
          <Text style={styles.chartTitle}>Total Sleep Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'totalSleep')}
            width={screenWidth - 40}
            height={220}
            chartConfig={styles.chartConfig}
            bezier
          />

          <Text style={styles.chartTitle}>Awake Time Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'awakeTime')}
            width={screenWidth - 40}
            height={220}
            chartConfig={styles.chartConfig}
            bezier
          />

          <Text style={styles.chartTitle}>REM Sleep Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'remSleep')}
            width={screenWidth - 40}
            height={220}
            chartConfig={styles.chartConfig}
            bezier
          />

          <Text style={styles.chartTitle}>Core Sleep Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'coreSleep')}
            width={screenWidth - 40}
            height={220}
            chartConfig={styles.chartConfig}
            bezier
          />

          <Text style={styles.chartTitle}>Deep Sleep Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'deepSleep')}
            width={screenWidth - 40}
            height={220}
            chartConfig={styles.chartConfig}
            bezier
          />
        </>
      )}

      {/* Display Sleep Data Table with Edit/Delete Buttons */}
      <View style={styles.sleepDataContainer}>
        {sleepData[selectedUser].map((entry, index) => (
          <View key={index} style={styles.sleepDataRow}>
            <Text style={styles.sleepDataText}>
              {`Day: ${entry.day}, Total: ${entry.totalSleep}, REM: ${entry.remSleep}, Core: ${entry.coreSleep}, Deep: ${entry.deepSleep}, Awake: ${entry.awakeTime}`}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditSleep(index)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSleep(index)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Add/Edit Sleep Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingIndex !== null ? 'Edit' : 'Add'} Sleep Data for {selectedUser === 'parent' ? 'Parent' : 'Child'}
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="default"
              placeholder="Day (YYYY-MM-DD)"
              value={day}
              onChangeText={setDay}
              placeholderTextColor="#800080" // Purple placeholder text
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Total Sleep (hours)"
              value={totalSleep}
              onChangeText={setTotalSleep}
              placeholderTextColor="#800080" // Purple placeholder text
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="REM Sleep (hours)"
              value={remSleep}
              onChangeText={setRemSleep}
              placeholderTextColor="#800080" // Purple placeholder text
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Core Sleep (hours)"
              value={coreSleep}
              onChangeText={setCoreSleep}
              placeholderTextColor="#800080" // Purple placeholder text
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Deep Sleep (hours)"
              value={deepSleep}
              onChangeText={setDeepSleep}
              placeholderTextColor="#800080" // Purple placeholder text
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Awake Time (hours)"
              value={awakeTime}
              onChangeText={setAwakeTime}
              placeholderTextColor="#800080" // Purple placeholder text
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleAddOrEditSleep}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sleep Tips Section */}
      {renderSleepTips()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F7F8',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#800080',
  },
  toggleButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderRadius: 25, // Pill-shaped
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#800080',
    borderColor: '#800080',
  },
  unselectedButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#800080',
  },
  selectedButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  unselectedButtonText: {
    color: '#800080',
    fontSize: 14,
  },
  timeFrameSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeFrameButton: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderRadius: 25, // Pill-shaped
    alignItems: 'center',
    marginHorizontal: 5,
  },
  addSleepButton: {
    backgroundColor: '#800080',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25, // Pill-shaped
    marginTop: 20,
  },
  addSleepButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#36454F',
    marginTop: 20,
    marginBottom: 10,
  },
  chartConfig: {
    backgroundColor: '#F4F7F8',
    backgroundGradientFrom: '#F4F7F8',
    backgroundGradientTo: '#E0E0E0',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#800080',
    },
  },
  sleepDataContainer: {
    marginTop: 20,
    width: '100%',
  },
  sleepDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginVertical: 5,
    flexWrap: 'wrap',
  },
  sleepDataText: {
    fontSize: 12,
    color: '#36454F',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#800080',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 25, // Pill-shaped
    marginLeft: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 25, // Pill-shaped
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#800080',
    padding: 12,
    marginTop: 10,
    borderRadius: 25, // Pill-shaped
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#800080',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: 250,
    fontSize: 16,
    textAlign: 'center',
  },
  tipsContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#800080',
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#E0E0E0',
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 10,
  },
  averageContainer: {
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#36454F',
  },
  metricValue: {
    fontWeight: 'normal',
    color: '#800080',
  },
  tipText: {
    fontSize: 14,
    color: '#36454F',
    marginBottom: 5,
  },
});

export default ParentWelcomePage;
