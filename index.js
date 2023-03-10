import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { AdminController, GeneralInformationController, BlogController, PartnerController } from './controllers/AllControllers.js';
import { adminRegisterValidator, adminLoginValidator } from './validators/adminValidator.js';
import { updateGeneralInformtaionValidator } from './validators/generalInformationValidator.js';
import { blogUpdateValidator } from './validators/blogValidator.js';
import { addOrUpdatePartner } from './validators/partnerValidator.js';
import checkAuthAdmin from './middlewares/checkAuthAdmin.js';
import multer from 'multer';

mongoose.set("strictQuery", false);
mongoose.connect(
     'mongodb+srv://admin:fDJOm5IhWXOwd0Hp@cluster0.5cekcxl.mongodb.net/TurarHealthcare?retryWrites=true&w=majority'
).then(() => {
     console.log('DB connected');
}).catch((err) => {
     console.log("DB didn't connect", err);
});

const sendFileToNecessaryFolder = (url) => {
     if (url.startsWith('/blog')) {
          return 'uploads/blog';
     } else if (url.startsWith('/homebg') || url.startsWith('/bg')) {
          return 'uploads/backgrounds';
     } else if (url.startsWith('/partner')) {
          return 'uploads/partners';
     } else {
          return 'uploads';
     }
}

const storage = multer.diskStorage({
     destination: (req, __, callback) => {
          callback(null, sendFileToNecessaryFolder(req.url));
     },
     filename: (_, file, callback) => {
          callback(null, file.originalname);
     }
});



const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads/blog', express.static('uploads/blog'));
app.use('/uploads/backgrounds', express.static('uploads/backgrounds'));

/* Admin registration/login */
app.post('/register', checkAuthAdmin, adminRegisterValidator, AdminController.register);
app.post('/login', adminLoginValidator, AdminController.login);
/* General information */
app.get('/general', GeneralInformationController.showGeneralInformation);
app.post('/general/update', checkAuthAdmin, updateGeneralInformtaionValidator, GeneralInformationController.updateInfo);
app.post('/general/initial', checkAuthAdmin, updateGeneralInformtaionValidator, GeneralInformationController.initialInsert);
app.post('/homebg/change', checkAuthAdmin, upload.single('homebg'), GeneralInformationController.changeHomeBackgroundImage);
app.post('/bg/change', checkAuthAdmin, upload.single('bg'), GeneralInformationController.changeBackgroundImage);

/* Blog */
app.get('/blog', BlogController.showAllArticles);
app.get('/blog/latest', BlogController.showLastArticles);
app.get('/blog/:id', BlogController.showArticleById);
app.post('/blog/add', checkAuthAdmin, upload.single("blog"), BlogController.addNewArticleIntoBlog);
app.post('/blog/update', checkAuthAdmin, blogUpdateValidator, BlogController.updateArticleIntoBlog);

/* Partner */
app.post('/partner/add', checkAuthAdmin, upload.single('partner'), addOrUpdatePartner, PartnerController.addNewPartner);
app.get('/partners', PartnerController.getAllPartners);

const port = process.env.PORT || 4000;

app.listen(port, (err) => {
     if(err){
          return console.log(err);
     }
     console.log("The web site is running on port " + port);
});
