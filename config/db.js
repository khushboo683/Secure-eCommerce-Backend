import mongoose from 'mongoose'

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
          useNewUrlParser: true,
        });
        console.log('MongoDB connected');
      } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
      }
}