export interface RGB {
  red: number;
  green: number;
  blue: number;
}

export interface Palette {
  primary: RGB;
  secondary: RGB;
  background: RGB;
}

export function colorsFromImage({ path }: { path: string }): Promise<Palette> {
  return new Promise((resolve, reject) => {
    Utils.execAsync([App.configDir + `/src/services/color.py`, path])
      .then((palette) => resolve(JSON.parse(palette) as Palette))
      .catch((reason) => reject(reason));
  });
}

export function synchronousColorsFromImage({
  path,
}: {
  path: string;
}): Palette {
  return JSON.parse(
    Utils.exec([App.configDir + `/src/services/color.py`, path])
  ) as Palette;
}
