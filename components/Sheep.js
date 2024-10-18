// components/Sheep.js

import React from 'react';
import { View } from 'react-native';

const Sheep = (props) => {
  if (!props.body || !props.size) {
    return null;
  }

  // Adjust width and height to make the sheep slightly less wide and shorter
  const width = props.size[0] * 1.1; // Make the body less wide
  const height = props.size[1] * 0.6; // Keep the body a bit shorter
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const headSize = width / 3; // Head size
  const legWidth = width / 8; // Leg width
  const legHeight = height / 2.5; // Leg height
  const earSize = headSize / 3; // Ear size
  const tailSize = width / 6; // Tail size
  const eyeSize = headSize / 3; // Eye size
  const pupilSize = eyeSize / 2.5; // Pupil size (adjusted for larger eyes)

  return (
    <>
      {/* Sheep Body (Oval) */}
      <View
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: width,
          height: height,
          backgroundColor: 'white',
          borderRadius: width / 2,
          borderColor: '#000',
          borderWidth: 2,
        }}
      />

      {/* Sheep Head (Black Circle) */}
      <View
        style={{
          position: 'absolute',
          left: x - headSize / 2 + width + 5, // Shifted slightly right
          top: y + height / 2 - headSize / 2,
          width: headSize,
          height: headSize,
          backgroundColor: 'black',
          borderRadius: headSize / 2,
          borderColor: '#000',
          borderWidth: 2,
        }}
      />

      {/* Sheep Ear (Black Semi-Circle, shifted right) */}
      <View
        style={{
          position: 'absolute',
          left: x - headSize / 2 + width + earSize / 2 + 5, // Shifted right to align with head
          top: y + height / 2 - headSize / 2 - earSize / 2,
          width: earSize,
          height: earSize,
          backgroundColor: 'black',
          borderTopLeftRadius: earSize / 2,
          borderTopRightRadius: earSize / 2,
        }}
      />

      {/* Sheep Tail (Small Oval) */}
      <View
        style={{
          position: 'absolute',
          left: x - tailSize / 2, // Positioned at the back of the body
          top: y + height / 2 - tailSize / 2,
          width: tailSize,
          height: tailSize * 0.6, // Oval-shaped tail
          backgroundColor: 'white',
          borderRadius: tailSize / 2,
          borderColor: '#000',
          borderWidth: 2,
        }}
      />

      {/* Front Left Leg */}
      <View
        style={{
          position: 'absolute',
          left: x + legWidth,
          top: y + height - legHeight / 2,
          width: legWidth,
          height: legHeight,
          backgroundColor: 'black',
          borderRadius: legWidth / 2,
        }}
      />

      {/* Back Left Leg */}
      <View
        style={{
          position: 'absolute',
          left: x + width - legWidth * 2,
          top: y + height - legHeight / 2,
          width: legWidth,
          height: legHeight,
          backgroundColor: 'black',
          borderRadius: legWidth / 2,
        }}
      />

      {/* Sheep Eye (Shifted right) */}
      <View
        style={{
          position: 'absolute',
          left: x - headSize / 2 + width + eyeSize / 2 + 10, // Shifted to the right
          top: y + height / 2 - headSize / 4,
          width: eyeSize,
          height: eyeSize,
          backgroundColor: 'white',
          borderRadius: eyeSize / 2,
          borderColor: '#000',
          borderWidth: 1,
        }}
      />

      {/* Pupil for the Eye */}
      <View
        style={{
          position: 'absolute',
          left: x - headSize / 2 + width + eyeSize + 10, // Center the pupil in the eye
          top: y + height / 2 - headSize / 4 + eyeSize / 4,
          width: pupilSize,
          height: pupilSize,
          backgroundColor: 'black',
          borderRadius: pupilSize / 2,
        }}
      />
    </>
  );
};

export default Sheep;
