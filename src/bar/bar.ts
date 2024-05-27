import { clockWidget } from "src/widgets/clock";
import { css } from "src/services/css";
import { pillsContainer } from "./widgets/pill";
import { weatherFetched, weatherWidget } from "src/widgets/weather";
import { batteryWidget } from "src/widgets/battery";
import { audioWidget } from "src/widgets/audio";
import { Binding } from "types/types/service";
import { dateWidget } from "src/widgets/date";
import { brightnessWidget } from "src/widgets/brightness";
import { trayWidget } from "./widgets/tray";
import { MprisWidget, playerWidget } from "src/widgets/player";
import { transitionContainer } from "src/widgets/transitionContainer";
import { workspacesWidget } from "./widgets/workspaces";

export const bar = async ({
  monitor,
  windowName,
  animationDuration,
  height,
}: {
  monitor: number;
  windowName: string;
  animationDuration: number;
  height: number;
}) => {
  const batteryService = await Service.import("battery");
  const audioService = await Service.import("audio");

  const widgetRevealer = ({
    reveal,
    child,
    transition,
  }: {
    reveal: boolean | Binding<any, any, boolean>;
    child: any;
    transition: any;
  }) =>
    Widget.Revealer({
      reveal_child: reveal,
      transition: transition,
      transition_duration: animationDuration,
      child: child,
    });

  const _clock = clockWidget({
    style: css.fontWeight({ weight: "bold" }),
  });

  const _date = dateWidget({
    style: css.fontWeight({ weight: "bold" }),
  });

  const _clockRevealer = Widget.Stack({
    css: css.padding({ right: 0.5 }),
    children: {
      clock: _clock,
      date: _date,
    },
    shown: "clock",
    transition: "slide_left_right",
    homogeneous: false,
    interpolate_size: true,
    transition_duration: animationDuration,
  });

  const _clockDateHover = Widget.EventBox({
    on_hover: (_) => (_clockRevealer.shown = "date"),
    on_hover_lost: (_) => (_clockRevealer.shown = "clock"),
    child: _clockRevealer,
  });

  const _weather = weatherWidget({
    style: css.fontWeight({ weight: "bold" }),
  });

  const _weatherRevealer = widgetRevealer({
    transition: "slide_right",
    reveal: weatherFetched.bind(),
    child: _weather,
  });

  const iconStyle =
    css.minWidth({ width: 1.5 }) +
    css.minHeight({ height: 1.5 }) +
    css.fontSize({ size: 0.15 });

  const batteryAvailable = batteryService.bind("available");

  const battery = async () =>
    Widget.Box({
      css: "",
      child: await batteryWidget({
        batteryIndicatorStyle:
          iconStyle +
          css.ColorRGBA({ red: 188, green: 203, blue: 121, alpha: 1 }),
        dischargeIndicatorStyle:
          iconStyle +
          css.ColorRGBA({ red: 251, green: 73, blue: 52, alpha: 1 }),
        chargingIndicatorStyle:
          iconStyle +
          css.ColorRGBA({ red: 250, green: 189, blue: 47, alpha: 1 }),
        overlayStyle: "",
        iconStyle:
          css.fontSize({ size: 1 }) +
          css.ColorRGBA({ red: 188, green: 203, blue: 121, alpha: 1 }),
        rounded: true,
        startAt: 0.25,
      }),
    });

  const _batteryRevealer = widgetRevealer({
    transition: "slide_right",
    reveal: batteryAvailable, //for desktop systems
    child: await battery(),
  });

  const audioAvailable = audioService
    .bind("speakers")
    .as((speakers) => speakers.length > 0);

  const audio = async () =>
    Widget.Box({
      css: "",
      child: await audioWidget({
        overlayStyle: "",
        indicatorStyle:
          iconStyle +
          css.ColorRGBA({ red: 243, green: 128, blue: 25, alpha: 1 }),
        iconStyle:
          css.fontSize({ size: 1 }) +
          css.ColorRGBA({ red: 243, green: 128, blue: 25, alpha: 1 }),
        startAt: 0.25,
        rounded: true,
      }),
    });

  const _audioRevealer = widgetRevealer({
    transition: "slide_right",
    reveal: audioAvailable, //just in case
    child: await audio(),
  });

  const _brightness = Widget.Box({
    css: "",
    child: await brightnessWidget({
      overlayStyle: "",
      indicatorStyle:
        iconStyle + css.ColorRGBA({ red: 250, green: 189, blue: 47, alpha: 1 }),
      iconStyle:
        css.fontSize({ size: 1 }) +
        css.ColorRGBA({ red: 250, green: 189, blue: 47, alpha: 1 }),
      startAt: 0.25,
      rounded: true,
    }),
  });

  const _tray = Widget.Box({
    css:
      css.backgroundColorGTK({ color: "@theme_bg_color" }) +
      // css.backgroundColorRGBA({ red: 51, green: 50, blue: 67, alpha: 0.7 }) +
      css.padding({ left: 0.5, right: 0.5 }) +
      css.borderRadiusAll({ radius: height / 2 }),
    child: await trayWidget({
      transition: "slide_right",
      transitionDuration: animationDuration,
      spacing: 10,
      size: 20,
    }),
  });

  const _workspaces = await workspacesWidget({
    animationDuration: animationDuration,
    spacing: 10,
    iconSize: 20,
    height: height,
  });

  const _player = await MprisWidget({
    width: 20,
    height: height,
    titleMaxCharWidth: 15,
    artistMaxCharWidth: 15,
    animationDuration: animationDuration,
    playerDuration: 10000,
    playerTransition: "crossfade",
    widgetTransition: "slide_right",
    playerStyle: css.margin({ left: 0.35, right: 0.35 }),
  });

  const _rightBar = pillsContainer({
    containerSpacing: 10,
    widgetSpacing: 10,
    containerStyle:
      "border: @theme_bg_color solid 1px;" +
      css.minHeight({ height: height }) +
      css.borderRadiusAll({ radius: height / 2 }) +
      css.backgroundColorRGBA({
        red: 30,
        green: 30,
        blue: 30,
        alpha: 0.7,
      }),
    pillStyle: "",
    children: [
      [_tray],
      [
        _brightness,
        _audioRevealer,
        _batteryRevealer,
        _weatherRevealer,
        _clockDateHover,
      ],
    ],
  });

  const _leftBar = pillsContainer({
    containerSpacing: 10,
    widgetSpacing: 10,
    containerStyle:
      "border: @theme_bg_color solid 1px;" +
      css.minHeight({ height: height }) +
      css.borderRadiusAll({ radius: height / 2 }) +
      css.backgroundColorRGBA({
        red: 30,
        green: 30,
        blue: 30,
        alpha: 0.7,
      }),
    pillStyle: "",
    children: [[_workspaces]],
  });

  const _bar = Widget.Box({
    hpack: "center",
    css: css.margin({ top: 0.7, left: 0.7, right: 0.7 }),
    spacing: 5,
    children: [_leftBar, _player, _rightBar],
  });

  return Widget.Window({
    name: windowName,
    class_name: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: _bar,
  });
};
