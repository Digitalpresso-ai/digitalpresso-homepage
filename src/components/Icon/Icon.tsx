import type { FC, SVGProps } from 'react';
import MailIcon from '@/public/images/icons/icon_mail.svg';
import BuildingIcon from '@/public/images/icons/icon_building.svg';
import PhoneIcon from '@/public/images/icons/icon_phone.svg';

const icons = {
  mail: MailIcon,
  building: BuildingIcon,
  phone: PhoneIcon,
} as const;

export type IconName = keyof typeof icons;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export const Icon: FC<IconProps> = ({ name, size = 24, width, height, ...rest }) => {
  const SvgIcon = icons[name];
  return <SvgIcon width={width ?? size} height={height ?? size} {...rest} />;
};
