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
     pageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'NestedPage',
          required: false
     },
     pagePartId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PagePart',
          required: false
     },
     parentPageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ParentPage',
          required: false
     },
     filename: {
          type: String,
          required: true
     },
});


export default mongoose.model('Document', DocumentSchema);