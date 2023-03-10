import mongoose from "mongoose";

const multilingualContent = new mongoose.Schema({
     kz: {
          type: String,
          required: true,
     },
     ru: {
          type: String,
          required: true,
     }
}, {_id: false});

const GeneralnformationSchema = new mongoose.Schema({
     phoneNumber: {
          type: String,
          required: true,
     },
     address: {
          type: multilingualContent,
          required: true,
     },
     mail: {
          type: String,
          required: true,
     },
     firstTitle: {
          type: String,
          required: true,
     },
     secondTitle: {
          type: multilingualContent,
          required: true,
     },
     additionalTitle: {
          type: multilingualContent,
          required: true,
     },
     instagramLink: {
          type: String,
          required: true,
     },
     facebookLink: {
          type: String, 
          required: true
     },
     bgImage: {
          type: String,
          required: false,
     },
     homeBgImage: {
          type: String,
          required: false
     }
});

export default mongoose.model('GeneralInformation', GeneralnformationSchema, "general_information");