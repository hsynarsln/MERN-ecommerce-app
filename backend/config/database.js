import mongoose from 'mongoose';

const connectDatabase = () => {
  mongoose
    .connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(data => console.log(`Mongodb connected with server : ${data.connection.host}`))
    .catch(error => console.log(error.message));
};

export default connectDatabase;
