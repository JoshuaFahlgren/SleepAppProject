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
import { LineChart, PieChart } from 'react-native-chart-kit';
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

  const generatePieChartData = (data) => {
    if (data.length === 0) return [];

    const totalRem = data.reduce((acc, entry) => acc + parseFloat(entry.remSleep || 0), 0);
    const totalCore = data.reduce((acc, entry) => acc + parseFloat(entry.coreSleep || 0), 0);
    const totalDeep = data.reduce((acc, entry) => acc + parseFloat(entry.deepSleep || 0), 0);
    const entryCount = data.length;

    const avgRem = entryCount > 0 ? totalRem / entryCount : 0;
    const avgCore = entryCount > 0 ? totalCore / entryCount : 0;
    const avgDeep = entryCount > 0 ? totalDeep / entryCount : 0;

    return [
      { name: `REM Sleep (${avgRem.toFixed(1)} hours)`, sleepType: avgRem, color: '#800080', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: `Core Sleep (${avgCore.toFixed(1)} hours)`, sleepType: avgCore, color: '#C0C0C0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: `Deep Sleep (${avgDeep.toFixed(1)} hours)`, sleepType: avgDeep, color: '#D8BFD8', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ];
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

      {/* Pie Chart for Sleep Types */}
      {userData.length > 0 && (
        <>
          <Text style={styles.chartTitle}>Sleep Breakdown</Text>
          <PieChart
            data={generatePieChartData(userData)}
            width={screenWidth - 40}
            height={220}
            chartConfig={styles.chartConfig}
            accessor="sleepType"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </>
      )}

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
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Total Sleep (hours)"
              value={totalSleep}
              onChangeText={setTotalSleep}
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="REM Sleep (hours)"
              value={remSleep}
              onChangeText={setRemSleep}
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Core Sleep (hours)"
              value={coreSleep}
              onChangeText={setCoreSleep}
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Deep Sleep (hours)"
              value={deepSleep}
              onChangeText={setDeepSleep}
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Awake Time (hours)"
              value={awakeTime}
              onChangeText={setAwakeTime}
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
});

export default ParentWelcomePage;
