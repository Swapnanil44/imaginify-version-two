"use server"
import { connectToDatabase } from '../database/mongoose';
import User from '../database/models/user.model';
import { revalidatePath } from "next/cache";

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

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({clerkId: userId})
    
    if (!user) throw new Error('User not found');
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.log(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    )

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    console.log(error);
  }
}

