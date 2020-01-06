import React from 'react';
import styled from '@stream-io/styled-components';
import Moment from 'moment';
import { themed } from '../styles/theme';
import PropTypes from 'prop-types';

const Container = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20;
  margin-bottom: 20;
  ${({ theme }) => theme.messageList.dateSeparator.container.css}
`;

const Line = styled.View`
  flex: 1;
  height: 0.5;
  background-color: ${({ theme }) => theme.colors.light};
  ${({ theme }) => theme.messageList.dateSeparator.line.css}
`;

const DateText = styled.Text`
  margin-left: 5;
  margin-right: 5;
  text-align: center;
  text-transform: uppercase;
  font-size: 10;
  opacity: 0.8;
  ${({ theme }) => theme.messageList.dateSeparator.dateText.css}
`;

const Date = styled.Text`
  font-weight: 700;
  font-size: 10;
  text-transform: uppercase;
  opacity: 0.8;
  ${({ theme }) => theme.messageList.dateSeparator.date.css}
`;

/**
 * @extends PureComponent
 * @example ./docs/DateSeparator.md
 */

export const DateSeparator = themed(
  class DateSeparator extends React.PureComponent {
    static propTypes = {
      message: PropTypes.object.isRequired,
      /**
       * Formatter function for date object.
       *
       * @param date Date object of message
       * @returns string
       */
      formatDate: PropTypes.func,
    };

    static themePath = 'messageList.dateSeparator';

    render() {
      const { message, formatDate } = this.props;

      return (
        <Container>
          <Line />
          <DateText>
            {formatDate ? (
              formatDate(message.date)
            ) : (
              <React.Fragment>
                <Date>{Moment(message.date).format('dddd')}</Date> at{' '}
                {Moment(message.date).format('hh:mm A')}
              </React.Fragment>
            )}
          </DateText>
          <Line />
        </Container>
      );
    }
  },
);
