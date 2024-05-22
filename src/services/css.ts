/**
 * Wrapper object for building css
 */
export const css = {
  backgroundColorGTK: ({ color }: { color: string }) =>
    `background-color: ${color};`,
  backgroundColorRGBA: ({
    red,
    green,
    blue,
    alpha,
  }: {
    red: number;
    green: number;
    blue: number;
    alpha: number;
  }) => `background-color: rgba(${red},${green},${blue},${alpha});`,
  backgroundLinearGradient: ({
    degrees,
    transitionPoint,
    fromRed,
    fromGreen,
    fromBlue,
    fromAlpha,
    toRed,
    toGreen,
    toBlue,
    toAlpha,
  }: {
    degrees: number;
    transitionPoint: number;
    fromRed: number;
    fromGreen: number;
    fromBlue: number;
    fromAlpha: number;
    toRed: number;
    toGreen: number;
    toBlue: number;
    toAlpha: number;
  }) =>
    `background: linear-gradient(${degrees}deg, rgba(${fromRed}, ${fromGreen}, ${fromBlue}, ${fromAlpha}) ${transitionPoint}%, rgba(${toRed}, ${toGreen}, ${toBlue}, ${toAlpha}));`,
  backgroundImage: ({ image }: { image: string }) =>
    `background-image: url('${image}');`,
  backgroundSize: ({ size }: { size: "auto" | "contain" | "cover" }) =>
    `background-size: ${size};`,
  backgroundPosition: ({
    horizontal,
    vertical,
  }: {
    horizontal: "left" | "center" | "right";
    vertical: "top" | "center" | "bottom";
  }) => `background-position: ${horizontal} ${vertical};`,
  ColorRGBA: ({
    red,
    green,
    blue,
    alpha,
  }: {
    red: number;
    green: number;
    blue: number;
    alpha: number;
  }) => `color: rgba(${red},${green},${blue},${alpha});`,
  padding: ({
    top,
    left,
    right,
    bottom,
  }: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  }) =>
    `padding: ${top ? top : 0}rem ${right ? right : 0}rem ${
      bottom ? bottom : 0
    }rem ${left ? left : 0}rem;`,
  paddingAll: ({ padding }: { padding: number }) => `padding: ${padding}rem;`,
  marginAll: ({ margin }: { margin: number }) => `margin: ${margin}rem;`,
  margin: ({
    top,
    left,
    right,
    bottom,
  }: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  }) =>
    `margin: ${top ? top : 0}rem ${right ? right : 0}rem ${
      bottom ? bottom : 0
    }rem ${left ? left : 0}rem;`,
  fontSize: ({ size }: { size: number }) => `font-size: ${size}rem;`,
  fontWeight: ({
    weight,
  }: {
    weight:
      | "100"
      | "200"
      | "300"
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900"
      | "normal"
      | "bold"
      | "bolder"
      | "lighter"
      | "initial"
      | "inherit";
  }) => `font-weight: ${weight};`,
  fontStyle: ({ style }: { style: "normal" | "italic" | "oblique" }) =>
    `font-style: ${style};`,
  minWidth: ({ width }: { width: number }) => `min-width: ${width}rem;`,
  minHeight: ({ height }: { height: number }) => `min-height: ${height}rem;`,
  borderRadius: ({ radius }: { radius: number }) =>
    `border-radius: ${radius}rem;`,
  borderAll: ({
    width,
    type,
    red,
    green,
    blue,
    alpha,
  }: {
    width: number;
    type:
      | "none"
      | "hidden"
      | "dotted"
      | "dashed"
      | "solid"
      | "double"
      | "groove"
      | "ridge"
      | "inset"
      | "outset";
    red: number;
    green: number;
    blue: number;
    alpha: number;
  }) =>
    `border: ${width}rem ${type} rgba(${red}, ${green}, ${blue}, ${alpha});`,
  borderTop: ({
    width,
    type,
    red,
    green,
    blue,
    alpha,
  }: {
    width: number;
    type:
      | "none"
      | "hidden"
      | "dotted"
      | "dashed"
      | "solid"
      | "double"
      | "groove"
      | "ridge"
      | "inset"
      | "outset";
    red: number;
    green: number;
    blue: number;
    alpha: number;
  }) =>
    `border-top: ${width}rem ${type} rgba(${red}, ${green}, ${blue}, ${alpha});`,
  borderRight: ({
    width,
    type,
    red,
    green,
    blue,
    alpha,
  }: {
    width: number;
    type:
      | "none"
      | "hidden"
      | "dotted"
      | "dashed"
      | "solid"
      | "double"
      | "groove"
      | "ridge"
      | "inset"
      | "outset";
    red: number;
    green: number;
    blue: number;
    alpha: number;
  }) =>
    `border-right: ${width}rem ${type} rgba(${red}, ${green}, ${blue}, ${alpha});`,
  borderBottom: ({
    width,
    type,
    red,
    green,
    blue,
    alpha,
  }: {
    width: number;
    type:
      | "none"
      | "hidden"
      | "dotted"
      | "dashed"
      | "solid"
      | "double"
      | "groove"
      | "ridge"
      | "inset"
      | "outset";
    red: number;
    green: number;
    blue: number;
    alpha: number;
  }) =>
    `border-bottom: ${width}rem ${type} rgba(${red}, ${green}, ${blue}, ${alpha});`,
  borderLeft: ({
    width,
    type,
    red,
    green,
    blue,
    alpha,
  }: {
    width: number;
    type:
      | "none"
      | "hidden"
      | "dotted"
      | "dashed"
      | "solid"
      | "double"
      | "groove"
      | "ridge"
      | "inset"
      | "outset";
    red: number;
    green: number;
    blue: number;
    alpha: number;
  }) =>
    `border-left: ${width}rem ${type} rgba(${red}, ${green}, ${blue}, ${alpha});`,
  boxShadow: ({
    red,
    green,
    blue,
    alpha,
    horizontal,
    vertical,
    blur,
    spread,
  }: {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    horizontal: number;
    vertical: number;
    blur: number;
    spread: number;
  }) =>
    `box-shadow: rgba(${red}, ${green}, ${blue}, ${alpha}) ${horizontal}rem ${vertical}rem ${blur}rem ${spread}rem;`,
};
