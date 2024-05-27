import Gtk from "gi://Gtk?version=3.0";
import { transition } from "src/services/functions";
import { Binding } from "types/types/service";
import { weatherFetched, weatherWidget } from "src/widgets/weather";
import { brightnessWidget } from "src/widgets/brightness";
import { audioWidget } from "src/widgets/audio";
import { batteryWidget } from "src/widgets/battery";
import { css } from "src/services/css";
import { clockWidget } from "src/widgets/clock";
import { dateWidget } from "src/widgets/date";
import { entryWidget } from "./widgets/entry";
import * as splash from "src/splash.json";
import { subheader } from "./widgets/subheader";
import { separator } from "./widgets/separator";
import { MprisPlayer } from "types/types/service/mpris";
import { MprisWidget, playerWidget } from "src/widgets/player";

// definition of lock screen
export const entry = async ({
  onUnlock,
  animationDuration,
  staggerDuration,
}: {
  onUnlock: () => void;
  animationDuration: number;
  staggerDuration: number;
}) => {
  // services
  const batteryService = await Service.import("battery");
  const audioService = await Service.import("audio");
  const mprisService = await Service.import("mpris");

  // to be disposed of once the lock has finished.
  let disposables: any = [];

  // definition of the window passed to gtk-session-lock
  const lockWindow = ({ child }: { child: Gtk.Widget }) =>
    new Gtk.Window({
      name: "lock", //not respected, so not hoisted.
      child: child,
    });

  // definition of the grid in which elements lie on the lock screen
  const grid = ({
    left,
    center,
    right,
  }: {
    left?: Gtk.Widget;
    center?: Gtk.Widget;
    right?: Gtk.Widget;
  }) => {
    const box = Widget.CenterBox({
      css: css.backgroundColorRGBA({
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0,
      }),
    });
    if (left) box.start_widget = left;
    if (center) box.center_widget = center;
    if (right) box.end_widget = right;

    return box;
  };

  // definition of the main center container
  const entryContainer = ({ children }: { children: Gtk.Widget[] }) =>
    Widget.Revealer({
      revealChild: transition({
        from: false,
        to: true,
        duration: staggerDuration,
      }).bind(),
      transition: "crossfade",
      transitionDuration: animationDuration,
      child: Widget.Box({
        css: "",
        homogeneous: false, //revealers do not work if homogeneous
        vertical: true,
        spacing: 0,
        vpack: "center",
        children: children,
      }),
    });

  // definition of container for bottom widgets
  const widgetBox = ({ widgets }: { widgets: Gtk.Widget[][] }) =>
    Widget.Revealer({
      reveal_child: transition({
        from: false,
        to: true,
        duration: staggerDuration * 1.1,
      }).bind(),
      transition: "slide_down",
      transition_duration: animationDuration,
      child: Widget.Box({
        css: "",
        homogeneous: false,
        vertical: true,
        hpack: "center",
        vpack: "center",
        children: widgets.map((widgetList) =>
          Widget.Box({
            homogeneous: false,
            hpack: "center",
            vpack: "center",
            children: widgetList,
          })
        ),
      }),
    });

  // definition of container for widgets
  // used to hide in case the widget is not available immediately
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

  // construct the widgets
  // _ denotes instantiated reference
  const width = 30;

  // === HEADER ===

  const _clock = clockWidget({
    style: css.fontSize({ size: 4 }) + css.fontWeight({ weight: "bold" }),
  });

  // === SUBHEADER ===

  const subheaderStyle =
    css.fontSize({ size: 2 }) +
    css.fontStyle({ style: "italic" }) +
    css.fontWeight({ weight: "200" }) +
    css.padding({ bottom: 0.25 });

  const _errorLabel = Widget.Label({
    css: subheaderStyle,
    label: "Authentication Failure",
  });
  const _dateLabel = dateWidget({ style: subheaderStyle });

  const splashText = Variable("", {
    poll: [
      20000,
      () => splash.text[Math.floor(Math.random() * splash.text.length)],
    ],
  });

  splashText.stopPoll();

  setTimeout(() => {
    splashText.startPoll();
  }, animationDuration);

  disposables.push(splashText);
  const _splashLabel = Widget.Label({
    css: subheaderStyle,
    label: splashText.bind(),
  });
  const subheaderState = Variable("splash", {
    poll: [
      10000,
      (self) =>
        self.value === "error"
          ? self.value
          : self.value === "date"
          ? "splash"
          : "date",
    ],
  });

  disposables.push(subheaderState);

  const _subheader = subheader({
    errorLabel: _errorLabel,
    dateLabel: _dateLabel,
    splashLabel: _splashLabel,
    shown: subheaderState.bind(),
    animationDuration: animationDuration,
    transition: "slide_up",
  });

  // === PASSWORD ENTRY ===

  const _entry = entryWidget({
    width: width,
    onUnlock: () => {
      // perform unlock hook
      onUnlock();

      // then dispose of unwanted polls
      disposables.forEach((it) => it.dispose());
      disposables = [];
    },
    onError: (e) => {
      subheaderState.setValue("error");
    },
  });

  const _separator = separator({
    style:
      css.margin({ bottom: 1 }) +
      css.backgroundColorGTK({
        color: "@insensitive_fg_color",
      }),
  });

  // === WIDGETS ===

  const widgetStyle = css.paddingAll({ padding: 1 });

  const iconStyle =
    css.minWidth({ width: 3 }) +
    css.minHeight({ height: 3 }) +
    css.fontSize({ size: 0.2 });

  const weather = () =>
    weatherWidget({
      style:
        css.minWidth({ width: 6 }) +
        css.fontWeight({ weight: "bold" }) +
        css.marginAll({ margin: 1 }) +
        css.fontSize({ size: 2 }),
    });

  const _weatherRevealer = widgetRevealer({
    transition: "slide_right",
    reveal: weatherFetched.bind(),
    child: weather(),
  });

  const batteryAvailable = batteryService.bind("available");

  const battery = async () =>
    Widget.Box({
      css: widgetStyle,
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
          css.fontSize({ size: 2 }) +
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
      css: widgetStyle,
      child: await audioWidget({
        overlayStyle: "",
        indicatorStyle:
          iconStyle +
          css.ColorRGBA({ red: 243, green: 128, blue: 25, alpha: 1 }),
        iconStyle:
          css.fontSize({ size: 2 }) +
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
      css: widgetStyle,
      child: await brightnessWidget({
        overlayStyle: "",
        indicatorStyle:
          iconStyle +
          css.ColorRGBA({ red: 250, green: 189, blue: 47, alpha: 1 }),
        iconStyle:
          css.fontSize({ size: 1.75 }) +
          css.ColorRGBA({ red: 250, green: 189, blue: 47, alpha: 1 }),
        startAt: 0.25,
        rounded: true,
      }),
    });

  const _player = await MprisWidget({
    width: width + 1,
    height: 5,
    titleMaxCharWidth: 15,
    artistMaxCharWidth: 15,
    animationDuration: animationDuration,
    playerDuration: 10000,
    playerTransition: "crossfade",
    widgetTransition: "slide_up",
    playerStyle: "",
  });

  // === CONSTRUCTION ===

  const _widgets = widgetBox({
    widgets: [
      [_player],
      //if you have the monitor to use the lock screen, it has a brightness.
      [_batteryRevealer, _audioRevealer, await brightness(), _weatherRevealer],
    ],
  });

  return lockWindow({
    child: grid({
      center: entryContainer({
        children: [_clock, _subheader, _separator, _entry, _widgets],
      }),
    }),
  });
};
