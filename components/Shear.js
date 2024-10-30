import React from 'react';
import { View, StyleSheet } from 'react-native';

const Shear = (props) => {
  if (!props.body || !props.size) {
    return null;
  }

  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const bladeHeight = height * 0.65; // Blade part will be the top 65% of the shear
  const handleHeight = height * 0.35; // Handle part will be the bottom 35%
  const handleWidth = width * 0.55; // Slightly larger handles compared to blades

  const styles = StyleSheet.create({
    title: {
      color: '#800080',
      // ... rest of title styles
    },
    questionnaireTitle: {
      color: '#800080',
      // ... rest of questionnaireTitle styles
    },
    subTitle: {
      color: '#800080',
      // ... rest of subTitle styles
    },
    checkbox: {
      borderColor: '#800080',
      // ... rest of checkbox styles
    },
    checkedCheckbox: {
      backgroundColor: '#800080',
    },
    selectedButton: {
      backgroundColor: '#800080',
    },
    saveButton: {
      backgroundColor: '#800080',
      // ... rest of saveButton styles
    },
  });

  return (
    <>
      {/* Shear Blades */}
      <View
        style={{
          position: 'absolute',
          left: x + width * 0.05, // Slight offset to mimic overlap of blades
          top: y,
          width: width * 0.9, // Slightly narrower than full width
          height: bladeHeight,
          backgroundColor: 'silver', // Blade color
          borderTopLeftRadius: width * 0.45, // Rounded top-left edge for blade curvature
          borderTopRightRadius: width * 0.45, // Rounded top-right edge
          borderBottomLeftRadius: 20, // Tapered bottom part of the blade
          borderBottomRightRadius: 20, // Tapered bottom
          borderColor: '#666', // Darker gray for blade outline
          borderWidth: 2,
          transform: [{ rotate: '20deg' }], // Adds rotation for more realism
        }}
      />

      {/* Second Blade for Overlap */}
      <View
        style={{
          position: 'absolute',
          left: x - width * 0.05, // Offset slightly to overlap the blades
          top: y,
          width: width * 0.9,
          height: bladeHeight,
          backgroundColor: 'silver', // Blade color
          borderTopLeftRadius: width * 0.45,
          borderTopRightRadius: width * 0.45,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          borderColor: '#666',
          borderWidth: 2,
          transform: [{ rotate: '-20deg' }], // Opposite rotation for overlap
        }}
      />

      {/* Shear Handles (Left) */}
      <View
        style={{
          position: 'absolute',
          left: x + width * 0.15, // Positioned relative to the blade
          top: y + bladeHeight,
          width: handleWidth,
          height: handleHeight,
          backgroundColor: '#B22222', // Dark red color for the handle
          borderBottomLeftRadius: handleWidth * 1.5, // Oval handle shape
          borderBottomRightRadius: handleWidth * 1.5,
          borderColor: '#000', // Black border for handles
          borderWidth: 2,
        }}
      />

      {/* Shear Handles (Right) */}
      <View
        style={{
          position: 'absolute',
          left: x + width * 0.25, // Offset slightly for second handle
          top: y + bladeHeight,
          width: handleWidth,
          height: handleHeight,
          backgroundColor: '#B22222',
          borderBottomLeftRadius: handleWidth * 1.5,
          borderBottomRightRadius: handleWidth * 1.5,
          borderColor: '#000',
          borderWidth: 2,
        }}
      />
    </>
  );
};

export default Shear;
