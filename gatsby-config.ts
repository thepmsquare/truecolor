import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `truecolor`,
    siteUrl: `https://thepmsquare.github.io/truecolor`,
    // TODO
    description: ``,
  },
  pathPrefix: "/truecolor",
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: false,
  plugins: [
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: `truecolor`,
        short_name: `truecolor`,
        start_url: "/",
        icon: "src/images/truecolor.svg",
        display: "fullscreen",
        background_color: `#000000`,
        theme_color: `#00ffff`,
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    `gatsby-plugin-offline`,
  ],
};

export default config;
