import { clockWidget } from "src/widgets/clock";
import { System } from "./system";
import { SysTray } from "./tray";
import { Workspaces } from "./workspaces";
import { css } from "src/services/css";
import { pillsContainer } from "./widgets/pill";
import { weatherFetched, weatherWidget } from "src/widgets/weather";
import { batteryWidget } from "src/widgets/battery";
import { audioWidget } from "src/widgets/audio";
import { Binding } from "types/types/service";
import { dateWidget, shortDateWidget } from "src/widgets/date";
import { brightnessWidget } from "src/widgets/brightness";

export const bar = async ({
  monitor,
  windowName,
  animationDuration,
}: {
  monitor: number;
  windowName: string;
  animationDuration: number;
}) => {
  const batteryService = await Service.import("battery");
  const audioService = await Service.import("audio");
  const mprisService = await Service.import("mpris");

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
    children: {
      clock: _clock,
      date: _date,
    },
    shown: "clock",
    transition: "slide_up_down",
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

  const brightness = async () =>
    Widget.Box({
      css: "",
      child: await brightnessWidget({
        overlayStyle: "",
        indicatorStyle:
          iconStyle +
          css.ColorRGBA({ red: 250, green: 189, blue: 47, alpha: 1 }),
        iconStyle:
          css.fontSize({ size: 1 }) +
          css.ColorRGBA({ red: 250, green: 189, blue: 47, alpha: 1 }),
        startAt: 0.25,
        rounded: true,
      }),
    });

  const _bar = pillsContainer({
    containerSpacing: 10,
    widgetSpacing: 10,
    containerStyle: css.margin({ top: 0.7, left: 0.7, right: 0.7 }),
    pillStyle:
      css.paddingAll({ padding: 0.25 }) +
      css.borderAll({
        width: 0.08,
        type: "solid",
        red: 175,
        green: 175,
        blue: 175,
        alpha: 1,
      }) +
      css.borderRadius({ radius: 1 }) +
      css.backgroundColorRGBA({
        red: 30,
        green: 30,
        blue: 30,
        alpha: 0.7,
      }),
    children: [
      [],
      [
        await brightness(),
        _audioRevealer,
        _batteryRevealer,
        _weatherRevealer,
        _clockDateHover,
      ],
    ],
  });

  return Widget.Window({
    name: windowName,
    class_name: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      start_widget: Widget.Box({
        children: [Workspaces()],
      }),
      end_widget: Widget.Box({
        hpack: "end",
        children: [SysTray(), _bar],
      }),
    }),
  });
};
