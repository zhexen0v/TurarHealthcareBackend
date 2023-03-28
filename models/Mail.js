import mongoose from 'mongoose';

const SenderDataSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
     surname: {
          type: String,
          required: true,
     },
     email: {
          type: String,
          required: true,
     }
}, {_id: false})

const MailSchema = new mongoose.Schema({
     senderData: {
          type: SenderDataSchema,
          required: true
     },
     message: {
          type: String,
          required: true
     },
     files: {
          type: [String],
          required: false
     },
     answer: {
          type: String,
          required: false
     },
     access: {
          type: Boolean,
          required: true
     }
}, {
     timestamps: true
});


export default mongoose.model('Mail', MailSchema);