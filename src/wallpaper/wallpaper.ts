import {
  attachWindow,
  detachWindow,
  forAllMonitors,
} from "src/services/functions";
import { Screen } from "types/types/@girs/gdk-3.0/gdk-3.0.cjs";

export const wallpaper = ({
  layerName,
  wallpaper,
}: {
  layerName: string;
  wallpaper: string;
}) => {
  if (!globalThis.wallpaper.isStarted) {
    forAllMonitors((monitor) => {
      const window = Widget.Window({
        layer: "background",
        exclusivity: "ignore",
        name: `${layerName}-${monitor}`,
        child: Widget.Icon({
          size: Screen.width(),
          icon: wallpaper,
        }),
      });
      attachWindow({ window: window, monitor: monitor });
      window.show_all();
    });

    globalThis.wallpaper.isStarted = true;
  } else log("Tried to start wallpaper while it's already running!");
};

export const stopWallpaper = ({ layerName }: { layerName: string }) => {
  if (globalThis.wallpaper.isStarted) {
    forAllMonitors((monitor) => {
      detachWindow({ windowName: `${layerName}-${monitor}` });
    });
    globalThis.wallpaper.isStarted = false;
  } else log("Tried to stop wallpaper while it's not running!");
};
