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

const ParentPageSchema = new mongoose.Schema({
     title: {
          type: MultilingualSchema,
          required: true
     },
     isNested: {
          type: Boolean,
          required: true
     },
     nestedPages: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: 'NestedPage',
          required: false
     },
     content: {
          type: MultilingualSchema,
          required: false
     },
     isListOfDocuments: {
          type: Boolean,
          required: false
     },
     content: {
          type: MultilingualSchema,
          required: false
     },
     documents: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: 'Document',
          required: false
     },
     link: {
          type: String,
          required: true,
     }
},
{
     timestamps: true
});

ParentPageSchema.pre('save', function(next) {
     if(this.isNested && !this.nestedPages.length) {
          this.nestedPages = [];
     }
     next();
});

export default mongoose.model('ParentPage', ParentPageSchema);