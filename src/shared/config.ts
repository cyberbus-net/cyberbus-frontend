import { getStaticDir } from "@utils/env";

export const favIconUrl = `${getStaticDir()}/assets/icons/favicon.svg`;
export const favIconPngUrl = `${getStaticDir()}/assets/icons/apple-touch-icon.png`;

export const statusUrl = "https://status.cyberbus.net";
export const frontendRepo = "https://github.com/cyberbus-net/cyberbus-frontend";
export const backendRepo = "https://github.com/cyberbus-net/cyberbus-backend";

export const siteUrl = "https://cyberbus.net";
export const donateLemmyUrl = `${siteUrl}/donate`;
export const docsUrl = `${siteUrl}/docs/en/index.html`;
export const helpGuideUrl = `${siteUrl}/docs/en/users/01-getting-started.html`; // TODO find a way to redirect to the non-en folder
export const markdownHelpUrl = `${siteUrl}/docs/en/users/02-media.html`;
export const torrentHelpUrl = `${markdownHelpUrl}#torrents`;
export const sortingHelpUrl = `${siteUrl}/docs/en/users/03-votes-and-ranking.html`;
export const archiveTodayUrl = "https://archive.today";
export const ghostArchiveUrl = "https://ghostarchive.org";
export const webArchiveUrl = "https://web.archive.org";
export const elementUrl = "https://element.io";

export const postRefetchSeconds: number = 60 * 1000;
export const mentionDropdownFetchLimit = 10;
export const commentTreeMaxDepth = 8;
export const postMarkdownFieldCharacterLimit = 50000;
export const markdownFieldCharacterLimit = 10000;
export const maxUploadImages = 20;
export const concurrentImageUpload = 4;
export const updateUnreadCountsInterval = 30000;
export const fetchLimit = 20;
export const similarPostFetchLimit = 6;
export const relTags = "noopener nofollow";
export const emDash = "\u2014";
export const authCookieName = "jwt";
export const adultConsentCookieKey = "adultConsent";

// No. of max displayed communities per
// page on route "/communities"
export const communityLimit = 50;

const queryPairRegex = "[a-zA-Zd_-]+=[a-zA-Zd+-_]+";

/**
 * Accepted formats:
 * !community@server.com
 * /c/community@server.com
 * /m/community@server.com
 * /u/username@server.com
 */
export const instanceLinkRegex = new RegExp(
  `(/[cmu]/|!)[a-zA-Z\\d._%+-]+@[a-zA-Z\\d.-]+\\.[a-zA-Z]{2,}(?:/?\\?${queryPairRegex}(?:&${queryPairRegex})*)?`,
  "g",
);

export const testHost = "0.0.0.0:8536";
