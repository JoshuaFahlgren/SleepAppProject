import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons

// Adjusted data generator for realistic sleep data
const generateRandomData = (length, min, max) => {
  return Array.from({ length }, () => {
    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(2));
  });
};

const fakeData = {
  parent: {
    week: {
      totalSleep: generateRandomData(7, 6, 8), // 6-8 hours
      remSleep: generateRandomData(7, 1.5, 2), // 1.5-2 hours
      sleepLatency: generateRandomData(7, 10, 20), // 10-20 mins
    },
    month: {
      totalSleep: generateRandomData(30, 6, 8),
      remSleep: generateRandomData(30, 1.5, 2),
      sleepLatency: generateRandomData(30, 10, 20),
    },
  },
  child: {
    week: {
      totalSleep: generateRandomData(7, 4, 7), // 8-10 hours
      remSleep: generateRandomData(7, 1, 2), // 2-3 hours
      sleepLatency: generateRandomData(7, 30, 45), // 5-15 mins
    },
    month: {
      totalSleep: generateRandomData(30, 8, 10),
      remSleep: generateRandomData(30, 2, 3),
      sleepLatency: generateRandomData(30, 5, 15),
    },
  },
};

const ParentWelcomePage = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(0); // 0: week, 1: month
  const [selectedUser, setSelectedUser] = useState(0); // 0: parent, 1: child
  const [settingsModalVisible, setSettingsModalVisible] = useState(false); // Modal state

  const timeFrames = ['week', 'month'];
  const users = ['parent', 'child'];

  const getData = (metric) => {
    const userData =
      fakeData[users[selectedUser]][timeFrames[selectedTimeFrame]];
    return userData ? userData[metric] : [];
  };

  const getLabels = () => {
    if (timeFrames[selectedTimeFrame] === 'week') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (timeFrames[selectedTimeFrame] === 'month') {
      return Array.from({ length: 6 }, (_, i) => `${i * 5 + 1}`);
    }
    return [];
  };

  const metricTitles = {
    totalSleep: 'Total Sleep (Hours)',
    remSleep: 'REM Sleep (Hours)',
    sleepLatency: 'Sleep Latency (Minutes)',
  };

  // Function to calculate averages
  const getAverages = () => {
    const totalSleep = getData('totalSleep');
    const remSleep = getData('remSleep');
    const sleepLatency = getData('sleepLatency');

    const averageTotalSleep = (
      totalSleep.reduce((a, b) => a + b, 0) / totalSleep.length
    ).toFixed(2);
    const averageRemSleep = (
      remSleep.reduce((a, b) => a + b, 0) / remSleep.length
    ).toFixed(2);
    const averageSleepLatency = (
      sleepLatency.reduce((a, b) => a + b, 0) / sleepLatency.length
    ).toFixed(2);

    return {
      averageTotalSleep: parseFloat(averageTotalSleep),
      averageRemSleep: parseFloat(averageRemSleep),
      averageSleepLatency: parseFloat(averageSleepLatency),
    };
  };

  // Function to determine sleep tips
  const getSleepTips = () => {
    const { averageTotalSleep, averageRemSleep, averageSleepLatency } =
      getAverages();

    let tips = [];

    // Decide pronouns based on selected user
    const isParentSelected = selectedUser === 0;
    const subject = isParentSelected ? 'you' : 'your child';
    const possessive = isParentSelected ? 'your' : "your child's";
    const possessiveCapitalized = isParentSelected ? 'You' : 'Your child';
    const subjectCapitalized = isParentSelected ? 'Your' : 'Your child\'s';

    // Provide tips based on total sleep
    if (averageTotalSleep < 7) {
      if (isParentSelected) {
        tips.push(
          'Establish a consistent sleep schedule by going to bed and waking up at the same time every day.'
        );
        tips.push(
          "Create a relaxing bedtime routine, like reading a book or taking a warm bath, to signal your body it's time to sleep."
        );
        tips.push(
          'Limit daytime naps to 20-30 minutes to avoid interfering with nighttime sleep.'
        );
      } else {
        tips.push(
          'Help your child establish a consistent sleep schedule by having them go to bed and wake up at the same time every day.'
        );
        tips.push(
          'Create a relaxing bedtime routine for your child, like reading a book or taking a warm bath, to signal it\'s time to sleep.'
        );
        tips.push(
          "Limit your child's daytime naps to avoid interfering with nighttime sleep."
        );
      }
    } else {
      tips.push(
        `Great job maintaining a healthy sleep duration! Continue ${possessive} good sleep habits.`
      );
    }

    // Provide tips based on REM sleep
    if (averageRemSleep < 1.5) {
      if (isParentSelected) {
        tips.push(
          'Incorporate stress-reduction techniques such as meditation or deep-breathing exercises before bed to enhance REM sleep.'
        );
        tips.push(
          'Ensure your sleep environment is comfortable, cool, and dark to promote deeper REM sleep.'
        );
        tips.push(
          'Avoid caffeine and sugary drinks before bedtime, as they can disrupt REM sleep.'
        );
      } else {
        tips.push(
          'Encourage your child to engage in calming activities like reading or gentle stretching before bed to enhance REM sleep.'
        );
        tips.push(
          "Make sure your child's sleep environment is comfortable, cool, and dark to promote deeper REM sleep."
        );
        tips.push(
          'Avoid giving your child caffeine or sugary drinks before bedtime, as they can disrupt REM sleep.'
        );
      }
    } else {
      tips.push(
        `${subjectCapitalized} REM sleep is within a healthy range. Keep up the current routine!`
      );
    }

    // Provide tips based on sleep latency
    if (averageSleepLatency > 20) {
      if (isParentSelected) {
        tips.push(
          'Limit screen time at least an hour before bed to help your mind wind down.'
        );
        tips.push(
          'Avoid heavy meals in the evening to reduce the time it takes to fall asleep.'
        );
        tips.push(
          'Consider engaging in relaxing activities like gentle stretching or listening to soothing music before bed.'
        );
      } else {
        tips.push(
          "Limit your child's screen time at least an hour before bed to help them wind down."
        );
        tips.push(
          "Avoid giving your child heavy meals in the evening to reduce the time it takes them to fall asleep."
        );
        tips.push(
          "Encourage relaxing activities like reading a story or listening to soothing music before your child's bedtime."
        );
      }
    } else {
      tips.push(
        `${possessiveCapitalized} fall${
          isParentSelected ? '' : 's'
        } asleep quickly, which is a good sign of healthy sleep patterns.`
      );
    }

    return tips;
  };

  const { averageTotalSleep, averageRemSleep, averageSleepLatency } =
    getAverages();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Settings Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>See Your Sleep</Text>
        <TouchableOpacity
          onPress={() => setSettingsModalVisible(true)}
          style={styles.settingsButton}
        >
          <Icon name="settings-outline" size={30} color="#800080" />
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => {
          setSettingsModalVisible(!settingsModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>More Information</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Take a Sleep Survey</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
                Delete Your Family Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSettingsModalVisible(!settingsModalVisible)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Frame and User Selection */}
      <View style={styles.groupContainer}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedTimeFrame === 0 && styles.selectedButton,
            ]}
            onPress={() => setSelectedTimeFrame(0)}
          >
            <Text style={styles.buttonText}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedTimeFrame === 1 && styles.selectedButton,
            ]}
            onPress={() => setSelectedTimeFrame(1)}
          >
            <Text style={styles.buttonText}>Month</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, selectedUser === 0 && styles.selectedButton]}
            onPress={() => setSelectedUser(0)}
          >
            <Text style={styles.buttonText}>Parent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedUser === 1 && styles.selectedButton]}
            onPress={() => setSelectedUser(1)}
          >
            <Text style={styles.buttonText}>Child</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Graphs for each metric */}
      {['totalSleep', 'remSleep', 'sleepLatency'].map((metric, idx) => (
        <View key={idx} style={styles.chartContainer}>
          {/* Chart Title */}
          <Text style={styles.chartTitle}>{metricTitles[metric]}</Text>

          {/* Line Chart */}
          <LineChart
            data={{
              labels: getLabels(),
              datasets: [{ data: getData(metric) }],
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix={metric === 'sleepLatency' ? 'm' : 'h'}
            chartConfig={{
              backgroundColor: '#F4F7F8',
              backgroundGradientFrom: '#F4F7F8',
              backgroundGradientTo: '#E0E0E0',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`,
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#800080',
              },
              hideLegend: true,
              hidePointsAtIndex: [],
              hideDots: false,
              hideAxes: true,
              hideGridLines: true,
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ))}

      {/* Averages Section */}
      <View style={styles.averagesContainer}>
        <Text style={styles.tipsHeaderText}>
          Averages for the {timeFrames[selectedTimeFrame]}
        </Text>
        <View style={styles.averageTextContainer}>
          <Text style={styles.averageText}>
            • Total Sleep: {averageTotalSleep} hours
          </Text>
          <Text style={styles.averageText}>
            • REM Sleep: {averageRemSleep} hours
          </Text>
          <Text style={styles.averageText}>
            • Sleep Latency: {averageSleepLatency} minutes
          </Text>
        </View>
      </View>

      {/* Sleep Tips Based on Data */}
      <View style={styles.sleepTipsContainer}>
        <Text style={styles.tipsHeaderText}>Data Informed Sleep Tips</Text>
        <View style={styles.tipTextContainer}>
          {getSleepTips().map((tip, idx) => (
            <Text key={idx} style={styles.tipText}>
              • {tip}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F7F8',
    alignItems: 'center',
    padding: 20,
  },
  // Header with Settings Button
  headerContainer: {
    width: '100%',
    alignItems: 'center', // Center the title horizontally
    marginBottom: 20,
    position: 'relative', // Allow absolute positioning within this container
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#800080',
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  groupContainer: {
    width: '100%',
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#800080',
    borderRadius: 10,
    padding: 2,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    height: 40,
  },
  selectedButton: {
    backgroundColor: '#800080',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#800080',
    textAlign: 'center',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  averagesContainer: {
    marginTop: 20,
    padding: 20, // Increased padding
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    width: '100%',
  },
  averageTextContainer: {
    marginTop: 10,
  },
  averageText: {
    fontSize: 18,
    color: '#36454F',
    marginBottom: 10, // Increased margin between lines
    lineHeight: 24, // Increased line height for better readability
    textAlign: 'left',
  },
  sleepTipsContainer: {
    marginTop: 30,
    padding: 20, // Increased padding
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    width: '100%',
  },
  tipTextContainer: {
    marginTop: 10,
  },
  tipsHeaderText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 15, // Increased bottom margin
    textAlign: 'center',
  },
  tipText: {
    fontSize: 18,
    color: '#36454F',
    marginBottom: 15, // Increased margin between tips
    lineHeight: 24, // Increased line height for better readability
    textAlign: 'left',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#36454F',
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    fontSize: 18,
    color: '#800080',
  },
});

export default ParentWelcomePage;
