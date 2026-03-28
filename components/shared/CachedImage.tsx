import { FC, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { FasterImageView } from '@candlefinance/faster-image';
import { useImageCache } from '../../services/storage/useImageCache';
import { ReportImage } from '../../types';
import { bgColor2 } from '../../constants';

interface CachedImageProps {
  image: ReportImage;
  width: number;
  maxHeight?: number;
}

export const CachedImage: FC<CachedImageProps> = ({
  image,
  width: rawWidth,
  maxHeight,
}) => {
  const [localUri, setLocalUri] = useState<string | null>(null);
  const { cacheImage } = useImageCache();

  const [width, height] = useMemo(() => {
    const rawHeight = rawWidth * (image.height / image.width);

    if (maxHeight === undefined || rawHeight <= maxHeight) {
      return [rawWidth, rawHeight];
    }

    const newWidth = maxHeight * (image.width / image.height);
    return [newWidth, maxHeight];
  }, [image, rawWidth, maxHeight]);

  useEffect(() => {
    let isMounted = true;

    cacheImage(image.download_url, image.id).then(uri => {
      if (isMounted) setLocalUri(uri);
    });

    return () => {
      isMounted = false;
    };
  }, [image.download_url, image.id]);

  return (
    <Skeleton
      isLoading={!localUri}
      boneColor={bgColor2}
      highlightColor={'white'}
      animationDirection="diagonalDownRight"
    >
      <View style={{ width, height }}>
        {localUri && (
          <FasterImageView
            style={{ width: '100%', height: '100%' }}
            source={{
              transitionDuration: 0.3,
              url: localUri,
              resizeMode: 'cover',
            }}
          />
        )}
      </View>
    </Skeleton>
  );
};
