import { css } from "src/css";
import { colorsFromImage } from "src/services/color";
import { Binding } from "types/types/service";
import { MprisPlayer } from "types/types/service/mpris";

// lifted from ags's examples.
function lengthStr(length) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

export const playerWidget = ({
  player,
  width,
  height,
  maxCharWidth,
}: {
  player: MprisPlayer;
  width: number;
  height: number;
  maxCharWidth: number;
}) => {
  const albumImage = player.bind("cover_path");
  const colors = Variable({
    background: { red: 0, green: 0, blue: 0 },
    primary: { red: 0, green: 0, blue: 0 },
    secondary: { red: 0, green: 0, blue: 0 },
  });

  Utils.merge([albumImage], (image) => {
    if (image)
      colorsFromImage({ path: image })
        .then((palette) => colors.setValue(JSON.parse(palette)))
        .catch(() => log("Invalid path to thumbnail!"));
    else log("Could not grab thumbnail for media source.");
  });

  const backgroundColor = colors.bind().as((colors) => colors.background);
  const primaryColor = colors.bind().as((colors) => colors.primary);
  const secondaryColor = colors.bind().as((colors) => colors.secondary);

  const coverContainer = ({
    top,
    bottom,
    left,
    center,
    right,
  }: {
    top?: any;
    bottom?: any;
    left?: any;
    center?: any;
    right?: any;
  }) =>
    Widget.Overlay({
      css: player.bind("cover_path").as(
        (p) =>
          (p
            ? css.backgroundImage({ image: p })
            : css.backgroundColorRGBA({
                red: 0,
                green: 0,
                blue: 0,
                alpha: 1,
              })) +
          css.minWidth({ width: width }) +
          css.minHeight({ height: height }) +
          css.backgroundSize({ size: "cover" }) +
          css.backgroundPosition({
            horizontal: "center",
            vertical: "center",
          }) +
          css.borderRadius({ radius: height })
      ),
      setup: (self) => {
        const backgroundCenterBox = Widget.CenterBox({
          css: player.bind("cover_path").as(
            (p) =>
              (p
                ? css.backgroundImage({ image: p })
                : css.backgroundColorRGBA({
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 1,
                  })) +
              css.minWidth({ width: width }) +
              css.backgroundSize({ size: "cover" }) +
              css.backgroundPosition({
                horizontal: "center",
                vertical: "center",
              }) +
              css.borderRadius({ radius: height })
          ),
        });
        const overlayCenterBox = Widget.CenterBox({
          hpack: "center",
          css: css.minWidth({ width: (width * 8) / 9 }),
          vertical: true,
        });

        self.child = backgroundCenterBox;
        self.overlay = overlayCenterBox;
        if (top) overlayCenterBox.start_widget = top;
        if (left) backgroundCenterBox.start_widget = left;
        if (center) backgroundCenterBox.center_widget = center;
        if (right) backgroundCenterBox.end_widget = right;
        if (bottom) overlayCenterBox.end_widget = bottom;
      },
    });

  const pillContainer = ({
    children,
    hpack,
    vpack,
    vertical,
    gradientDegrees,
  }: {
    children: any[];
    hpack: "start" | "end" | "center";
    vpack: "start" | "end" | "center";
    vertical: boolean;
    gradientDegrees: number;
  }) =>
    Widget.Box({
      vertical: vertical,
      hpack: hpack,
      vpack: vpack,
      css: Utils.merge(
        [backgroundColor, primaryColor, secondaryColor],
        (background, primary, secondary) =>
          css.backgroundLinearGradient({
            degrees: gradientDegrees,
            transitionPoint: 70,
            fromRed: background.red,
            fromGreen: background.green,
            fromBlue: background.blue,
            fromAlpha: 0.9,
            toRed: background.red,
            toGreen: background.green,
            toBlue: background.blue,
            toAlpha: 0,
          }) +
          css.borderRadius({ radius: height }) +
          css.padding({ left: 1, right: 1, top: 0.25, bottom: 0.25 }) +
          css.minHeight({ height: height })
      ),
      children: children,
    });

  const text = ({
    label,
    hpack,
    visible,
    setup,
  }: {
    label?: string | Binding<any, any, string>;
    hpack: "start" | "end";
    visible?: boolean | Binding<any, any, boolean>;
    setup?: (self) => void;
  }) =>
    Widget.Label({
      css: backgroundColor.as((color) =>
        css.ColorRGBA({
          red: 255 - color.red,
          green: 255 - color.green,
          blue: 255 - color.blue,
          alpha: 1,
        })
      ),
      visible: visible ?? false,
      hpack: hpack,
      maxWidthChars: maxCharWidth,
      truncate: "end",
      label: label ?? "",
      setup: setup ?? (() => {}),
    });

  const song = () =>
    text({
      hpack: "start",
      label: player.bind("track_title"),
    });

  const artist = () =>
    text({
      hpack: "start",
      label: player.bind("track_artists").as((artists) => artists.join(", ")),
    });

  const progress = () =>
    text({
      hpack: "end",
      visible: player.bind("length").as((length) => length > 0),
      // label: Utils.merge(
      //   [player.bind("position"), player.bind("length")],
      //   (position, length) => `${lengthStr(position)} / ${lengthStr(length)}`
      // ),
      setup: (self) => {
        function update() {
          self.label = `${lengthStr(player.position)} / ${lengthStr(
            player.length
          )}`;
        }
        self.hook(player, update);
        self.hook(player, update, "position");
        self.poll(1000, update);
      },
    });

  return coverContainer({
    left: pillContainer({
      children: [
        song(),
        Widget.Box({ spacing: 8, children: [artist(), progress()] }),
      ],
      hpack: "start",
      vpack: "center",
      vertical: true,
      gradientDegrees: 90,
    }),
  });
};
