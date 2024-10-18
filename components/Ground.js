// components/Ground.js

import React from 'react';
import { View } from 'react-native';

const Ground = (props) => {
  if (!props.body || !props.size) {
    return null;
  }

  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  // Add grass effect by using a green background with a top border
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: props.color || 'green',
        borderTopWidth: 5,
        borderTopColor: '#006400', // Darker green for grass blades
      }}
    />
  );
};

export default Ground;
