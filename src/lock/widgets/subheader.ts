import { Binding } from "types/types/service";
import Label from "types/types/widgets/label";

export const subheader = ({
  errorLabel,
  dateLabel,
  splashLabel,
  shown,
  animationDuration,
  transition,
}: {
  errorLabel: Label<any>;
  dateLabel: Label<any>;
  splashLabel: Label<any>;
  shown: any;
  animationDuration: number;
  transition: any;
}) =>
  Widget.Stack({
    children: {
      error: errorLabel,
      date: dateLabel,
      splash: splashLabel,
    },
    transition: transition,
    transitionDuration: animationDuration,
    shown: shown,
  });
