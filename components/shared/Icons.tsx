import Svg, { Path } from 'react-native-svg';
import { buttonColor, fontColor1 } from '../../constants';

export const Close = () => (
  <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={buttonColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
