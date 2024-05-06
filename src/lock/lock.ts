// https://github.com/Cu3PO42/gtk-session-lock/tree/master
//@ts-ignore local installation
import Lock from "gi://GtkSessionLock";
import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import { attachWindow, detachWindow } from "src/functions";
import { lockScreenBlur, lockScreenImage } from "./background";
import { entry as entry } from "./entry";
import Window from "types/types/widgets/window";

// function that enables locking the screen
export const lock = async ({
  debugDuration,
  animationDuration,
  staggerDuration,
  layerName,
  background,
  blur,
}: {
  debugDuration: number;
  animationDuration: number;
  staggerDuration: number;
  layerName: string;
  background?: string;
  blur: boolean;
}) => {
  // Ccheck for lock
  if (globalThis.lock.isLocked) {
    log("tried to lock the screen twice!");
    return; //don't try to lock twice weirdo
  }

  // lock the screen
  const gtkLock = Lock.prepare_lock();
  gtkLock.lock_lock();
  globalThis.lock.isLocked = true;

  let detachables: any[] = [];

  // set up unlock function
  let unlock = () => {
    gtkLock.unlock_and_destroy();
    detachables.forEach((name) => detachWindow({ windowName: name }));
    detachables = [];
    globalThis.lock.isLocked = false;
  };

  // for debugging purposes, kill the lock after a given amount of time (in case a problem arises)
  //@ts-ignore
  if (globalThis.lock.debug) setTimeout(unlock, debugDuration);

  // create lock screen
  let lockUI = await entry({
    onUnlock: unlock,
    animationDuration: animationDuration,
    staggerDuration: staggerDuration,
  });

  // returns primary monitor, or monitor 0 if no primary is set.
  const display = Gdk.Display.get_default()!;
  const lockUIMonitor =
    display.get_primary_monitor() ??
    (() => {
      log("No primary monitor, using monitor 0.");
      return display.get_monitor(0);
    })();

  // attach lock screen and show
  gtkLock.new_surface(lockUI, lockUIMonitor);
  lockUI.show_all();

  // blur or display wallpaper for rest of screens.
  forAllMonitors((monitor) => {
    const layers: Window<any, any>[] = [];
    if (background)
      layers.push(
        lockScreenImage({
          name: `${layerName}-background`,
          image: background,
          staggerDuration: staggerDuration,
          animationDuration: animationDuration,
        })
      );
    if (blur) layers.push(lockScreenBlur({ name: `${layerName}-blur` }));
    layers.forEach((layer) => {
      attachWindow({ window: layer, monitor: monitor });
      layer.show_all();
      detachables.push(layer.name);
    });
  });
};

function forAllMonitors(func: (monitor: number) => void) {
  const display = Gdk.Display.get_default();
  if (!display) {
    log("couldn't connect to display!");
    return;
  }
  for (let i = 0; i < display.get_n_monitors()!; i++) {
    func(i);
  }
}
