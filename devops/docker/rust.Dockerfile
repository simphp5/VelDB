# syntax=docker/dockerfile:1.7

# -----------------------------
# Stage 1: Build Rust engine
# -----------------------------
FROM rust:1.78-bookworm AS builder

# Set the workspace folder inside the image.
WORKDIR /usr/src/veldb

# Copy the Rust service source code.
COPY core/ ./

# Compile in release mode and copy the first produced executable.
# This keeps the Dockerfile resilient if the binary name changes.
RUN set -eux; \
    cargo build --release; \
    BIN_PATH="$(find target/release -maxdepth 1 -type f -executable ! -name '*.d' ! -name 'build-script-*' | head -n 1)"; \
    test -n "$BIN_PATH"; \
    cp "$BIN_PATH" /tmp/veldb-engine

# --------------------------------
# Stage 2: Minimal runtime image
# --------------------------------
FROM debian:bookworm-slim AS runtime

# Install CA certificates for outbound TLS calls.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# Create an unprivileged user for better container security.
RUN useradd --system --create-home --uid 10001 veldb

# Define runtime working directory.
WORKDIR /app

# Copy only the compiled executable from builder stage.
COPY --from=builder /tmp/veldb-engine /app/veldb-engine

# Prepare persistent storage location and runtime permissions.
RUN mkdir -p /data && chown -R veldb:veldb /app /data && chmod +x /app/veldb-engine

USER veldb

# Default runtime configuration (overridable via compose/env).
ENV RUST_LOG=info \
    RUST_ENGINE_HOST=0.0.0.0 \
    RUST_ENGINE_PORT=7000 \
    DB_DATA_DIR=/data

# Persist engine data outside the container lifecycle.
VOLUME ["/data"]

# Expose the engine TCP port to other services on the Docker network.
EXPOSE 7000

# Start the VelDB Rust engine.
# If your CLI uses different flags, adjust this command accordingly.
CMD ["sh", "-c", "/app/veldb-engine --host ${RUST_ENGINE_HOST} --port ${RUST_ENGINE_PORT} --data-dir ${DB_DATA_DIR}"]
