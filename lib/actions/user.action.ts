import { connectToDatabase } from '../database/mongoose';
import User from '../database/models/user.model';
import { CreateUserParams } from '@/types';

export async function createUser(user: CreateUserParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { clerkId: user.clerkId },
        { email: user.email }
      ]
    });

    // If user exists, return the existing user
    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const newUser = await User.create({
      clerkId: user.clerkId,
      email: user.email,
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      photo: user.photo || '',
      planId: 1,
      creditBalance: 10
    });

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// You can add more user-related actions here in the future
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    
    const user = await User.findById(userId);
    
    if (!user) throw new Error('User not found');
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}


