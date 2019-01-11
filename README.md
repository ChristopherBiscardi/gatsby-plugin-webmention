# Gatsby Plugin Webmention

A Gatsby plugin that handles installing and sourcing for webmention.io.

# Installation

```shell
yarn add gatsby-plugin-webmention
```

# Getting Started

1. Configure the identities you want to use to log in to
   [webmention.io](https://webmention.io) using the `identity` option.
1. Deploy that so the generated HTML tags are visible to webmention.io.
1. You can now log into webmention.io and get your username. Put your new
   username in the config as well and redeploy.

# Config

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-webmention`,
      options: {
        username: undefined, // webmention.io username
        identity: {
          github: "username",
          twitter: "username" // no @
        },
        mentions: true,
        pingbacks: false,
        forwardPingbacksAsWebmentions: "https://example.com/endpoint",
        domain: "example.com",
        token: process.env.WEBMENTIONS_TOKEN
      }
    }
  ]
};
```

# Brid.gy

Consider setting up [brid.gy](https://brid.gy/) to get Tweets sent as
webmentions to webmention.io.
