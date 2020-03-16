const fetch = require("node-fetch");
const queryString = require("query-string");
const camelcaseKeys = require("camelcase-keys");
const createNodeHelpers = require("gatsby-node-helpers").default;

const { createNodeFactory, generateNodeId } = createNodeHelpers({
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

  // https://github.com/aaronpk/webmention.io/blob/master/helpers/formats.rb#L65-L212
  const typeDefs = `
    type WebMentionEntry implements Node {
      type: String!
      author: WebMentionAuthor!
      url: String
      published: Date @dateformat
      wmReceived: Date @dateformat
      wmId: Int
      wmSource: String
      wmTarget: String
      name: String

      summary: WebMentionSummary

      photo: [String!]
      video: [String!]
      audio: [String!]

      content: WebMentionContent

      swarmCoins: Int

      wmPrivate: Boolean!
      wmProperty: String

      likeOf: String
      mentionOf: String
      inReplyTo: String
      repostOf: String
      bookmarkOf: String
      rsvp: String

      rels: WebMentionRel
    }
    type WebMentionAuthor {
      type: String!
      name: String
      url: String
      photo: String
    }
    type WebMentionSummary {
      contentType: String!
      value: String!
    }
    type WebMentionContent {
      contentType: String
      value: String
      text: String!
      html: String
    }
    type WebMentionRel {
      canonical: String!
    }
  `;
  createTypes(typeDefs);

  if (!token) {
    reporter.warn(
      "[gatsby-plugin-webmention] `token` must be set to fetch webmentions."
    );
    return;
  }

  if (!domain) {
    reporter.warn(
      "[gatsby-plugin-webmention] `domain` must be set to fetch webmentions."
    );
    return;
  }

  return getMentions({ token, domain, perPage: fetchLimit }).then(mentions => {
    mentions.forEach(entry => createNode(WebMentionEntryNode(entry)));
  });
};
