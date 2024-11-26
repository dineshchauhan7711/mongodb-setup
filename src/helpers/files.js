// Modules
const fs = require('fs');
const path = require('path');


/**
 * File Upload
 */
const uploadFile = function (file, pathFolder = 'profile') {
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
const deleteFile = async function (fileName, pathFolder = 'profile') {
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
     } catch (error) {
          console.log('Error :>> ', error);
          return {
               success: false
          }
     }
};

/***
 * Profile Image Validation
 */
const profileImageValidation = async function (file) {
     try {
          // Only one image is allowed
          if (file.length != 1) {
               return {
                    success: false,
                    message: "Please select only one image."
               };
          };

          // File type validation
          const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
          if (!fileTypes.includes(file[0].mimetype)) {
               return {
                    success: false,
                    message: "Only jpeg, jpg and png files are allowed."
               };
          };

          // File size validation
          if (file[0].size >= 5 * 1024 * 1024) {
               return {
                    success: false,
                    message: "File size should be maximum 5 MB."
               };
          };

          return {
               success: true
          };
     } catch (error) {
          console.log('error :>> ', error);
          return {
               success: false,
               message: "Something went wrong when validating file."
          }
     }
};

module.exports = {
     uploadFile,
     deleteFile,
     profileImageValidation
}