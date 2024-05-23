// DOTW, MONTH DD, YYYY format
const currentDate = Variable("", {
  poll: [1000, ["date", "+%A, %B %d, %Y"]],
});

const currentShortDate = Variable("", {
  poll: [1000, ["date", "+%a, %b %d"]],
});

// definition of date, in revealer for animation
export const dateWidget = ({ style }: { style: string }) =>
  Widget.Label({
    css: style,
    label: currentDate.bind(),
  });

export const shortDateWidget = ({ style }: { style: string }) =>
  Widget.Label({
    css: style,
    label: currentShortDate.bind(),
  });
