import type { FC, SVGProps } from 'react';
import ArrowDownIcon from './icons/arrow-down.svg';
import BuildingIcon from './icons/building.svg';
import CameraIcon from './icons/camera.svg';
import HardHatIcon from './icons/hard-hat.svg';
import MailIcon from './icons/mail.svg';
import PhoneIcon from './icons/phone.svg';
import SearchIcon from './icons/search.svg';
import ShieldMinusIcon from './icons/shield-minus.svg';

const icons = {
  'arrow-down': ArrowDownIcon,
  building: BuildingIcon,
  camera: CameraIcon,
  'hard-hat': HardHatIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  search: SearchIcon,
  'shield-minus': ShieldMinusIcon,
} as const;

export type IconName = keyof typeof icons;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  name: IconName;
  size?: number;
}

export const Icon: FC<IconProps> = ({ name, size = 24, style, ...rest }) => {
  const SvgIcon = icons[name];
  return (
    <SvgIcon
      width={size}
      height={size}
      style={{ width: size, height: size, flexShrink: 0, ...style }}
      {...rest}
    />
  );
};
