import mongoose from 'mongoose';
import fs from 'fs';
// Paths to certificate files
const caCertPath = 'C:/Users/Hp/certs/ca-cert.pem';
const serverCertPath = 'C:/Users/Hp/certs/server.cert';
const serverKeyPath = 'C:/Users/Hp/certs/server.key';
export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            tls: true,
            tlsCAFile: 'C:/Users/Hp/certs/ca-cert.pem',
            tlsCertificateKeyFile: 'C:/Users/Hp/certs/server.cert',
            tlsCertificateKeyFile: 'C:/Users/Hp/certs/server.key',
  useNewUrlParser: true,

        });
        console.log('MongoDB connected');
      } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
      }
}