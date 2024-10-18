import React from 'react';
import { View } from 'react-native';

const Pillow = (props) => {
  if (!props.body || !props.size) {
    return null;
  }

  const width = props.size[0] * 1.2; // Make the pillow wider
  const height = props.size[1] * 0.7; // Make the pillow thinner
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <>
      {/* Main Pillow Body */} 
      <View
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: width,
          height: height,
          backgroundColor: '#6BCB77', // Appealing green color for the pillow
          borderRadius: 15, // Rounded corners to mimic softness
          borderColor: '#4CAF50', // Darker green border for a pillow-like effect
          borderWidth: 3, // Slightly thicker border to define the pillow edges
          shadowColor: '#000',
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 5, // Add shadow to give a pillow-like depth
        }}
      />

      {/* Pillow Top Bulge */}
      <View
        style={{
          position: 'absolute',
          left: x + 5, // Slightly offset to give depth
          top: y + 5,
          width: width - 10,
          height: height - 10,
          backgroundColor: '#A1E3A1', // Lighter shade of green for the "bulge" effect
          borderRadius: 10, // Rounded corners for a soft top layer
          opacity: 0.7, // Slight transparency to simulate the top bulge
        }}
      />
    </>
  );
};

export default Pillow;
