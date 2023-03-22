import mongoose from 'mongoose';


const PartnerSchema = new mongoose.Schema({
     kzTitle: {
          type: String,
          required: true
     },
     ruTitle: {
          type: String,
          required: true
     },
     enTitle: {
          type: String,
          required: true
     },
     link: {
          type: String,
          required: false
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

export default mongoose.model('Partner', PartnerSchema);