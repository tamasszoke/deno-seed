# Production
FROM ubuntu:groovy-20200609
EXPOSE 80
ENV DENO_VERSION=1.2.0

# Deno
RUN apt-get -qq update \
 && apt-get upgrade -y -o Dpkg::Options::="--force-confold" \
 && apt-get -qq install -y ca-certificates curl unzip --no-install-recommends \
 && curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip \
         --output deno.zip \
 && unzip deno.zip \
 && rm deno.zip \
 && chmod 777 deno \
 && mv deno /usr/bin/deno \
 && apt-get -qq remove -y ca-certificates curl unzip \
 && apt-get -y -qq autoremove \
 && apt-get -qq clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Denon
RUN deno install --unstable -f --allow-read --allow-run --allow-write --allow-net https://deno.land/x/denon@v2.2.1/denon.ts
ENV PATH="/root/.deno/bin:$PATH"

COPY /build/ /app/
WORKDIR /app

CMD ["sh", "-c", "denon prod"]
