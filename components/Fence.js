import React from 'react';
import { View } from 'react-native';

const Fence = (props) => {
  if (!props.body || !props.size) {
    return null;
  }

  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  // Reduce post size by 18%
  const postWidth = ((width / 4) * 2) * 0.82; // Reduced width
  const postHeight = height * 0.82; // Reduced height
  const gapBetweenPosts = 10; // Gap between posts remains unchanged
  const triangleHeight = 20; // Triangle height remains unchanged
  const boardThickness = 10; // Thickness of the horizontal boards remains unchanged

  return (
    <>
      {/* Fence Posts (Reduced by 18%) */}
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: x + index * (postWidth + gapBetweenPosts),
            top: y + triangleHeight,
            width: postWidth,
            height: postHeight - triangleHeight,
            backgroundColor: 'white',
          }}
        />
      ))}

      {/* Triangle tops for the posts (flush with the top) */}
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={`triangle_${index}`}
          style={{
            position: 'absolute',
            left: x + index * (postWidth + gapBetweenPosts), // Align the triangle with the post
            top: y, // Now flush with the top of the post
            width: 0,
            height: 0,
            borderLeftWidth: postWidth / 2, // Adjust width to match post size
            borderRightWidth: postWidth / 2,
            borderBottomWidth: triangleHeight,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'white',
          }}
        />
      ))}

      {/* Upper horizontal board connecting all posts */}
      <View
        style={{
          position: 'absolute',
          left: x,
          top: y + postHeight / 3, // Slightly above the middle
          width: postWidth * 4 + gapBetweenPosts * 3, // Span across all 4 posts
          height: boardThickness,
          backgroundColor: 'white',
        }}
      />

      {/* Lower horizontal board connecting all posts */}
      <View
        style={{
          position: 'absolute',
          left: x,
          top: y + postHeight / 1.5, // Slightly below the middle
          width: postWidth * 4 + gapBetweenPosts * 3, // Span across all 4 posts
          height: boardThickness,
          backgroundColor: 'white',
        }}
      />
    </>
  );
};

export default Fence;
