# Application Name
APP_NAME:=learning_lynx
# Docker image name and tag
IMAGE:=kpcwebdev/learning_lynx-backend
TAG:=latest
# Shell that make should use
SHELL:=bash

help:
# http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
#	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-image: ## Make a development Node.js docker image with dev/test dependencies.
	docker build --rm --target dev -t $(IMAGE):dev .

prod-image: ## Make a production Node.js docker image.
	docker build --rm --target production -t $(IMAGE):$(TAG) .

dev-shell: ## Make a BASH shell in the dev docker container.
	docker run --rm --it $(IMAGE):dev bash

prod-shell: ## Make a BASH shell in the production docker container.
	docker run --rm --it $(IMAGE):$(TAG) bash

droplets_local: ## Make a local docker-machine nodes.
	#for i in droplet{1..3}; do docker-machine create -d virtualbox --virtualbox-cpu-count 2 $i; done

droplets_disappear: ## Make a docker-machine nodes shutdown and remove them.
	#for i in droplet{1..3}; do docker-machine rm -y $i; done

docker-stack_local: prod-image ## Make a local deployment using docker-compose and docker swarm.
	@-docker swarm init
	docker stack deploy \
	--prune -c docker-compose.yml \
	$(APP_NAME)

unstack: ## Make a local docker-compose deployment shutdown.
	docker stack rm $(APP_NAME) && docker swarm leave --force
