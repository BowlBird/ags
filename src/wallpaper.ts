import { stopWallpaper, wallpaper } from "./wallpaper/wallpaper";

const layerName = "wallpaper";

/**
 * wallpaper object to interact with wallpaper.
 *
 * wallpaper.start() will start showing the wallpaper.
 *
 * wallpaper.stop() will stop showing the wallpaper.
 *
 * wallpaper.reload() will reload the wallpaper (for updating background)
 *
 */
globalThis.wallpaper = {
  start: () =>
    wallpaper({
      layerName: layerName,
      wallpaper: "/home/carson/Pictures/wallpaper.png",
    }),
  stop: () => stopWallpaper({ layerName: layerName }),
  reload: () => {
    globalThis.wallpaper.stop();
    globalThis.wallpaper.start();
  },
  debug: false,
  isStarted: false,
};
