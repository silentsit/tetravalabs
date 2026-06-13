FROM typesense/typesense:27.1

# Official image ENTRYPOINT is /opt/typesense-server.
# API key comes from TYPESENSE_API_KEY at runtime (Render generateValue).
EXPOSE 10000

CMD ["--data-dir=/data", "--listen-port=10000", "--enable-cors"]
