const fetch = require("node-fetch");
const queryString = require("query-string");
const camelcaseKeys = require("camelcase-keys");
const createNodeHelpers = require("gatsby-node-helpers").default;

const {
  createNodeFactory,
  generateNodeId,
  generateTypeName
} = createNodeHelpers({
  typePrefix: `WebMention`
});
const ENTRY_TYPE = `Entry`;
const WebMentionEntryNode = createNodeFactory(ENTRY_TYPE, entry => ({
  id: generateNodeId(ENTRY_TYPE, entry.wmId.toString()),
  ...entry
}));

// get all mentions for a token and a specific domain
const getMentions = async ({ domain, token }) => {
  return fetch(
    `https://webmention.io/api/mentions.jf2?${queryString.stringify({
      domain,
      token
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

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, reporter },
  { token, domain }
) => {
  if (!token || !domain) {
    reporter.warn(
      "`gatsby-plugin-webmention`: token and domain must be set to fetch webmentions"
    );
    reporter.warn(`is token set: ${!!token}`);
    reporter.warn(`is domain set: ${!!domain}`);
    return;
  }
  const { createNode, deleteNode } = actions;
  return getMentions({ token, domain }).then(mentions => {
    mentions.forEach(entry => createNode(WebMentionEntryNode(entry)));
  });
  //  createNode()
};
