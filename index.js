module.exports.PROPERTY = {
  inReplyTo: "in-reply-to",
  likeOf: "like-of",
  repostOf: "repost-of",
  bookmarkOf: "bookmark-of",
  mentionOf: "mention-of",
  rsvp: "rsvp"
};

// get all mentions for a token and a specific domain
module.exports.getMentions = ({
  domain,
  token,
  fetchLimit = 10000,
  properties
}) => {
  return fetch(
    `https://webmention.io/api/mentions.jf2?${queryString.stringify(
      {
        domain,
        token,
        "per-page": fetchLimit,
        ...(properties && properties.length
          ? { "wm-property": properties }
          : {})
      },
      {
        arrayFormat: "bracket"
      }
    )}`
  )
    .then(response => response.json())
    .then(mentions => {
      if (!mentions || !mentions.children) {
        return [];
      }
      return camelcaseKeys(mentions.children);
    });
};
