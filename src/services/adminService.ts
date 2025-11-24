// services/adminService.js
import User from '../models/User';

export async function listUsers() {
  return User.find().select('-password');
}