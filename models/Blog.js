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

const BlogSchema = new mongoose.Schema({
     title: {
          type: MultilingualSchema,
          required: true,
     },
     content: {
          type: MultilingualSchema,
          required: true,
     },
     imageUrl: {
          type: String,
          required: true,
     },
     isRelatedToCity: {
          type: Boolean, 
          required: true
     },
     city: {
          type: mongoose.Schema.Types.ObjectId,
          required: function() {
               return this.isRelatedToCity;
          }
     }   
}, {
     timestamps: true
});

export default mongoose.model('Blog', BlogSchema, "blog");