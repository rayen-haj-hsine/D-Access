import React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';

export const LocationPinIcon = (props: SvgProps) => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 21s-6-5.45-6-11a6 6 0 1 1 12 0c0 5.55-6 11-6 11Z"
      fill={props.color || '#2FA9DF'}
    />
    <Circle cx={12} cy={10} r={2.5} fill="#D5EBF6" />
  </Svg>
);
