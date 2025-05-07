import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Trophy } from 'lucide-react';

declare global {
  interface Window {
    OneSignal: any;
  }
}

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    workout_reminders: false,
    achievement_notifications: false,
    leaderboard_updates: false,
  });

  useEffect(() => {
    // Load existing OneSignal tags (user preferences)
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      const tags = await OneSignal.getTags();
      setSettings({
        workout_reminders: tags.workout_reminders === 'true',
        achievement_notifications: tags.achievement_notifications === 'true',
        leaderboard_updates: tags.leaderboard_updates === 'true',
      });
    });
  }, []);

  const handleChange = (setting: keyof typeof settings) => {
    const newValue = !settings[setting];
    setSettings((prev) => ({
      ...prev,
      [setting]: newValue,
    }));

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      // Prompt for permission if not granted
      const permission = await OneSignal.Notification.permission;
      if (permission !== 'granted') {
        await OneSignal.showSlidedownPrompt();
      }

      // Set a tag like { "workout_reminders": "true" } or "false"
      await OneSignal.sendTag(setting, newValue.toString());
    });
  };

  const renderToggle = (settingKey: keyof typeof settings, icon: JSX.Element, title: string, desc: string) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="font-medium dark:text-gray-100">{title}</p>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => handleChange(settingKey)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          settings[settingKey] ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            settings[settingKey] ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-darkBackground dark:text-gray-100 rounded-lg shadow-md p-6 transition-all duration-300">
      <h2 className="text-xl font-bold dark:text-gray-100 mb-4">Notification Settings</h2>
      <div className="space-y-4">
        {renderToggle(
          'workout_reminders',
          <Bell className="h-5 w-5 text-indigo-600" />,
          'Workout Reminders',
          'Get notified about your scheduled workouts'
        )}
        {renderToggle(
          'achievement_notifications',
          <Trophy className="h-5 w-5 text-indigo-600" />,
          'Achievement Notifications',
          'Get notified when you reach new milestones'
        )}
        {renderToggle(
          'leaderboard_updates',
          <Calendar className="h-5 w-5 text-indigo-600" />,
          'Leaderboard Updates',
          'Get notified about leaderboard changes'
        )}
      </div>
    </div>
  );
}
