import mongoose from 'mongoose';


export const connect = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log("MongoDB: Kết nối mặc định đã sẵn sàng.");
        return mongoose.connection;
    }

    try {
        const uri = process.env.MONGO_URI;
        console.log("MongoDB: Đang cố gắng kết nối mặc định tới:", uri);
        mongoose.set('bufferCommands', true);
        mongoose.set('autoIndex', true);

        await mongoose.connect(uri, {
            maxPoolSize: 20,
            minPoolSize: 1,
            connectTimeoutMS: 60000,        
            serverSelectionTimeoutMS: 60000,        
            maxIdleTimeMS: 60000,
            bufferTimeoutMS: 60000,
        });

        console.log("MongoDB local kết nối mặc định thành công!");
        console.log("MongoDB: Trạng thái kết nối mặc định:", mongoose.connection.readyState);
        console.log("DEBUG: URI của kết nối mặc định:", mongoose.connection.client.s.url);
        console.log("DEBUG: SocketTimeoutMS của kết nối mặc định:", mongoose.connection.client.s.options.socketTimeoutMS);
        console.log("DEBUG: BufferTimeoutMS của kết nối mặc định:", mongoose.connection.client.s.options.bufferTimeoutMS);

        global.__TEST_DB_CONNECTION__ = mongoose.connection;

        return mongoose.connection;
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error.message);
        throw error;
    }
};

export const closeDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        console.log('MongoDB: Đã xóa database.');
        await mongoose.connection.close();
        console.log('MongoDB: Đã ngắt kết nối Mongoose.');
    }
    delete global.__TEST_DB_CONNECTION__;
};

export const clearDatabase = async () => {
    if (mongoose.connection.readyState !== 1) {
        await connect();
    }

    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        try {
            await collection.deleteMany({});
        } catch (error) {
            if (!error.message.includes('a system collection')) {
                console.warn(`Warning: Không thể xóa collection ${key}: ${error.message}`);
            }
        }
    }
    console.log('MongoDB: Đã xóa dữ liệu tất cả collection.');
};

export default { connect, closeDatabase, clearDatabase };