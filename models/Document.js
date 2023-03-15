import mongoose from 'mongoose';

const MultilingualSchema = new mongoose.Schema({
     kz: {
          type: String,
          required: true,
     },
     ru: {
          type: String,
          required: true,
     },
     en: {
          type: String,
          required: true,
     }
}, {_id: false})

const DocumentSchema = new mongoose.Schema({
     name: {
          type: MultilingualSchema,
          required: true
     },
     documentCategory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DocumentCategory',
          required: true
     },
     link: {
          type: String,
          required: true,
     },
     filename: {
          type: String,
          required: true
     }
});


export default mongoose.model('Document', DocumentSchema);