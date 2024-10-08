FROM node:alpine as builder

# Added vips-dev and pkgconfig so that local vips is used instead of prebuilt
# Done for two reasons:
# - libvips binaries are not available for ARM32
# - It can break depending on the CPU (https://github.com/LemmyNet/lemmy-ui/issues/1566)
RUN apk update && apk upgrade && apk add --no-cache curl python3 build-base gcc wget git vips-dev pkgconfig

# Enable corepack to use pnpm
RUN corepack enable

# Install node-gyp
RUN npm install -g node-gyp

WORKDIR /usr/src/app

ENV npm_config_target_platform=linux
ENV npm_config_target_libc=musl

#Copy themes
COPY extra_themes extra_themes

# Cache deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm i
# Build
COPY generate_translations.js \
  tsconfig.json \
  webpack.config.js \
  .babelrc \
  ./

COPY cyberbus-translations cyberbus-translations
COPY src src
COPY .git .git

# Set UI version 
RUN echo "export const VERSION = '$(git describe --tag)';" > "src/shared/version.ts"
RUN echo "export const BUILD_DATE_ISO8601 = '$(date -u +"%Y-%m-%dT%H:%M:%SZ")';" > "src/shared/build-date.ts"

RUN pnpm i
RUN pnpm prebuild:prod
RUN pnpm build:prod

RUN rm -rf ./node_modules/import-sort-parser-typescript
RUN rm -rf ./node_modules/typescript
RUN rm -rf ./node_modules/npm

FROM node:alpine as runner
ENV NODE_ENV=production

RUN apk update && apk add --no-cache curl vips-cpp && rm -rf /var/cache/apk/*

COPY --from=builder /usr/src/app/dist /app/dist
COPY --from=builder /usr/src/app/extra_themes /app/extra_themes
COPY --from=builder /usr/src/app/node_modules /app/node_modules

RUN chown -R node:node /app

LABEL org.opencontainers.image.authors="karminski & The Lemmy Authors"
LABEL org.opencontainers.image.source="https://github.com/cyberbus-net/cyberbus-frontend"
LABEL org.opencontainers.image.licenses="AGPL-3.0-or-later"
LABEL org.opencontainers.image.description="Frontend APP for cyberbus."

HEALTHCHECK --interval=60s --start-period=10s --retries=2 --timeout=10s CMD curl -ILfSs http://localhost:1234/ > /dev/null || exit 1

USER node
EXPOSE 1234
WORKDIR /app

CMD ["node", "dist/js/server.js"]
