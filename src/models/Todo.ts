// src/models/Todo.ts
import { Schema, model, Document, Types } from 'mongoose';

export type TodoPriority = 'low' | 'medium' | 'high';

export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  userId: Types.ObjectId;
  projectId?: Types.ObjectId | null;
  dueDate?: Date | null;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    dueDate: { type: Date, default: null },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  { timestamps: true }
);

const Todo = model<ITodo>('Todo', todoSchema);
export default Todo;
