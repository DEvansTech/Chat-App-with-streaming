import React from 'react';
import { Text } from 'react-native';

const EmptyStateIndicator = ({ listType }) => {
  switch (listType) {
    case 'channel':
      return <Text>You have no channels currently</Text>;
    case 'message':
      return null;
    default:
      return <Text>No items exist</Text>;
  }
};

export default EmptyStateIndicator;
