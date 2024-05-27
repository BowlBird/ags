import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import Window from "types/types/widgets/window";

var HOME_DIR = Utils.exec('bash -c "echo $HOME"');
var ICON_CACHE = "iconCache";

export function IconFromClass(initialClass): Promise<string> {
  return new Promise(function (resolve, _) {
    //get from cache
    try {
      var iconCache = Utils.readFile(ICON_CACHE)
        .split("\n")
        .filter((line) => line.includes(initialClass))[0]
        .split("=")[1];

      resolve(iconCache);
      // failed! get from desktop files
    } catch {
      try {
        var systemApplication = Utils.readFile(
          `/usr/share/applications/${Utils.exec(
            `bash -c "ls /usr/share/applications | grep -i ${initialClass} | head -n 1"`
          )}`
        );
        var localApplication = Utils.readFile(
          `${HOME_DIR}/.local/share/applications/${Utils.exec(
            `bash -c "ls ${HOME_DIR}/.local/share/applications | grep -i ${initialClass} | head -n 1"`
          )}`
        );

        //               one should be empty
        var icon = (systemApplication + localApplication)
          .split("\n")
          .filter((line) => line.includes("Icon"))[0]
          .split("=")[1];

        //cache
        Utils.writeFile(
          `${Utils.readFile(ICON_CACHE)}${initialClass}=${icon}\n`,
          ICON_CACHE
        ).catch(() => resolve("unknown"));
        resolve(icon);
        // failed! don't know what the icon is!
      } catch {
        resolve("unknown");
      }
    }
  });
}

/**
 * helper function for attaching window to display after creation
 *
 * @param window the window to be attached
 * @param monitor the monitor to display it on
 */
export const attachWindow = ({
  window,
  monitor,
}: {
  window: Window<any, any>;
  monitor?: number;
}) => {
  if (monitor) window.monitor = monitor;
  App.addWindow(window);
  App.applyCss(`${App.configDir}/style.css`);
};

/**
 * helper function for detaching window from display
 *
 * @param windowName a string representing the name of the window to be detached
 */
export const detachWindow = ({ windowName }: { windowName: string }) => {
  App.removeWindow(windowName);
};

export function forAllMonitors(func: (monitor: number) => void) {
  const display = Gdk.Display.get_default();
  if (!display) {
    log("couldn't connect to display!");
    return;
  }
  for (let i = 0; i < display.get_n_monitors()!; i++) {
    func(i);
  }
}

/**
 * A variable that will transition from a given value to another over duration
 *
 * @param from the value that will be used initially
 * @param to the value that it will become
 * @returns a variable to be binded to.
 */
export const transition = ({
  from,
  to,
  duration,
}: {
  from: any;
  to: any;
  duration: number;
}) => {
  let container = Variable(from);
  setTimeout(() => {
    container.setValue(to);
  }, duration);
  return container;
};

/**
 * logs message to console if logging is enabled
 *
 * @param message
 */
export function log(message: string) {
  if (globalThis.logging) print(message);
}
