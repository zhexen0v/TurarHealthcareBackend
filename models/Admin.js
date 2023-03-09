import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     surname: {
          type: String,
          required: true
     },
     username: {
          type: String,
          required: true
     },
     hashedPassword: {
          type: String,
          required: true,
     },
},
{
     timestamps: true
}
);

export default mongoose.model('Admin', AdminSchema);