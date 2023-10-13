import mongoose from 'mongoose';

export async function connectToMongoDB() {
  try {
    const localDBURI = '';
    await mongoose.connect(localDBURI, {
      useNewUrlParser: true,
    }as any);
    console.log('MongoDB Connection Succeeded on atlas.');
    return true; 
  } catch (error) {
    console.error('Error in DB connection:', error);
    return false; 
  }
}
