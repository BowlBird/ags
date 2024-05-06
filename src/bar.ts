import { System } from "src/bar/system";
import { SysTray } from "src/bar/tray";
import { Workspaces } from "src/bar/workspaces";
import { attachWindow, detachWindow } from "./functions";

const windowName = "bar";

const bar = (monitor = 0) =>
  Widget.Window({
    name: windowName,
    class_name: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      start_widget: Widget.Box({
        spacing: 0,
        children: [Workspaces()],
      }),
      center_widget: Widget.Box({
        spacing: 0,
        children: [],
      }),
      end_widget: Widget.Box({
        hpack: "end",
        children: [SysTray(), System()],
      }),
    }),
  });
globalThis.bar = {
  start: (monitor = 0) => attachWindow(bar(monitor)),
  stop: () => detachWindow(windowName),
};

export default {};
