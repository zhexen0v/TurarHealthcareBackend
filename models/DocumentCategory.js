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

const DocumentCategorySchema = new mongoose.Schema({
     title: {
          type: MultilingualSchema,
          required: true
     },
     documents: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: 'Document',
          required: true,
          default: []
     },
     link: {
          type: String,
          required: true,
     }
});


export default mongoose.model('DocumentCategory', DocumentCategorySchema);