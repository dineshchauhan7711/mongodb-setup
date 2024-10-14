const fs = require('fs');


/**
 * File Upload
 */

function uploadFile(file, pathFolder = 'profile') {
     try {
          let fileName = String(Date.now()) + Math.floor(10000000 + Math.random() * 90000000) + path.extname(file.originalname);

          // Check if the directory exists, and create it if it doesn't
          if (!fs.existsSync('./public/images/' + pathFolder)) {
               fs.mkdirSync('./public/images/' + pathFolder, { recursive: true });
          };

          const uploadPath = './public/images/' + pathFolder + '/' + fileName;
          const outStream = fs.createWriteStream(uploadPath);
          outStream.write(file.buffer);
          outStream.end();

          return {
               success: true,
               fileName
          };
     } catch (error) {
          console.log('Error :>> ', error);
          return {
               success: false,
          };
     }
};


/***
 * File Delete
 */

async function deleteFile(fileName, pathFolder = 'profile') {
     try {
          const deletePath = './public/images/' + pathFolder + '/' + fileName;

          // Check if the directory exists.
          if (!fs.existsSync(deletePath)) {
               return {
                    success: true
               }
          };

          // Delete File
          fs.unlinkSync(deletePath);

          return {
               success: true
          }
     }
     catch (error) {
          console.log('Error :>> ', error);
          return {
               success: false
          }
     }
};


module.exports = {
     uploadFile,
     deleteFile
}