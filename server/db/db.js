import mongoose from "mongoose";



async function connect() {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MONGODB connection FAILDED: ", error);
        process.exit(1);
    }
}


export default connect