import ActivityLog, { ActivityType } from '../models/ActivityLog';

export async function logActivity(options: {
  userId: string;
  type: ActivityType;
  message: string;
  meta?: Record<string, any>;
}) {
  const { userId, type, message, meta } = options;
  await ActivityLog.create({
    userId,
    type,
    message,
    meta
  });
}

export async function listMyActivities(userId: string, limit = 20) {
  return ActivityLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
}
