import { css } from "src/services/css";
import { colorsFromImage } from "src/services/color";
import { Binding } from "types/types/service";
import { MprisPlayer } from "types/types/service/mpris";
import { transitionContainer } from "./transitionContainer";
import GLib from "gi://GLib";

interface Color {
  red: number;
  green: number;
  blue: number;
}

interface Palette {
  primary: Color;
  secondary: Color;
  background: Color;
}

export const playerWidget = ({
  player,
  width,
  height,
  titleMaxCharWidth,
  artistMaxCharWidth,
  animationDuration,
  playerStyle,
}: {
  player: MprisPlayer;
  width: number;
  height: number;
  titleMaxCharWidth: number;
  artistMaxCharWidth: number;
  animationDuration: number;
  playerStyle: string;
}) => {
  const colors = Variable<Palette | undefined>(undefined);

  let cache: {
    path: string | undefined;
    title: string | undefined;
    artists: string[] | undefined;
  } = {
    path: undefined,
    title: undefined,
    artists: undefined,
  };
  Utils.merge([player.bind("cover_path")], (path) => {
    //cancel previous check
    colorsFromImage({ path: path })
      .then((palette) => {
        if (
          cache.path !== path ||
          cache.title !== player.track_title ||
          cache.artists !== player.track_artists
        ) {
          colors.setValue(palette);
          cache.path = path;
          cache.title = player.track_title;
          cache.artists = player.track_artists;
        }
      })
      .catch(() => {
        log("Invalid path to thumbnail!");
        colors.setValue(undefined);
      });
  });

  const backgroundColor = colors
    .bind()
    .as((colors) => colors?.background ?? undefined);
  const primaryColor = colors
    .bind()
    .as((colors) => colors?.primary ?? undefined);
  const secondaryColor = colors
    .bind()
    .as((colors) => colors?.secondary ?? undefined);

  const blurBox = ({
    red,
    green,
    blue,
  }: {
    red: number;
    green: number;
    blue: number;
  }) =>
    Widget.Box({
      css:
        css.margin({ left: 2 }) +
        css.backgroundLinearGradient({
          degrees: 84,
          transitionPoint: 66,
          fromRed: red,
          fromGreen: green,
          fromBlue: blue,
          fromAlpha: 1,
          toRed: red,
          toGreen: green,
          toBlue: blue,
          toAlpha: 0,
        }) +
        css.borderRadius({ topLeft: height, bottomLeft: height }) +
        css.minWidth({ width: width / 2 }),
    });

  const _background = transitionContainer({
    binding: backgroundColor.as((background) =>
      Widget.Box({
        hpack: "center",
        css:
          css.backgroundColorRGBA({
            red: background?.red ?? 0,
            green: background?.green ?? 0,
            blue: background?.blue ?? 0,
            alpha: 1,
          }) +
          css.backgroundImage({ image: player.cover_path }) +
          css.minWidth({ width: width }) +
          css.minHeight({ height: height }) +
          css.backgroundSize({ size: "66%" as any }) +
          css.backgroundRepeat({ repeat: "no-repeat" }) +
          css.backgroundPosition({
            horizontal: "right",
            vertical: "center",
          }) +
          css.borderRadiusAll({ radius: height }),
        child: blurBox({
          red: background?.red ?? 0,
          green: background?.green ?? 0,
          blue: background?.blue ?? 0,
        }),
      })
    ),
    transition: "crossfade",
    transitionDuration: animationDuration,
  });

  const _labels = Widget.Box({
    css: css.margin({ left: 1.2 }),
    vpack: "center",
    vertical: true,
    children: [
      transitionContainer({
        binding: primaryColor.as((color) =>
          Widget.Label({
            css: css.ColorRGBA({
              red: color?.red ?? 255,
              green: color?.green ?? 255,
              blue: color?.blue ?? 255,
              alpha: 1,
            }),
            maxWidthChars: titleMaxCharWidth,
            truncate: "end",
            label: player.metadata["xesam:title"],
          })
        ),
        transition: "slide_up",
        transitionDuration: animationDuration,
      }),
      transitionContainer({
        binding: primaryColor.as((color) =>
          Widget.Label({
            css: css.ColorRGBA({
              red: color?.red ?? 255,
              green: color?.green ?? 255,
              blue: color?.blue ?? 255,
              alpha: 1,
            }),
            maxWidthChars: artistMaxCharWidth,
            truncate: "end",
            label: (player.metadata["xesam:artist"] ?? [""]).join(" - "),
          })
        ),
        transition: "slide_down",
        transitionDuration: animationDuration,
      }),
    ],
  });

  return Widget.Overlay({
    child: Widget.Box({
      css: playerStyle,

      child: _background,
    }),
    overlay: Widget.Box({ css: playerStyle, child: _labels }),
  });
};

export const MprisWidget = async ({
  width,
  height,
  titleMaxCharWidth,
  artistMaxCharWidth,
  animationDuration,
  playerDuration,
  playerTransition,
  widgetTransition,
  playerStyle,
}: {
  width: number;
  height: number;
  titleMaxCharWidth: number;
  artistMaxCharWidth: number;
  animationDuration: number;
  playerDuration: number;
  playerTransition: string;
  widgetTransition: string;
  playerStyle: string;
}) => {
  const mprisService = await Service.import("mpris");

  const index = Variable(0, {
    poll: [playerDuration, (self) => self.getValue() + 1],
  });

  const currentPlayer = Variable<MprisPlayer | undefined>(undefined);

  let previousAmountOfPlayers = -1;
  Utils.merge(
    [mprisService.bind("players"), index.bind()],
    (players, index) => {
      if (players.length > 1)
        currentPlayer.setValue(players[index % players.length]);
      else if (
        (currentPlayer.getValue() === undefined ||
          previousAmountOfPlayers > 1) &&
        players.length === 1
      )
        currentPlayer.setValue(players[0]);
      else if (players.length === 0) currentPlayer.setValue(undefined);
      previousAmountOfPlayers = players.length;
    }
  );

  const _player = Widget.Revealer({
    reveal_child: currentPlayer.bind().as((it) => (it ? true : false)),
    transition: widgetTransition as any,
    transition_duration: animationDuration * 2,
    child: transitionContainer({
      binding: currentPlayer.bind().as((p) =>
        p
          ? playerWidget({
              playerStyle: playerStyle,
              player: p,
              width: width,
              height: height,
              titleMaxCharWidth: titleMaxCharWidth,
              artistMaxCharWidth: artistMaxCharWidth,
              animationDuration: animationDuration,
            })
          : Widget.Box()
      ),
      transition: playerTransition,
      transitionDuration: animationDuration,
    }),
  });
  return _player;
};
