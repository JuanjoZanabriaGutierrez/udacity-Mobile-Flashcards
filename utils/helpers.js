import { AsyncStorage } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const NOTIFICATION_KEY = 'UdaciCards:notifications';

export async function clearAsyncStorage() {
	await AsyncStorage.clear();
	alert('AsyncStorage cleared, reload app!');
}

export function clearLocalNotification() {
	return AsyncStorage.removeItem(NOTIFICATION_KEY).then(
		Notifications.cancelAllScheduledNotificationsAsync()
	);
}

function createNotification() {
	return {
		title: 'Hello!',
		body: "Don't forget to play today!",
		ios: {
			sound: true
		},
		android: {
			sound: true,
			priority: 'high',
			sticky: false,
			vibrate: true
		}
	};
}

export function setLocalNotification(day) {
	AsyncStorage.getItem(NOTIFICATION_KEY)
		.then(JSON.parse)
		.then((data) => {
			if (data === null) {
				Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
					if (status === 'granted') {
						Notifications.cancelAllScheduledNotificationsAsync();
						let tomorrow = new Date();
						tomorrow.setDate(tomorrow.getDate() + 1);
						tomorrow.setHours(18);
						tomorrow.setMinutes(0);
						Notifications.scheduleLocalNotificationAsync(createNotification(), {
							time: tomorrow,
							repeat: 'day'
						});
						AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
					}
				});
			}
		});
}
