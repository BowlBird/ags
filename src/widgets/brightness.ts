import brightness from "src/services/brightness";
// definition of audio widget
export const brightnessWidget = async ({
  overlayStyle,
  indicatorStyle,
  iconStyle,
  startAt,
  rounded,
}: {
  overlayStyle: string;
  indicatorStyle: string;
  iconStyle: string;
  startAt: number;
  rounded: boolean;
}) => {
  // Service Imports

  //binds
  let decimalBrightness = brightness.bind("screen_value");

  let icon = decimalBrightness.as((brightness) => {
    const icon = [
      [67, "high"],
      [34, "medium"],
      [1, "low"],
      [0, "off"],
    ].find(([threshold]) => (threshold as number) <= brightness * 100)?.[1];
    return `display-brightness-${icon}-symbolic`;
  });
  // definition of container to hold the entire widget
  const brightnessContainer = ({
    child,
    overlays,
  }: {
    child: any;
    overlays: any[];
  }) =>
    Widget.Overlay({
      css: overlayStyle,
      child: child,
      overlays: overlays,
    });

  // definition of icon for audio
  const brightnessIcon = () =>
    Widget.Icon({
      css: iconStyle,
      icon: icon,
    });

  // definition of indicator for audio
  const indicator = () =>
    Widget.CircularProgress({
      css: indicatorStyle,
      start_at: startAt,
      rounded: rounded,
      value: decimalBrightness,
    });

  return brightnessContainer({
    child: indicator(),
    overlays: [brightnessIcon()],
  });
};
