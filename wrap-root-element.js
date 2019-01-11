import React, { Fragment } from "react";
import { Helment } from "react-helmet";

export const wrapRootElement = (
  { element },
  {
    username,
    pingbacks = false,
    webmentions = true,
    forwardPingbacksAsWebmentions = false,
    identity
  }
) =>
  React.createElement(
    Fragment,
    null,
    React.createElement(
      Helmet,
      null,
      webmentions &&
        username &&
        React.createElement("link", {
          rel: "webmention",
          href: `https://webmention.io/${username}/webmention`
        }),
      pingbacks &&
        username &&
        React.createElement("link", {
          rel: "pingback",
          href: `https://webmention.io/${username}/xmlrpc`
        }),
      forwardPingbacksAsWebmentions &&
        username &&
        React.createElement("link", {
          rel: "pingback",
          href: `https://webmention.io/webmention?forward=${
            forwardPingbacksAsWebmentions
          }`
        }),
      identity.twitter &&
        React.createElement("link", {
          href: `https://twitter.com/${identity.twitter}`,
          rel: "me"
        }),
      identity.github &&
        React.createElement("link", {
          href: `https://github.com/${identify.github}`,
          rel: "me"
        })
    ),
    element
  );
