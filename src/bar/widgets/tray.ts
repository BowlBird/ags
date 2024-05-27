import { transition as openTransition } from "src/services/functions";

export const trayWidget = async ({
  spacing,
  size,
  transition,
  transitionDuration,
}: {
  spacing: number;
  size: number;
  transition: string;
  transitionDuration: number;
}) => {
  const tray = await Service.import("systemtray");
  let widgetCache: string[] = [];

  const itemWidget = ({ item }: { item: any }) =>
    Widget.Revealer({
      transition: transition as any,
      transition_duration: transitionDuration,
      reveal_child: widgetCache.includes(item.id)
        ? true
        : openTransition({
            from: false,
            to: true,
            duration: 0,
          }).bind(),
      child: Widget.Button({
        child: Widget.Icon({
          size: size,
          icon: item.icon,
        }),
        on_primary_click: (_, event) => item.openMenu(event),
        on_secondary_click: (_, event) => item.openMenu(event),
        tooltip_markup: item.tooltip_markup,
      }),
    });

  const items = tray.bind("items").as((items) => {
    const temp = items
      .sort((a, b) => a.category.localeCompare(b.category))
      .map((it) => itemWidget({ item: it }));

    widgetCache = [];
    items.forEach((it) => widgetCache.push(it.id));

    return temp;
  });

  return Widget.Box({
    spacing: spacing,
    children: items,
  });
};
