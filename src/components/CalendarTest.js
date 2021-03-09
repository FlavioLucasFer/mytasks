import React from 'react';
import { View, Button, Platform } from 'react-native';

import moment from 'moment-timezone';
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';

export default class CalendarTest extends React.Component {
  _updateAlarm = async () => {
    const calendarId = await this._createNewCalendar();
    const event = {
      title: 'test title',
      notes: 'test notes',
      startDate: moment('2021-02-22T17:36:00.0Z')
        .add(1, 'm')
        .toDate(),
      endDate: moment('2021-02-22T17:36:00.0Z')
        .tz(Localization.timezone)
        .add(5, 'm')
        .toDate(),
      timeZone: Localization.timezone,
      alarms: [{ method: Calendar.AlarmMethod.DEFAULT }]
    };

    try {
      const createEventAsyncRes = await Calendar.createEventAsync(
        calendarId.toString(),
        event
      );

      try {
        await Calendar.getEventAsync(createEventAsyncRes.toString()
        );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  _findCalendars = async () => {
    const calendars = await Calendar.getCalendarsAsync();

    return calendars;
  };

  _createNewCalendar = async () => {
    const calendars = await this._findCalendars();
    const newCalendar = {
      title: 'test',
      entityType: Calendar.EntityTypes.EVENT,
      color: '#2196F3',
      sourceId:
        Platform.OS === 'ios'
          ? calendars.find(cal => cal.source && cal.source.name === 'Default')
            .source.id
          : undefined,
      source:
        Platform.OS === 'android'
          ? {
            name: calendars.find(
              cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
            ).source.name,
            isLocalAccount: true,
          }
          : undefined,
      name: 'test',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
      ownerAccount:
        Platform.OS === 'android'
          ? calendars.find(
            cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
          ).ownerAccount
          : undefined,
    };

    let calendarId = null;

    try {
      calendarId = await Calendar.createCalendarAsync(newCalendar);
    } catch (e) {
      Alert.alert(e.message);
    }

    return calendarId;
  };

  render() {
    return (
      <View style={{ marginTop: 100 }}>
        <Button title='press here'
          onPress={() => {
            this._updateAlarm();
          }} />
      </View>
    );
  }
}