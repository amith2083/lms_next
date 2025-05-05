import mongoose from 'mongoose'

export async function dbConnect(){

    try {
        return await mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING))
      
        
    } catch (error) {
        console.log(error)
    }
  
}