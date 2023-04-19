import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';


import { 
     AdminController, 
     GeneralInformationController, 
     BlogController, 
     PartnerController, 
     PageController, 
     DocumentController,
     CityController,
     MailController
} from './controllers/AllControllers.js';
import { adminRegisterValidator, adminLoginValidator } from './validators/adminValidator.js';
import { updateGeneralInformtaionValidator } from './validators/generalInformationValidator.js';
import { addOrUpdatePartner } from './validators/partnerValidator.js';
import { addParentPageValidator } from './validators/parentPageValidator.js';
import { addOrUpdateCityValidator } from './validators/cityValidator.js';
import checkAuthAdmin from './middlewares/checkAuthAdmin.js';

mongoose.set("strictQuery", false);
mongoose.connect(
     'mongodb+srv://admin:fDJOm5IhWXOwd0Hp@cluster0.5cekcxl.mongodb.net/TurarHealthcare?retryWrites=true&w=majority'
).then(() => {
     console.log('DB connected');
}).catch((err) => {
     console.log("DB didn't connect\n", err);
});

const sendFileToNecessaryFolder = (url) => {
     switch (true) {
          case url.startsWith('/blog'):
               return 'uploads/blog';
          case url.startsWith('/homebg') || url.startsWith('/bg'):
               return 'uploads/backgrounds';
          case url.startsWith('/partner'):
               return 'uploads/partners';
          case url.startsWith('/document'):
               return 'uploads/documents';
          case url.startsWith('/phone'):
               return 'uploads/contacts';
          case url.startsWith('/editor'):
               return 'uploads/editor';
          case url.startsWith('/mail'):
               return 'uploads/mail'
          default:
               return 'uploads';
        }
}

const storage = multer.diskStorage({
     destination: (req, __, callback) => {
          callback(null, sendFileToNecessaryFolder(req.url));
     },
     filename: (_, file, callback) => {
          callback(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
     }
});

const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads/blog', express.static('uploads/blog'));
app.use('/uploads/backgrounds', express.static('uploads/backgrounds'));
app.use('/uploads/partners', express.static('uploads/partners'));
app.use('/uploads/documents', express.static('uploads/documents'));
app.use('/uploads/contacts', express.static('uploads/contacts'));
app.use('/uploads/editor', express.static('uploads/editor'));
app.use('/uploads/mail', express.static('uploads/mail'));

/* Admin registration/login */
app.post('/register', checkAuthAdmin, adminRegisterValidator, AdminController.register);
app.post('/login', adminLoginValidator, AdminController.login);
/* General information */
app.get('/general', GeneralInformationController.showGeneralInformation);
app.post('/general/update', checkAuthAdmin, updateGeneralInformtaionValidator, GeneralInformationController.updateInfo);
app.post('/general/initial', checkAuthAdmin, updateGeneralInformtaionValidator, GeneralInformationController.initialInsert);
app.post('/homebg/change', checkAuthAdmin, upload.single('homebg'), GeneralInformationController.changeHomeBackgroundImage);
app.post('/bg/change', checkAuthAdmin, upload.single('bg'), GeneralInformationController.changeBackgroundImage);
app.post('/phone/change', checkAuthAdmin, upload.single('phone'), GeneralInformationController.changeListOfNumbers);
/* Blog */
app.get('/blog', BlogController.showAllArticles);
app.get('/blog/latest', BlogController.showLastArticles);
app.get('/blog/latest/:id', BlogController.showLastArticlesExceptSelected);
app.get('/blog/:id', BlogController.showArticleById);
app.post('/blog/add', checkAuthAdmin, upload.single("blog"), BlogController.addNewArticleIntoBlog);
app.post('/blog/update', checkAuthAdmin, upload.single("blog"), BlogController.updateArticleIntoBlog);
app.post('/blog/delete/:id', checkAuthAdmin, BlogController.deleteArticle);
/* Partner */
app.post('/partner/add', checkAuthAdmin, upload.single('partner'), addOrUpdatePartner, PartnerController.addNewPartner);
app.post('/partner/update', checkAuthAdmin, upload.single('partner'), addOrUpdatePartner, PartnerController.updatePartner);
app.post('/partner/delete/:id', checkAuthAdmin, PartnerController.deletePartner);
app.post('/partner/increment/:id', checkAuthAdmin, PartnerController.incrementOrderOfPartner);
app.post('/partner/decrement/:id', checkAuthAdmin, PartnerController.decrementOrderOfPartner);
app.get('/partners', PartnerController.getAllPartners);
/* Pages */
app.get('/:link', PageController.showPageByLink);
app.get('/nested/:id', PageController.showNestedPageById);
app.get('/page/parent', PageController.showAllParentPage);
app.get('/page', PageController.showAllPages);
app.post('/page/parent/add', checkAuthAdmin, addParentPageValidator, PageController.addNewParentPage);
app.post('/page/nested/add', checkAuthAdmin, PageController.addNewNestedPage);
app.post('/page/nested/update', checkAuthAdmin, PageController.updateNestedPage);
app.post('/page/nested/delete/:id', checkAuthAdmin, PageController.deleteNestedPage);
app.post('/page/increment/:id', checkAuthAdmin, PageController.incrementOrderOfPage);
app.post('/page/decrement/:id', checkAuthAdmin, PageController.decrementOrderOfPage);
app.post('/page/part/add', checkAuthAdmin, PageController.addPartOfNestedPage);
app.post('/page/part/update/', checkAuthAdmin, PageController.updatePagePart);
app.post('/page/part/delete/:id', checkAuthAdmin, PageController.deletePagePart);
app.get('/part/:link', PageController.showPagePartByLink);
app.get('/part/id/:id', PageController.showPagePartById);
/* Documents */
app.post('/document/add', checkAuthAdmin, upload.single('file'), DocumentController.addNewDocument);
app.post('/document/update/:id', checkAuthAdmin, upload.single('file'), DocumentController.updateDocument);
app.post('/document/delete/:id', checkAuthAdmin, DocumentController.deleteDocument);
app.get('/documents/:id', DocumentController.showDocumentsByPage);
app.post('/document/part/add', checkAuthAdmin, upload.single('file'), DocumentController.addNewDocumentOfPagePart);
app.post('/document/part/update/:id', checkAuthAdmin, upload.single('file'), DocumentController.updateDocumentOfPagePart);
app.post('/document/part/delete/:id', checkAuthAdmin, DocumentController.deleteDocumentOfPagePart);
app.get('/documents/part/:id', DocumentController.showDocumentsByPagePart);
app.post('/document/parent/add', checkAuthAdmin, upload.single('file'), DocumentController.addNewDocumentOfParentPage);
app.post('/document/parent/update/:id', checkAuthAdmin, upload.single('file'), DocumentController.updateDocumentOfParentPage);
app.post('/document/parent/delete/:id', checkAuthAdmin, DocumentController.deleteDocumentOfParentPage);
app.get('/documents/parent/:id', DocumentController.showDocumentsByParentPage);
/* Cities */
app.post('/city/add', checkAuthAdmin, addOrUpdateCityValidator, CityController.addNewCity);
app.post('/city/update/:id', checkAuthAdmin, addOrUpdateCityValidator, CityController.updateCity);
app.post('/city/delete/:id', checkAuthAdmin, CityController.deleteCity);
app.get('/city/all', CityController.getAllCities);
app.get('/city/:link', CityController.getCityByLink);
/* Mail */
app.get('/mail/notanswered', MailController.getAllMailsWithoutAnswers);
app.get('/mail/answered', MailController.getAllMailsWithAnswers);
app.get('/mail/access', MailController.getAllMailsWithAccess);
app.post('/mail', upload.array('files'), MailController.sendMailToChairmanBlog);
app.post('/mail/answer/:id', checkAuthAdmin, MailController.answerToMail);
app.post('/mail/show/:id', checkAuthAdmin, MailController.showMail);
app.post('/mail/hide/:id', checkAuthAdmin, MailController.hideMail);
app.post('/mail/delete/:id', checkAuthAdmin, MailController.deleteMail);

const port = process.env.PORT || 4000;

app.listen(port, (err) => {
     if(err){
          return console.log(err);
     }
     console.log("The web site is running on port " + port);
});
