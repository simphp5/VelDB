## DevOps Folder

This folder contains Docker and onboarding resources for running VelDB locally.

### Files

- `docker-compose.yml`: local service orchestration
- `docker/node.Dockerfile`: backend image build
- `docker/rust.Dockerfile`: rust-engine image build
- `onboarding_guide.md`: step-by-step setup and troubleshooting

### Quick Start

```bash
docker compose -f devops/docker-compose.yml build
docker compose -f devops/docker-compose.yml up -d
```
 
