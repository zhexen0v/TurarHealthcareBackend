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

const NestedPageSchema = new mongoose.Schema({
     parentPage: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ParentPage',
          required: true
     },
     title: {
          type: MultilingualSchema,
          required: true
     },
     content: {
          type: MultilingualSchema,
          required: true
     },
     link: {
          type: String,
          required: true,
     }
},
{
     timestamps: true
}
);

export default mongoose.model('NestedPage', NestedPageSchema);