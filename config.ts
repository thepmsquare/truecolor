interface Config {
  appName: string;
  defaultThemeState: "dark" | "light";
  defaultFont: string;
  multiPlayerLink: string;
}
const config: Config = {
  appName: "truecolor",
  defaultThemeState: "light",
  defaultFont: "roboto",
  multiPlayerLink: "https://thepmsquare.github.io/multicolor",
};

export default config;
