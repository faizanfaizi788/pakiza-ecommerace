import uploadImageClodinary from '../utils/uploadImageClodinary.js';

const uploadImageController = async (request, response) => {
  try {
    const file = request.file;

    console.log('Upload Image file', file);

    if (!file) {
      return response.status(400).json({
        message: 'No file uploaded',
        error: true,
        success: false,
      });
    }

    const uploadImage = await uploadImageClodinary(file);
    console.log('Upload Image uploadImage', uploadImage);

    return response.json({
      message: 'Upload done',
      data: uploadImage,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error('Upload Image Error', error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;
