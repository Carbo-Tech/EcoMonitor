# syntax = docker/dockerfile:1.4
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10 AS builder

WORKDIR /app

COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt


FROM builder as dev-envs

RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git 
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /