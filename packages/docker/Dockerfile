FROM node:22-alpine
LABEL org.opencontainers.image.title="mobile-car-wash" \
      org.opencontainers.image.description="Abu Dhabi car care guide: wash window checker and monthly calendar" \
      org.opencontainers.image.source="https://github.com/nbkdevs/turbo-luxury" \
      org.opencontainers.image.url="https://turboluxurycarwash.ae/" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.vendor="Turbo Luxury Car Wash"
WORKDIR /app
COPY package.json server.js ./
COPY lib ./lib
ENV NODE_ENV=production PORT=8080
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
CMD ["node", "server.js"]
