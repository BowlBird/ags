import { attachWindow, detachWindow } from "./services/functions";
import { bar } from "./bar/bar";

const windowName = "bar";

globalThis.bar = {
  start: async (monitor = 0) =>
    attachWindow({
      window: await bar({
        monitor: monitor,
        windowName: windowName,
        animationDuration: 300,
        height: 2.2,
      }),
    }),
  stop: () => detachWindow({ windowName: windowName }),
};
