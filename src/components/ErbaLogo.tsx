import React from 'react';
import { CybeLogo, CybeLogoProps } from './CybeLogo';

export type ErbaLogoProps = CybeLogoProps;

// Re-export CybeLogo as ErbaLogo to seamlessly update the entire UI with the high-resolution Cybe: LabConnect logo
export const ErbaLogo: React.FC<ErbaLogoProps> = (props) => {
  return <CybeLogo {...props} />;
};

export { CybeLogo };
