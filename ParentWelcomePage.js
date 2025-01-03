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

/**
 * ParentWelcomePage component displays sleep data analysis and tracking interface
 * Allows parents to view, add, edit, and analyze sleep patterns for both parent and child
 */
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
  const [dayPlaceholder, setDayPlaceholder] = useState('YYYYMMDD');
  const [sleepDataModalVisible, setSleepDataModalVisible] = useState(false);

  /**
   * Fetches stored sleep data from AsyncStorage on component mount
   * Retrieves data associated with the logged-in user's email
   */
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

  /**
   * Handles adding new or editing existing sleep data entries
   * Validates input fields and ensures sleep components sum to total sleep time
   * Updates AsyncStorage with new data and sorts entries by date
   */
  const handleAddOrEditSleep = async () => {
    // Validate all fields are filled
    if (!day || !totalSleep || !remSleep || !coreSleep || !deepSleep || !awakeTime) {
      Alert.alert('Please fill in all fields');
      return;
    }

    // Convert values to numbers for validation
    const totalSleepNum = parseFloat(totalSleep);
    const remSleepNum = parseFloat(remSleep);
    const coreSleepNum = parseFloat(coreSleep);
    const deepSleepNum = parseFloat(deepSleep);
    const awakeTimeNum = parseFloat(awakeTime);

    // Validate sleep components don't exceed total sleep
    const sumOfComponents = remSleepNum + coreSleepNum + deepSleepNum + awakeTimeNum;
    if (Math.abs(sumOfComponents - totalSleepNum) > 0.1) { // Allow small rounding differences
      Alert.alert('Invalid Sleep Data', 
        'The sum of REM, Core, Deep sleep, and Awake time must equal the Total Sleep time.');
      return;
    }

    // Format the day to ensure consistent comparison
    const formattedDay = moment(day, 'YYYYMMDD').format('YYYYMMDD');

    // Initialize updatedSleepData with existing data or empty arrays
    const updatedSleepData = { ...sleepData };
    if (!updatedSleepData[selectedUser]) {
      updatedSleepData[selectedUser] = [];
    }

    // Check for existing data on the same date
    const existingEntry = updatedSleepData[selectedUser].find((entry, index) => {
      if (!entry) return false;
      const entryDay = moment(entry.day, 'YYYYMMDD').format('YYYYMMDD');
      return entryDay === formattedDay && index !== editingIndex;
    });

    if (existingEntry) {
      Alert.alert(
        'Date Conflict',
        'Sleep data already exists for this date. Please choose a different date or edit the existing entry.'
      );
      return;
    }

    const newSleepEntry = {
      day: formattedDay,
      totalSleep,
      remSleep,
      coreSleep,
      deepSleep,
      awakeTime,
    };

    if (editingIndex !== null) {
      updatedSleepData[selectedUser][editingIndex] = newSleepEntry;
    } else {
      updatedSleepData[selectedUser] = [...updatedSleepData[selectedUser], newSleepEntry];
    }

    // Sort the data by day
    updatedSleepData[selectedUser].sort((a, b) => moment(a.day).diff(moment(b.day)));

    setSleepData(updatedSleepData);
    setModalVisible(false);
    setEditingIndex(null);

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

  /**
   * Populates form fields with existing sleep entry data for editing
   * @param {number} index - Array index of the sleep entry to edit
   */
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

  /**
   * Deletes a sleep entry and updates AsyncStorage
   * @param {number} index - Array index of the sleep entry to delete
   */
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

  /**
   * Filters sleep data based on selected user and timeframe
   * @param {string} userType - 'parent' or 'child'
   * @param {string} timeframe - 'lastNight', 'week', or 'month'
   * @returns {Array} Filtered sleep data entries
   */
  const filterSleepData = (userType, timeframe) => {
    const data = sleepData[userType] || [];
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    let filteredData = [];

    if (timeframe === 'lastNight') {
      filteredData = data.filter(entry => 
        moment(entry.day, 'YYYY-MM-DD').isSame(yesterday, 'day')
      );
      // If no data for yesterday, check today (in case they logged early morning)
      if (filteredData.length === 0) {
        filteredData = data.filter(entry => 
          moment(entry.day, 'YYYY-MM-DD').isSame(today, 'day')
        );
      }
    } else if (timeframe === 'week') {
      filteredData = data.filter(entry =>
        moment(entry.day, 'YYYY-MM-DD').isBetween(today.clone().subtract(7, 'days'), today, null, '[]')
      );
    } else if (timeframe === 'month') {
      filteredData = data.filter(entry =>
        moment(entry.day, 'YYYY-MM-DD').isBetween(today.clone().subtract(30, 'days'), today, null, '[]')
      );
    }

    return filteredData;
  };

  const userData = filterSleepData(selectedUser, selectedTimeFrame);

  /**
   * Calculates average sleep metrics from filtered data
   * @param {Array} data - Array of sleep entries
   * @returns {Object|null} Average metrics or null if no data
   */
  const calculateAverages = (data) => {
    if (!data || data.length === 0) return null;

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

  /**
   * Formats sleep data for line chart display
   * @param {Array} data - Array of sleep entries
   * @param {string} metric - Sleep metric to display (e.g., 'totalSleep')
   * @returns {Object} Formatted data for chart component
   */
  const generateLineChartData = (data, metric) => {
    if (data.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }

    const labels = [];
    const values = [];
    data.forEach((entry) => {
      const value = parseFloat(entry[metric] || 0);
      if (!isNaN(value)) {
        labels.push(moment(entry.day, 'YYYY-MM-DD').format('MMM D'));
        values.push(value);
      }
    });

    return {
      labels,
      datasets: [{ data: values }],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`, // Purple color
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  /**
   * Renders sleep analysis, charts, and personalized tips
   * Includes pie chart of sleep composition and advice based on averages
   * @returns {JSX.Element} Sleep analysis UI
   */
  const renderSleepTips = () => {
    if (!averages) {
      return (
        <View style={styles.tipsContainer}>
          <Text style={styles.noDataText}>
            No sleep data available for the selected time frame.
          </Text>
        </View>
      );
    }

    const sleepAdvice = {
      adult: {
        totalSleep: { range: '7-9 hours', advice: 'Aim for 7-9 hours of total sleep. Consider adjusting your schedule to prioritize consistent sleep patterns.' },
        remSleep: { range: '20-25% of total sleep', advice: 'REM sleep is crucial for cognitive function and emotional regulation. To improve REM sleep, maintain a consistent sleep schedule and avoid alcohol before bed.' },
        coreSleep: { range: '50-60% of total sleep', advice: 'Light sleep is important for memory consolidation and learning. To enhance core sleep, create a relaxing bedtime routine and ensure your sleeping environment is comfortable.' },
        deepSleep: { range: '15-25% of total sleep', advice: 'Deep sleep is essential for physical recovery and growth. To increase deep sleep, exercise regularly and avoid caffeine in the afternoon and evening.' },
        awakeTime: { range: '5-10% of total sleep', advice: 'Some awake time during the night is normal. To minimize disruptions, keep your bedroom dark, quiet, and cool.' },
      },
      child: {
        totalSleep: { range: '9-12 hours', advice: 'Children need more sleep for proper growth and development. Establish a consistent bedtime routine to ensure adequate sleep.' },
        remSleep: { range: '20-25% of total sleep', advice: 'REM sleep is vital for a child\'s brain development. Encourage a regular sleep schedule and limit screen time before bed to improve REM sleep.' },
        coreSleep: { range: '45-55% of total sleep', advice: 'Light sleep helps children process and consolidate information learned during the day. Create a calm environment before bedtime to promote quality core sleep.' },
        deepSleep: { range: '20-30% of total sleep', advice: 'Deep sleep is crucial for a child\'s physical growth. Encourage physical activity during the day to promote deeper sleep at night.' },
        awakeTime: { range: '5-10% of total sleep', advice: 'Brief awakenings are normal for children. Ensure the child\'s room is conducive to sleep and address any anxieties that might disrupt sleep.' },
      },
    };

    const selectedAdvice = selectedUser === 'parent' ? sleepAdvice.adult : sleepAdvice.child;

    const pieChartData = [
      {
        name: 'REM',
        population: parseFloat(averages.remSleep),
        color: '#8E44AD', // Deep purple
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Core',
        population: parseFloat(averages.coreSleep),
        color: '#9B59B6', // Medium purple
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Deep',
        population: parseFloat(averages.deepSleep),
        color: '#AF7AC5', // Light purple
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Awake',
        population: parseFloat(averages.awakeTime),
        color: '#D7BDE2', // Very light purple
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];

    // Function to check if any tips are needed
    const needsTips = () => {
      return (
        parseFloat(averages.totalSleep) < (selectedUser === 'parent' ? 7 : 9) ||
        parseFloat(averages.remSleep) < 1.5 ||
        parseFloat(averages.deepSleep) < (selectedUser === 'parent' ? 1.5 : 2) ||
        parseFloat(averages.awakeTime) > 1
      );
    };

    return (
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Sleep Analysis</Text>
        
        {/* Display Average Metrics */}
        <View style={styles.averageContainer}>
          <Text style={styles.metricLabel}>Average Total Sleep: <Text style={styles.metricValue}>{averages.totalSleep} hours</Text></Text>
          <Text style={styles.metricLabel}>Average REM Sleep: <Text style={styles.metricValue}>{averages.remSleep} hours</Text></Text>
          <Text style={styles.metricLabel}>Average Core Sleep: <Text style={styles.metricValue}>{averages.coreSleep} hours</Text></Text>
          <Text style={styles.metricLabel}>Average Deep Sleep: <Text style={styles.metricValue}>{averages.deepSleep} hours</Text></Text>
          <Text style={styles.metricLabel}>Average Awake Time: <Text style={styles.metricValue}>{averages.awakeTime} hours</Text></Text>
        </View>

        {/* Pie Chart */}
        <Text style={styles.chartTitle}>Sleep Composition</Text>
        <PieChart
          data={pieChartData}
          width={screenWidth - 60}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute={false}
        />

        {/* Sleep Description */}
        <View style={styles.sleepDescriptionContainer}>
          <Text style={styles.sleepDescriptionTitle}>Understanding Your Sleep Stages</Text>
          <Text style={styles.sleepDescriptionText}>
            • REM (Rapid Eye Movement): Essential for cognitive functions like memory consolidation and learning.
          </Text>
          <Text style={styles.sleepDescriptionText}>
            • Core (Light) Sleep: Helps with mental and physical recovery, and makes up the largest portion of your sleep cycle.
          </Text>
          <Text style={styles.sleepDescriptionText}>
            • Deep Sleep: Crucial for physical recovery, immune function, and growth.
          </Text>
          <Text style={styles.sleepDescriptionText}>
            • Awake Time: Brief periods of wakefulness are normal during the night and typically forgotten by morning.
          </Text>
        </View>

        {/* Tips Based on Averages */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsSectionTitle}>Personalized Sleep Tips</Text>
          {needsTips() ? (
            <>
              {parseFloat(averages.totalSleep) < (selectedUser === 'parent' ? 7 : 9) && (
                <Text style={styles.tipText}>{selectedAdvice.totalSleep.advice}</Text>
              )}
              {parseFloat(averages.remSleep) < 1.5 && (
                <Text style={styles.tipText}>{selectedAdvice.remSleep.advice}</Text>
              )}
              {parseFloat(averages.deepSleep) < (selectedUser === 'parent' ? 1.5 : 2) && (
                <Text style={styles.tipText}>{selectedAdvice.deepSleep.advice}</Text>
              )}
              {parseFloat(averages.awakeTime) > 1 && (
                <Text style={styles.tipText}>{selectedAdvice.awakeTime.advice}</Text>
              )}
            </>
          ) : (
            <Text style={styles.encouragementText}>
              Great job! Your sleep patterns are looking healthy. Keep up the good work and continue maintaining your consistent sleep routine. Remember, quality sleep is key to overall well-being and performance.
            </Text>
          )}
        </View>
      </View>
    );
  };

  /**
   * Handles date input formatting and validation
   * @param {string} text - User input text
   */
  const handleDayChange = (text) => {
    // Remove any non-digit characters
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Limit the input to 8 digits
    const truncatedText = numericText.slice(0, 8);
    
    setDay(truncatedText);
    
    // Update placeholder
    if (truncatedText.length > 0) {
      setDayPlaceholder('');
    } else {
      setDayPlaceholder('YYYYMMDD');
    }
  };

  /**
   * Renders modal for viewing and managing sleep data entries
   * Includes edit and delete functionality for each entry
   * @returns {JSX.Element} Sleep data management modal
   */
  const renderSleepDataModal = () => (
    <Modal
      visible={sleepDataModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSleepDataModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sleep Data</Text>
          <ScrollView style={styles.sleepDataScrollView}>
            {sleepData[selectedUser].map((entry, index) => (
              <View key={index} style={styles.sleepDataRow}>
                <Text style={styles.sleepDataText}>
                  {`Day: ${entry.day}, Total: ${entry.totalSleep}, REM: ${entry.remSleep}, Core: ${entry.coreSleep}, Deep: ${entry.deepSleep}, Awake: ${entry.awakeTime}`}
                </Text>
                <View style={styles.sleepDataButtonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setSleepDataModalVisible(false);
                      handleEditSleep(index);
                    }}
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
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSleepDataModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  /**
   * Main render method for ParentWelcomePage
   * Displays:
   * - Header with add/edit buttons
   * - User and timeframe selection
   * - Sleep analysis and charts
   * - Data management modals
   */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.editSleepButton}
          onPress={() => setSleepDataModalVisible(true)}
        >
          <Text style={styles.editSleepButtonText}>- Edit Sleep</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>View Sleep</Text>
        </View>
        <TouchableOpacity
          style={styles.addSleepButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addSleepButtonText}>+ Add Sleep</Text>
        </TouchableOpacity>
      </View>

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

      {/* Sleep Tips Section */}
      {renderSleepTips()}

      {/* Line Charts for Sleep Metrics */}
      {userData.length > 0 && selectedTimeFrame !== 'lastNight' ? (
        <>
          <Text style={styles.chartTitle}>Total Sleep Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'totalSleep')}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
          />

          <Text style={styles.chartTitle}>Awake Time Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'awakeTime')}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
          />

          <Text style={styles.chartTitle}>REM Sleep Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'remSleep')}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
          />

          <Text style={styles.chartTitle}>Core Sleep Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'coreSleep')}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
          />

          <Text style={styles.chartTitle}>Deep Sleep Over Time</Text>
          <LineChart
            data={generateLineChartData(userData, 'deepSleep')}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        </>
      ) : (
        userData.length === 0 && (
          <Text style={styles.noDataText}>
            {selectedTimeFrame === 'lastNight' 
              ? `No sleep data available for last night for the ${selectedUser}.` 
              : `No data available for the selected time frame for the ${selectedUser}.`}
          </Text>
        )
      )}

      {/* Sleep Data Modal */}
      {renderSleepDataModal()}

      {/* Add/Edit Sleep Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingIndex !== null ? 'Edit' : 'Add'} Sleep Data for {selectedUser === 'parent' ? 'Parent' : 'Child'}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="YYYYMMDD"
                value={day}
                onChangeText={handleDayChange}
                placeholderTextColor="#800080"
                maxLength={8}
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Total Sleep (hours)"
                value={totalSleep}
                onChangeText={setTotalSleep}
                placeholderTextColor="#800080"
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="REM Sleep (hours)"
                value={remSleep}
                onChangeText={setRemSleep}
                placeholderTextColor="#800080"
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Core Sleep (hours)"
                value={coreSleep}
                onChangeText={setCoreSleep}
                placeholderTextColor="#800080"
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Deep Sleep (hours)"
                value={deepSleep}
                onChangeText={setDeepSleep}
                placeholderTextColor="#800080"
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Awake Time (hours)"
                value={awakeTime}
                onChangeText={setAwakeTime}
                placeholderTextColor="#800080"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddOrEditSleep}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

/**
 * Styles for ParentWelcomePage component
 * Defines styling for:
 * - Layout containers and spacing
 * - Buttons and interactive elements
 * - Charts and data visualization
 * - Modals and forms
 * - Typography and colors
 */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F7F8',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  editSleepButton: {
    backgroundColor: '#800080',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25, // Pill-shaped
  },
  editSleepButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
  },
  addSleepButton: {
    backgroundColor: '#800080',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25, // Pill-shaped
  },
  addSleepButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: '#FF0000', // Red color for delete button
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#800080',
    borderRadius: 25,
    padding: 12,
    marginVertical: 10,
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#800080',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 0.45,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  tipsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  averageContainer: {
    marginBottom: 20,
  },
  metricLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  metricValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  sleepDescriptionContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sleepDescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sleepDescriptionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  tipsSection: {
    marginTop: 20,
  },
  tipsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#800080',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#800080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  encouragementText: {
    fontSize: 16,
    color: '#4A0E4E', // A shade of purple
    marginBottom: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sleepDataScrollView: {
    width: '100%',
    maxHeight: '70%',
  },
  sleepDataRow: {
    backgroundColor: '#F0E6FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  sleepDataText: {
    fontSize: 14,
    color: '#4A0E4E',
    marginBottom: 10,
  },
  sleepDataButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#800080',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#800080',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ParentWelcomePage;
