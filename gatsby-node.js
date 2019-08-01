const fetch = require("node-fetch");
const queryString = require("query-string");
const camelcaseKeys = require("camelcase-keys");
const createNodeHelpers = require("gatsby-node-helpers").default;

const {
  createNodeFactory,
  generateNodeId
} = createNodeHelpers({
  typePrefix: `WebMention`
});
const ENTRY_TYPE = `Entry`;
const WebMentionEntryNode = createNodeFactory(ENTRY_TYPE, entry => ({
  ...entry,
  id: generateNodeId(ENTRY_TYPE, entry.wmId.toString())
}));

// get all mentions for a token and a specific domain
const getMentions = async ({ domain, token, perPage = 10000 }) => {
  return fetch(
    `https://webmention.io/api/mentions.jf2?${queryString.stringify({
      domain,
      token,
      "per-page": perPage
    })}`
  )
    .then(response => response.json())
    .then(mentions => {
      if (!mentions || !mentions.children) {
        return [];
      }
      return camelcaseKeys(mentions.children);
    });
};

exports.sourceNodes = (
  { actions, reporter },
  { token, domain, fetchLimit }
) => {
  const { createNode, createTypes } = actions;

  const typeDefs = `
    type WebMentionEntry implements Node {
      type: String
      author: WebMentionAuthor
      content: WebMentionContent
      url: String
      published: Date @dateformat
      wmReceived: Date @dateformat
      wmId: Int
      wmPrivate: Boolean
      wmTarget: String
      wmSource: String
      wmProperty: String
      likeOf: String
      mentionOf: String
      inReplyTo: String
      repostOf: String
      bookmarkOf: String
      rsvp: String
    }
    type WebMentionAuthor {
      type: String
      name: String
      url: String
      photo: String
    }
    type WebMentionContent {
      text: String
      html: String
    }
  `;
  createTypes(typeDefs);

  if (!token || !domain) {
    reporter.warn(
      "`gatsby-plugin-webmention`: token and domain must be set to fetch webmentions"
    );
    reporter.warn(`is token set: ${!!token}`);
    reporter.warn(`is domain set: ${!!domain}`);
    return;
  }

  return getMentions({ token, domain, perPage: fetchLimit }).then(mentions => {
    mentions.forEach(entry => createNode(WebMentionEntryNode(entry)));
  });
};
