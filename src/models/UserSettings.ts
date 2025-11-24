import { Schema, model, Document, Types } from 'mongoose';

export interface IUserSettings extends Document {
  userId: Types.ObjectId;
  language: string;       // e.g. 'zh-CN' | 'en-US'
  timezone: string;       // e.g. 'Asia/Shanghai'
  notifications: {
    email: boolean;
    inApp: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    language: { type: String, default: 'zh-CN' },
    timezone: { type: String, default: 'Asia/Shanghai' },
    notifications: {
      email: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

const UserSettings = model<IUserSettings>('UserSettings', userSettingsSchema);
export default UserSettings;
