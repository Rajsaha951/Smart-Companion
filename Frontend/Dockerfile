# Frontend Dockerfile - Production Ready with Nginx
FROM nginx:alpine

# Install necessary packages
RUN apk add --no-cache wget

# Remove default nginx config and website
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend files
COPY --chown=nginx:nginx index.html /usr/share/nginx/html/
COPY --chown=nginx:nginx login.html /usr/share/nginx/html/
COPY --chown=nginx:nginx css /usr/share/nginx/html/css/
COPY --chown=nginx:nginx js /usr/share/nginx/html/js/

# Update API base URL for production (using nginx proxy)
RUN sed -i "s|http://localhost:5000/api|/api|g" /usr/share/nginx/html/js/api.js

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx

# Expose port
EXPOSE 5500

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
