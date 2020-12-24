import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../../contexts/themeContext/ThemeContext';
import { useTranslationContext } from '../../contexts/translationContext/TranslationContext';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
  },
  retryText: {
    fontSize: 30,
    fontWeight: '600',
  },
});

type LoadingErrorWrapperProps = {
  text: string;
  onPress?: () => void;
};

const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = (props) => {
  const { children, onPress, text } = props;

  const {
    theme: {
      loadingErrorIndicator: { container, errorText },
    },
  } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, container]}>
      <Text style={[styles.errorText, errorText]} testID='loading-error'>
        {text}
      </Text>
      {children}
    </TouchableOpacity>
  );
};

export type LoadingErrorProps = {
  error?: boolean;
  listType?: 'channel' | 'message' | 'default';
  loadNextPage?: () => Promise<void>;
  retry?: () => void;
};

export const LoadingErrorIndicator: React.FC<LoadingErrorProps> = (props) => {
  const { listType, retry = () => null } = props;

  const {
    theme: {
      loadingErrorIndicator: { retryText },
    },
  } = useTheme();
  const { t } = useTranslationContext();

  switch (listType) {
    case 'channel':
      return (
        <LoadingErrorWrapper
          onPress={retry}
          text={t('Error loading channel list...')}
        >
          <Text style={[styles.retryText, retryText]}>⟳</Text>
        </LoadingErrorWrapper>
      );
    case 'message':
      return (
        <LoadingErrorWrapper
          text={t('Error loading messages for this channel...')}
        />
      );
    default:
      return <LoadingErrorWrapper text={t('Error loading')} />;
  }
};

LoadingErrorIndicator.displayName =
  'LoadingErrorIndicator{loadingErrorIndicator}';
