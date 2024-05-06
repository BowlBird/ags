// definition of audio widget
export const audioWidget = async ({
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
  let audio = await Service.import("audio");

  //binds
  let decimalAudioVolume = audio.speaker.bind("volume");
  let icon = decimalAudioVolume.as((volume) => {
    const icon = [
      [101, "overamplified"],
      [67, "high"],
      [34, "medium"],
      [1, "low"],
      [0, "muted"],
    ].find(([threshold]) => (threshold as number) <= volume * 100)?.[1];
    return `audio-volume-${icon}-symbolic`;
  });
  // definition of container to hold the entire widget
  const audioContainer = ({
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
  const audioIcon = () =>
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
      value: decimalAudioVolume,
    });

  return audioContainer({
    child: indicator(),
    overlays: [audioIcon()],
  });
};
