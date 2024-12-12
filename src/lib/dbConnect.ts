import mongoose from 'mongoose';

type ConnectionObject = {
  isConnection?: number; 
}

const connection: ConnectionObject = {};

async function dbConnect():Promise<void> {
  if(connection.isConnection){
    console.log('Already connected to database');
    return; 
  } 

  try {
   const db = await mongoose.connect(process.env.MONGODB_URI || '', {}); 

   connection.isConnection = db.connections[0].readyState;
   console.log('Database connected successfully');
   
  } catch (err) {
   console.log('Database connection failed: ',err);
   process.exit(1);
  }
}

export default dbConnect;
