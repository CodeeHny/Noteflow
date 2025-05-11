import mongoose from "mongoose";

const connectDB = async () => {
    try {
        let connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`);
        console.log(`\n MongoDB connected succesfully !!! || Host : `, (await connectionInstance).connection.host)
    } catch (error) {
        console.log("Error while connecting to database ", error)
    }
}

export default connectDB


// codee195
// # NNBHtnjXMjPb49tJ