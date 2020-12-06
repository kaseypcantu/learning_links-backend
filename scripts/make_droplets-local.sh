#!/bin/bash

#for i in droplets{1..3}; do echo $i; done

for i in droplet{1..3};
  do docker-machine create -d virtualbox --virtualbox-cpu-count 2 $i;
done
