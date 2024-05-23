import { System } from "src/bar/system";
import { SysTray } from "src/bar/tray";
import { Workspaces } from "src/bar/workspaces";
import { attachWindow, detachWindow } from "./services/functions";
import { bar } from "./bar/bar";

const windowName = "bar";

globalThis.bar = {
  start: async (monitor = 0) =>
    attachWindow({
      window: await bar({
        monitor: monitor,
        windowName: windowName,
        animationDuration: 1000,
      }),
    }),
  stop: () => detachWindow({ windowName: windowName }),
};
