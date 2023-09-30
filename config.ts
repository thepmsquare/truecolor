interface Config {
  appName: string;
  defaultThemeState: "dark" | "light";
  defaultFont: string;
}
const config: Config = {
  appName: "truecolor",
  defaultThemeState: "dark",
  defaultFont: "roboto",
};

export default config;
