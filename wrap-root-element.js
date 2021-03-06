import React, { Fragment } from "react";
import { Helmet } from "react-helmet";

export const wrapRootElement = (
  { element },
  {
    username,
    pingbacks = false,
    webmentions = true,
    forwardPingbacksAsWebmentions = false,
    identity = {}
  } = {}
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
          href: `https://webmention.io/webmention?forward=${forwardPingbacksAsWebmentions}`
        }),
      identity &&
        identity.twitter &&
        React.createElement("link", {
          href: `https://twitter.com/${identity.twitter}`,
          rel: "me"
        }),
      identity &&
        identity.github &&
        React.createElement("link", {
          href: `https://github.com/${identity.github}`,
          rel: "me"
        }),
      identity &&
        identity.email &&
        React.createElement("link", {
          href: `mailto:${identity.email}`,
          rel: "me"
        })
    ),
    element
  );
