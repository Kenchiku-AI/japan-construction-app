import RNFS from 'react-native-fs';

export const useImageCache = () => {
  const cacheImage = async (url: string, id: string) => {
    const path = `${RNFS.CachesDirectoryPath}/${id}.jpg`;

    const exists = await RNFS.exists(path);
    if (exists) return `file://${path}`;

    await RNFS.downloadFile({
      fromUrl: url,
      toFile: path,
    }).promise;

    return `file://${path}`;
  };

  return {
    cacheImage,
  };
};
