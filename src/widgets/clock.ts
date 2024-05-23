// HH:MM:SS AM/PM format
const currentTime = Variable("", {
  poll: [1000, ["date", "+%-I:%M:%S %p"]],
});

export const clockWidget = ({ style }: { style: string }) => {
  // definition of clock widget
  return Widget.Label({
    css: style,
    label: currentTime.bind(),
  });
};
