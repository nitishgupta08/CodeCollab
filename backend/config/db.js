const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGO_LOCAL_URI)
        console.log(`MongoDB Conected: ${conn.connection.host}`.cyan.underline)

    }catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB