import React from 'react';
import { I18nManager, StyleSheet, Text, ViewProps } from 'react-native';

const styles = StyleSheet.create({
  defaultStyle: I18nManager.isRTL ? { writingDirection: 'rtl' } : { writingDirection: 'ltr' },
});

export type RTLTextComponentProps = ViewProps;

export const RTLTextComponent: React.FC<RTLTextComponentProps> = (props) => {
  const { children, style, ...rest } = props;
  return (
    <Text {...rest} style={[style, styles.defaultStyle]}>
      {children}
    </Text>
  );
};
