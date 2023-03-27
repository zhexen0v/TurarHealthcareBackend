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
     },
     orderNumber: {
          type: Number,
          required: false,
          min: 1
     }
}, {
     timestamps: true
});

export default mongoose.model('NestedPage', NestedPageSchema);