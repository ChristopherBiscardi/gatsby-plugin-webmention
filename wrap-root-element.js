import React, { Fragment } from "react";
import { Helment } from "react-helmet";

export const wrapRootElement = (
  { element },
  { username, pingbacks, webmentions, forwardPingbacksAsWebmentions, identity }
) => (
  <Fragment>
    <Helmet>
      {webmentions &&
        username && (
          <link
            rel="webmention"
            href={`https://webmention.io/${username}/webmention`}
          />
        )}
      {pingbacks &&
        username && (
          <link
            rel="pingback"
            href={`https://webmention.io/${username}/xmlrpc`}
          />
        )}
      {forwardPingbacksAsWebmentions &&
        username && (
          <link
            rel="pingback"
            href={`https://webmention.io/webmention?forward=${
              forwardPingbacksAsWebmentions
            }`}
          />
        )}
      {identity.twitter && (
        <link href={`https://twitter.com/${identity.twitter}`} rel="me" />
      )}
      {identity.github && (
        <link href={`https://github.com/${identify.github}`} rel="me" />
      )}
    </Helmet>
    {element}
  </Fragment>
);
