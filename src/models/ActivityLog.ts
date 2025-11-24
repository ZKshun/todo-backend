import { Schema, model, Document, Types } from 'mongoose';

export type ActivityType =
  | 'todo_created'
  | 'todo_updated'
  | 'todo_deleted'
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'user_login';

export interface IActivityLog extends Document {
  userId: Types.ObjectId;
  type: ActivityType;
  message: string;
  meta?: Record<string, any>;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ActivityLog = model<IActivityLog>('ActivityLog', activityLogSchema);
export default ActivityLog;
