#!/bin/bash

for i in droplet{1..3}; do
  docker-machine rm -y $i
done
