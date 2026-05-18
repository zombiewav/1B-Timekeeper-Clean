import logoSrc from '../assets/timekeeper-logo.jpg';

type AppLogoProps = {
  size?: number;
  className?: string;
};

export function AppLogo({ size = 40, className }: AppLogoProps) {
  return (
    <img
      src={logoSrc}
      alt="TimeKeeper logo"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
