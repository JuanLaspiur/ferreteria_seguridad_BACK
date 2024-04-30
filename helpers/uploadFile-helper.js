const path = require("path");

const { v4: uuidv4 } = require("uuid");

const defaultExtensions = ["jpg", "png", "jpeg", "gif"];

const uploadFileHelper = ({
  files,
  validExtensions = defaultExtensions,
  folder = "",
}) => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    if (!file) reject("No hay archivo que subir");

    const splitName = file.name.split(".");
    const extension = splitName[splitName.length - 1];

    if (!validExtensions.includes(extension))
      return reject(
        `La extensión ${extension} no es permitida - ${validExtensions}`
      );

    const tempName = uuidv4() + "." + extension;

    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) return reject(err);

      return resolve(tempName);
    });
  });
};

module.exports = {
  uploadFileHelper,
};
