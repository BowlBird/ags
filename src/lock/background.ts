import { transition } from "src/services/functions";
import { Screen } from "types/types/@girs/gdk-3.0/gdk-3.0.cjs";

// definition of blur layer that sits behind the lock screen
export const lockScreenBlur = ({ name }: { name: string }) =>
  Widget.Window({
    name: name,
    class_name: "lock-blur",
    exclusivity: "ignore",
    anchor: ["top", "left", "right", "bottom"],
  });

// definition of background used if blur is disabled
export const lockScreenImage = ({
  name,
  image,
  staggerDuration,
  animationDuration,
}: {
  name: string;
  image: string;
  staggerDuration: number;
  animationDuration: number;
}) =>
  Widget.Window({
    name: name,
    class_name: "lock-image",
    exclusivity: "ignore",
    anchor: ["top", "left", "right", "bottom"],
    child: Widget.Revealer({
      reveal_child: transition({
        from: false,
        to: true,
        duration: staggerDuration,
      }).bind(),
      transition: "crossfade",
      transition_duration: animationDuration,
      child: Widget.Icon({
        size: Screen.width(),
        icon: image,
      }),
    }),
  });
