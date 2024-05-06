// DOTW, MONTH DD, YYYY format
const currentDate = Variable("", {
  poll: [1000, ["date", "+%A, %B %d, %Y"]],
});

// definition of date, in revealer for animation
export const date = ({ style }: { style: string }) =>
  Widget.Label({
    css: style,
    label: currentDate.bind(),
  });
