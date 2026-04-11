// Extracts the file name portion of the secure URL returned from cloudinary
function getCloudinaryPublicId(urlInput) {
  const temp = urlInput.split('/');
  const extractedFilename = temp[temp.length - 1];
  const removeExt = extractedFilename.split('.');
  const publicId = removeExt[0];

  return publicId;
}

export { getCloudinaryPublicId };
