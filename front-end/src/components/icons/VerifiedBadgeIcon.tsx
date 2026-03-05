import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const VerifiedBadgeIcon = (props: SvgProps) => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2.75c.66 0 1.28.26 1.75.73l.55.55c.3.3.72.49 1.16.52l.78.06c1.26.1 2.27 1.11 2.37 2.37l.06.78c.03.44.22.86.52 1.16l.55.55c.93.93.97 2.44.08 3.41l-.08.09-.55.55c-.3.3-.49.72-.52 1.16l-.06.78c-.1 1.26-1.11 2.27-2.37 2.37l-.78.06c-.44.03-.86.22-1.16.52l-.55.55c-.93.93-2.44.97-3.41.08l-.09-.08-.55-.55a2.13 2.13 0 0 0-1.16-.52l-.78-.06a2.75 2.75 0 0 1-2.37-2.37l-.06-.78a2.13 2.13 0 0 0-.52-1.16l-.55-.55a2.75 2.75 0 0 1-.08-3.41l.08-.09.55-.55c.3-.3.49-.72.52-1.16l.06-.78a2.75 2.75 0 0 1 2.37-2.37l.78-.06c.44-.03.86-.22 1.16-.52l.55-.55c.47-.47 1.09-.73 1.75-.73Z"
      stroke={props.color || '#2FA9DF'}
      strokeWidth={1.6}
    />
    <Path
      d="m9.25 12.15 1.9 1.9 3.6-3.6"
      stroke={props.color || '#2FA9DF'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
