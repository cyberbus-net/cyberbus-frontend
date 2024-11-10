import { getStaticDir } from "@utils/env";
import { Helmet } from "inferno-helmet";
import { renderToString } from "inferno-server";
import serialize from "serialize-javascript";
import { favIconPngUrl, favIconUrl } from "../../shared/config";
import { IsoDataOptionalSite } from "../../shared/interfaces";
import { buildThemeList } from "./build-themes-list";
import { findTranslationChunkNames } from "../../shared/services/I18NextService";
import { findDateFnsChunkNames } from "../../shared/utils/app/setup-date-fns";

const customHtmlHeader = process.env["LEMMY_UI_CUSTOM_HTML_HEADER"] || "";

let appleTouchIcon: string | undefined = undefined;

export async function createSsrHtml(
  root: string,
  isoData: IsoDataOptionalSite,
  cspNonce: string,
  userLanguages: readonly string[],
) {
  const site = isoData.site_res;

  const fallbackTheme = `<link rel="stylesheet" type="text/css" href="/css/themes/${
    (await buildThemeList())[0]
  }.css" />`;

  const customHtmlHeaderScriptTag = new RegExp("<script", "g");
  const customHtmlHeaderWithNonce = customHtmlHeader.replace(
    customHtmlHeaderScriptTag,
    `<script nonce="${cspNonce}"`,
  );
  appleTouchIcon = favIconPngUrl;

  const erudaStr =
    process.env["LEMMY_UI_DEBUG"] === "true"
      ? renderToString(
          <>
            <script
              nonce={cspNonce}
              src="//cdn.jsdelivr.net/npm/eruda"
            ></script>
            <script nonce={cspNonce}>eruda.init();</script>
          </>,
        )
      : "";

  const helmet = Helmet.renderStatic();

  const lazyScripts = [
    ...findTranslationChunkNames(userLanguages),
    ...findDateFnsChunkNames(userLanguages),
  ]
    .filter(x => x !== undefined)
    .map(x => `${getStaticDir()}/js/${x}.client.js`)
    .map(x => `<link rel="preload" as="script" href="${x}" />`)
    .join("");

  return `
    <!DOCTYPE html>
    <html ${helmet.htmlAttributes.toString()}>
    <head>
    <script nonce="${cspNonce}">
    window.isoData = ${serialize(isoData)};

    if (!document.documentElement.hasAttribute("data-bs-theme")) {
      const light = window.matchMedia("(prefers-color-scheme: light)").matches;
      document.documentElement.setAttribute("data-bs-theme", light ? "light" : "dark");
    }
    </script>
    ${lazyScripts}
  
    <!-- A remote debugging utility for mobile -->
    ${erudaStr}
  
    <!-- Custom injected script -->
    ${customHtmlHeaderWithNonce}
  
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
  
    <style>
    #app[data-adult-consent] {
      filter: blur(10px);
      -webkit-filter: blur(10px);
      -moz-filter: blur(10px);
      -o-filter: blur(10px);
      -ms-filter: blur(10px);
      pointer-events: none;
    }
    </style>

    <!-- Required meta tags -->
    <meta name="Description" content="Cyberbus is a professional forum focused on hardware, servers, 10G networks, storage, NAS, hacking, and related topics">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link
       id="favicon"
       rel="shortcut icon"
       type="image/x-icon"
       href=${site?.site_view.site.icon ?? favIconUrl}
     />
  
    <!-- Web app manifest -->
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" href=${appleTouchIcon} />
    <link rel="apple-touch-startup-image" href=${appleTouchIcon} />
  
    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href="${getStaticDir()}/styles/styles.css" />
  
    <!-- Current theme and more -->
    ${helmet.link.toString() || fallbackTheme}
    
    </head>
  
    <body ${helmet.bodyAttributes.toString()}>
      <noscript>
        <div class="alert alert-danger rounded-0" role="alert">
          <b>Javascript is disabled. Actions will not work.</b>
        </div>
      </noscript>
  
      <div id='root'>${root}</div>
      <script defer src='${getStaticDir()}/js/client.js'></script>
      <!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-GGRZVRXJRF"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-GGRZVRXJRF');
      </script>
    </body>
  </html>
  `;
}
