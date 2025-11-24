import UserSettings from '../models/UserSettings';

export async function getSettings(userId: string) {
  let settings = await UserSettings.findOne({ userId });
  if (!settings) {
    settings = await UserSettings.create({ userId });
  }
  return settings;
}

export async function updateSettings(
  userId: string,
  payload: {
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      inApp?: boolean;
    };
  }
) {
  const settings = await UserSettings.findOneAndUpdate(
    { userId },
    { $set: payload },
    { new: true, upsert: true }
  );
  return settings;
}
