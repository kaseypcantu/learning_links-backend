# _Learning Lynx_
=================

_A GraphQL API to service the LearningLinks frontend, an application that allows me to organize resources and links I want to learn from._

![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/kpcwebdev/learning_lynx-backend?color=blue&logo=docker)

### Deploy your own `Learning Lynx Backend` instance.
Deploy to [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)]()

`Learning Lynx Backend` is a [GraphQL API]() built with [Typeorm]() and [Type-GraphQL]().

- Deployed on [Vercel](https://vercel.com/ "Vercel Deployment").
- **CI/CD** via [GitLab CI/CD](https://docs.gitlab.com/ee/ci/ "GitLab CI/CD Documentation")
  & [GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions "GitHub Actions Documentation")

Local Development Environment
-----------------------------

### Prerequisites

- [ ] [Node.js v14](https://nextjs.org/docs "Next.js Documentation")
- [ ] [Yarn v1.22+](https://yarnpkg.com/ "Yarn Package Manager")
- [ ] [Docker v19+](https://docs.docker.com/ "Docker Documentation")
- [ ] [Docker-Compose v1.27+](https://docs.docker.com/compose/install/ "Install Docker Compose")

Getting Started
---------------

### Install Dependencies & Start the Server

Use `Yarn` to install project dependencies.

```bash
# Install dependencies with Yarn
yarn install
# Start the development Server:
yarn dev:apollo
```
**NOTE**: If you have an [NGROK account]() you will visit the `NGROK` url provided, or the subdomain you configured in the `envrionemtn variables`, you can find examples in the [.env.example](./.env.example) file. 

Once you run this command you can visit the `Learning Lynx GraphQL Playground` in your browser
at [http://localhost:1993/graphql](http://localhost:1993/graphql "Learning Lynx GraphQL Playground"). This starts the server in `dev` mode and
watches the project for any changes. You can run `GrpahQL Queries` in the GraphQL Playground and view the generated documentation.


Docker Development via [_Docker Compose_](https://docs.docker.com/compose/ "Docker Compose Overview")
=====================================================================================================

### Container Stack
- [Learning Lynx Backend](https://hub.docker.com/r/kpcwebdev/learning_lynx-backend "Learning Lynx Backend")
- [Learning Lynx Frontend](https://hub.docker.com/r/kpcwebdev/learning_lynx-frontend "Learning Lynx Frontend Docker Image")
- [PostgreSQL](https://hub.docker.com/_/postgres "Official Postgres Image")
- [Redis](https://hub.docker.com/_/redis "Official Redis Image")
- [pgAdmin](https://hub.docker.com/r/dpage/pgadmin4 "pgAdmin Docker Image")
- [Adminer](https://hub.docker.com/_/adminer "Adminer Docker Image")
- [MailHog](https://hub.docker.com/r/mailhog/mailhog "MailHog Docker Image")

Start the stack with `Docker Compose`:

```bash
docker-compose up -d
```

- This will start the stack in daemon mode, meaning that it will just start all containers in the background. You can
  view the stack, **e.g.**:

```bash
# View all container logs
docker-compose logs
# View specific container logs
docker-compose logs backend
``` 

- You can see the running services to confirm they are up and running, by using the following Docker command.

```bash
docker ps -a
```
Docker Compose Services
-----------------------

| Docker Container | Hostname | Exposed Location | Description |
| ---------------- | -------- | ---------------- | ----------- |
|   `kpcwebdev/learning_lynx-backend:latest`   |   `backend`   | [http://localhost:1993/graphql](http://localhost:1993/graphql "Learning Lynx Backend") | Backend `GraphQL` Server |
|   `kpcwebdev/learning_lynx-frontend:latest`   |   `frontend`   | [http://localhost:3000/](http://localhost:3000/ "Learning Lynx Frontend") | Frontend `Next.js` Application |
|   `PostgreSQL`   |   `db`   | [http://localhost:5432/](http://localhost:5432/ "PostgreSQL Database Server") | PostgreSQL Database Server |
|   `Redis`        |   `redis`   | [http://localhost:6379/](http://localhost:6379/ "Redis Server") | Redis Server |
|   `pgAdmin`      |   `pgadmin`   | [http://localhost:5050/](http://localhost:5050/ "PostgreSQL Tools") | PostgreSQL Administration Tools |
|   `Adminer`      |   `adminer`   | [http://localhost:8080/](http://localhost:8080/ "Database Administration Tools") | Database Administration Tools |
|   `MailHog`      |   `adminer`   | [SMTP Port: `1025`](http://localhost:1025/ "SMTP Port") [MailHog UI Port: `8025`]( http://localhost:8025/) | Web and API based SMTP testing  |

- The `backend` container volume has been mapped to the current working directory, this way you can make changes to the
  codebase while the containers are running and see the changes immediately.

[_Makefile_](https://www.gnu.org/software/make/manual/make.html#Values "Makefile Documentation")
================================================================================================
The `Makefile` provided will help in creating Docker images and deploying a `docker stack` to a `docker swarm` locally
or to a swarm composed of [DigitalOcean Droplets](https://www.digitalocean.com/products/droplets/ "DigitalOcean Droplets"). The following
command will list available Make actions set in the `Makefile`.

```bash
make help
```

| Make Command | Description |
| ------------ | ----------- |
| `dev-image` | Make a development Node.js image with dev/test dependencies for Next.js frontend |
| `dev-shell` | Make a BASH shell in the dev docker container and remove it after shutdown |
| `run-dev_container` | Make docker run the dev image and remove it after shutdown |
| `prod-image` | Make a production Node.js image with optimized Next.js build |
| `prod-shell` | Make a BASH hell in the production docker container and remove it after shutdown |
| `run-prod_container` | Make docker run the prod image and remove it after shutdown |
| `docker-stack_local` | Make a local deployment using docker-compose: docker stack -> docker swarm |
| `unstack` | Make a local docker-compose deployment shutdown and remove docker stack and docker swarm |
- Learn more about [Docker Swarm](https://dockerswarm.rocks/ "Docker Swarm Rocks"

