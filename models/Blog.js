import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
     title: {
          type: String,
          required: true,
     },
     content: {
          type: String,
          required: true,
     },
}, {_id: false})

const BlogSchema = new mongoose.Schema({
     kz: {
          type: ContentSchema,
          required: true
     },
     ru: {
          type: ContentSchema,
          required: true
     },
     en: {
          type: ContentSchema,
          required: true
     },
     imageUrl: {
          type: String,
          required: true,
     }
},
{
     timestamps: true
}
);

export default mongoose.model('Blog', BlogSchema, "blog");