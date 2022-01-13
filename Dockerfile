#building:
# docker build -t registry.digitalocean.com/blockchain-samurai-static/blockchain-samurai-static .
# docker push registry.digitalocean.com/blockchain-samurai-static/blockchain-samurai-static

#testing:
#docker run -it --rm -d -p 8080:80 --name web registry.digitalocean.com/blockchain-samurai-static/blockchain-samurai-static

FROM nginx:1.21-alpine
EXPOSE 80

# config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# content
COPY front-end/ /usr/share/nginx/html