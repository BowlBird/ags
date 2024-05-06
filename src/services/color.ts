export function colorsFromImage({ path }: { path: string }): Promise<string> {
  return Utils.execAsync([App.configDir + `/src/services/color.py`, path]);
}
