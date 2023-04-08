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

const PagePartSchema = new mongoose.Schema({
     pageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'NestedPage',
          required: true
     },
     title: {
          type: MultilingualSchema,
          required: true
     },
     link: {
          type: String,
          required: true,
     },
     isListOfDocuments: {
          type: Boolean,
          required: false
     },
     content: {
          type: MultilingualSchema,
          required: function() {
               return !this.isListOfDocuments;
          }
     },
     documents: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: 'Document',
          required: function () {
               return this.isListOfDocuments;
          }
     }
}, {
     timestamps: true
});

export default mongoose.model('PagePart', PagePartSchema);