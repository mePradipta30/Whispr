import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async ()  =>{
    try{

        const connectedInstances = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n Connected to Database Successfully on port : ${connectedInstances.connection.host}`);
        
    }
    catch(error)
    {
        console.log("error",error);
        process.exit(1)
        
    }
}

export default connectDB