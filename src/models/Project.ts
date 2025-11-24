import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  color?: string;      // 小标签颜色，例如 #FF0000
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Project = model<IProject>('Project', projectSchema);
export default Project;
