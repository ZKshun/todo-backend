import Project from '../models/Project';
import Todo from '../models/Todo';
import { createError } from '../utils/errors';

export async function listProjects(userId: string) {
  return Project.find({ userId }).sort({ createdAt: -1 });
}

export async function createProject(
  userId: string,
  payload: { name: string; description?: string; color?: string }
) {
  const project = await Project.create({
    ...payload,
    userId
  });
  return project;
}

export async function getProject(userId: string, projectId: string) {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw createError(404, '项目未找到');
  }
  return project;
}

export async function updateProject(
  userId: string,
  projectId: string,
  payload: { name?: string; description?: string; color?: string }
) {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, userId },
    { $set: payload },
    { new: true }
  );

  if (!project) {
    throw createError(404, '项目未找到');
  }

  return project;
}

// 删除项目时，可以选择：
// - 级联把项目下的 todos 删除
// - 或仅仅把 todos 的 projectId 置空
export async function deleteProject(userId: string, projectId: string) {
  const project = await Project.findOneAndDelete({ _id: projectId, userId });
  if (!project) {
    throw createError(404, '项目未找到');
  }

  // 这里示例：把 todos 的 projectId 置空
  await Todo.updateMany(
    { userId, projectId },
    { $set: { projectId: null } }
  );
}
