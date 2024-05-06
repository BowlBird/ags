export const weatherFetched = Variable(false);
const currentWeather = Variable("", {
  poll: [
    3600000,
    "wttrbar --main-indicator temp_F --fahrenheit",
    (out) => {
      weatherFetched.setValue(true);
      return JSON.parse(out).text + "°F";
    },
  ],
});

export const weatherWidget = ({ style }: { style: string }) =>
  Widget.Label({
    css: style,
    label: currentWeather.bind(),
  });
export default {};
