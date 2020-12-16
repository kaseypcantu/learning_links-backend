# Application Name
APP_NAME:=learning_lynx-backend
# Docker image name and tag
IMAGE:=kpcwebdev/learning_lynx-backend
TAG:=latest
# Shell that make should use
SHELL:=bash
DROPLETS = droplet{1..3}

help:
# http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
#	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-image: ## Make a development Node.js docker image with dev/test dependencies
	docker build --rm --target dev -t $(IMAGE):dev .

dev-shell: ## Make a BASH shell in the dev docker container and remove it after shutdown
	docker run --name $(APP_NAME) --rm -it $(IMAGE):dev bash

run-dev_container: ## Make docker run the dev image and remove it after shutdown
	docker run --name $(APP_NAME).dev --rm -d -p 1993:1993 $(IMAGE):dev

prod-image: . ## Make a prod Node.js docker image
	docker build --rm --target production -t $(IMAGE):$(TAG) .

prod-shell: ## Make a BASH hell in the prod docker container  and remove it after shutdown
	docker run --rm -it $(IMAGE):$(TAG) bash

run-prod_container: ## Make docker run the prod image and remove it after shutdown
	docker run --name $(APP_NAME).prod --rm -d -p 1993:1993 $(IMAGE):$(TAG)

droplets_local: ## Make a local docker-machine nodes
	sh ./scripts/make_droplets-local.sh

droplets_disappear: ## Make a docker-machine nodes shutdown and remove them
	sh ./scripts/remove_droplets-local.sh

docker-stack_local: prod-image ## Make a local deployment using docker-compose: docker stack -> docker swarm
	@-docker swarm init
	docker stack deploy \
	--prune -c docker-compose.yml \
	$(APP_NAME)

unstack: ## Make a local docker-compose deployment shutdown and remove docker stack and docker swarm
	docker stack rm $(APP_NAME) && docker swarm leave --force
