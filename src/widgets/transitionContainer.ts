export const transitionContainer = ({
  binding,
  transition,
  transitionDuration,
}: {
  binding: any;
  transition: string;
  transitionDuration: number;
}) => {
  const firstWidget = Variable<any>(undefined);
  const secondWidget = Variable<any>(undefined);

  const _stack = Widget.Stack({
    transition: transition as any,
    transition_duration: transitionDuration,
    children: {
      first: Widget.Box({
        child: firstWidget.bind(),
      }),
      second: Widget.Box({
        child: secondWidget.bind(),
      }),
    },
    shown: "first",
  });
  Utils.merge([binding], (widget) => {
    (_stack.shown === "first" ? secondWidget : firstWidget).setValue(widget);
    if (_stack.shown === "first" && _stack.children.second) {
      _stack.shown = "second";
    } else if (_stack.shown === "second" && _stack.children.first) {
      _stack.shown = "first";
    }
  });

  return _stack;
};
