import { extname } from 'path';
export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp|jfif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }

    callback(null, true);
};
export const generateFileName = (req, file, callback) => {
    let name = file?.originalname?.split('.')[0];
    if (!name) {
        return callback(new Error(`Can't upload file!`), false);
    }

    name = name
        .replaceAll('(', '_')
        .replaceAll(')', '_')
        .replaceAll(' ', '_')
        .replaceAll("'", '_'); // remove ( , ) and white space
    name = `sanabel_${name.toLowerCase()}_${Date.now()}`;

    const fileExtName = extname(file.originalname);
    callback(null, `${name}${fileExtName}`);
};