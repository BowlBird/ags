import { css } from "src/services/css";

// definition of battery widget
export const batteryWidget = async ({
  batteryIndicatorStyle,
  dischargeIndicatorStyle,
  chargingIndicatorStyle,
  overlayStyle,
  iconStyle,
  rounded,
  startAt,
}: {
  batteryIndicatorStyle: string;
  dischargeIndicatorStyle: string;
  chargingIndicatorStyle: string;
  overlayStyle: string;
  iconStyle: string;
  rounded: boolean;
  startAt: number;
}) => {
  // Service Imports
  const battery = await Service.import("battery");

  // binds
  const decimalBatteryPercent = battery.bind("percent").as((p) => p / 100);
  const decimalHourlyChange = Utils.merge(
    [battery.bind("energy_rate"), battery.bind("energy_full")],
    (rate, capacity) => rate / capacity
  );

  const dischargeStartAt = Utils.merge(
    [decimalBatteryPercent, battery.bind("charging"), decimalHourlyChange],
    (percent, isCharging, hourlyChange) =>
      (percent + startAt - (isCharging ? 0 : Math.min(percent, hourlyChange))) %
      1
  );

  const changePercent = Utils.merge(
    [decimalHourlyChange, battery.bind("charging"), decimalBatteryPercent],
    (hourlyChange, isCharging, percent) =>
      Math.min(hourlyChange, isCharging ? 1 - percent : percent)
  );
  const batteryIcon = battery
    .bind("percent")
    .as((p) => `battery-level-${Math.floor(p / 10) * 10}-symbolic`);

  const changeStyle = Utils.merge(
    [battery.bind("charging"), battery.bind("energy_rate")],
    (isCharging, rate) =>
      isCharging
        ? chargingIndicatorStyle
        : rate !== 0
        ? dischargeIndicatorStyle
        : css.ColorRGBA({ red: 0, green: 0, blue: 0, alpha: 0 })
  );

  // definition of container that holds all layers
  const widgetOverlay = ({ bottom, overlays }: { bottom; overlays }) =>
    Widget.Overlay({
      css: overlayStyle,
      child: bottom,
      overlays: overlays,
    });

  // definition of circle that represents absolute battery percentage
  const batteryIndicator = () =>
    Widget.CircularProgress({
      css: batteryIndicatorStyle,
      start_at: startAt,
      rounded: rounded,
      value: decimalBatteryPercent,
    });

  // definition of circle that represents battery discharge in an hour
  const changeIndicator = () =>
    Widget.CircularProgress({
      css: changeStyle,
      start_at: dischargeStartAt,
      rounded: rounded,
      value: changePercent,
    });

  // definition of battery icon
  const icon = () =>
    Widget.Icon({
      css: iconStyle,
      icon: batteryIcon,
    });

  // construction
  return widgetOverlay({
    bottom: batteryIndicator(),
    overlays: [changeIndicator(), icon()],
  });
};
