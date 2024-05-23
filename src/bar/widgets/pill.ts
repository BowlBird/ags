export const pillsContainer = ({
  pillStyle,
  containerStyle,
  containerSpacing,
  widgetSpacing,
  children,
}: {
  pillStyle: string;
  containerStyle;
  containerSpacing: number;
  widgetSpacing: number;
  children: any[][];
}) => {
  const pill = ({ children }: { children: any }) =>
    Widget.Box({
      css: pillStyle,
      spacing: widgetSpacing,
      children: children,
    });
  const pills = children.map((childList, i) =>
    pill({
      children: childList,
    })
  );

  return Widget.Box({
    css: containerStyle,
    spacing: containerSpacing,
    children: pills,
  });
};
