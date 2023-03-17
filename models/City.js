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
}, {_id: false});

const CoordinatesSchema = new mongoose.Schema({
     horizontal: {
          type: Number, 
          required: true
     },
     vertical: {
          type: Number, 
          required: true
     }
}, {_id: false})

const CitySchema = new mongoose.Schema({
     name: {
          type: MultilingualSchema,
          required: true
     },
     content: {
          type: MultilingualSchema,
          required: true
     },
     link: {
          type: String,
          required: true
     },
     coordinates: {
          type: CoordinatesSchema,
          required: true
     },
     blog: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: 'Blog',
          required: true
     }
});

CitySchema.pre('save', function(next) {
     if(!this.blog.length) {
          this.blog = [];
     }
     next();
});

export default mongoose.model('City', CitySchema);