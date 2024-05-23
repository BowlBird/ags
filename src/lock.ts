import { lock } from "./lock/lock";

/**
 * lock object to interact with lock screen.
 *
 * Call lock.lock to lock the system.
 *
 * isLocked is used to determine if the system is locked.
 */
globalThis.lock = {
  lock: () =>
    lock({
      debugDuration: 5000,
      animationDuration: 1000,
      staggerDuration: 500,
      layerName: "lock",
      background: "/home/carson/Pictures/wallpaper.png",
      blur: true,
    }),
  isLocked: false,
  debug: false,
  onUnlock: () => {},
};
