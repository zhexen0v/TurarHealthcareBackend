import jwt from "jsonwebtoken";
export default (req, res, next) => {
     const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
     if(token){
          try {
               jwt.verify(token, 'adminkey');
               next();
          } catch (error) {
               console.log(error);
                    return res.status(403).json({
                         message: 'Can not verify admin'
                    });
          }
     } else{
          return res.status(403).json({
               message: 'No access admin'
          });
     }
}