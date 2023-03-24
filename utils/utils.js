import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const deleteFileFromFolder = (folder, filename) => {
     const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads', folder, filename);

     fs.unlink(filePath, (err) => {
          if (err) {
               console.error(err);
               return;
          }
          console.log('File has been deleted successfully');
     });
}