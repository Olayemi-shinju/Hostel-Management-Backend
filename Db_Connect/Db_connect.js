import mongoose from "mongoose";

export const Db_connect = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log('Server Conntected', connect.connection.host)
    } catch (error) {
        console.log(error)
    }
}