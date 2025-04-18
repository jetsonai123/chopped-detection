# Use an official NGINX image to serve static files
FROM nginx:alpine

# Copy all static files to the NGINX web root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
