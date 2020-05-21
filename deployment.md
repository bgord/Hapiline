# Deployment

Prerequisites:

- you have to be able to `ssh` to your VPS/remote server
- you have to have `Docker` installed on your remote machine in at least `<version>` version

## Create Docker context for the deployment server

You can check existing contexts by running:

```bash
$ docker context ls
```

By default it looks like below, which means the only Docker context is the one on your local machine.

```
NAME                DESCRIPTION                               DOCKER ENDPOINT               KUBERNETES ENDPOINT   ORCHESTRATOR
default *           Current DOCKER_HOST based configuration   unix:///var/run/docker.sock                         swarm
```

Now, we want to create a context that points to the Docker engine on your remote machine.

Let's say your server's IP is `1.1.1.1`, the user is `ann`, and you want to create `deployment` context.
If you don't want to connect to the default SSH port - `23` - you can specifiy it after IP.

```bash
$ docker context create --description "My deployment server" --docker "host=ssh://ann@1.1.1.1" deployment # without port
$ docker context create --description "My deployment server" --docker "host=ssh://ann@1.1.1.1:225" deployment # with non-default port
```

Now, you should see the newly created context in the list:

```bash
$ docker context ls

NAME                DESCRIPTION                               DOCKER ENDPOINT                 KUBERNETES ENDPOINT   ORCHESTRATOR
default *           Current DOCKER_HOST based configuration   unix:///var/run/docker.sock                           swarm
deployment          My deployment server                      ssh://ann@1.1.1.1:225
```

## Switch Docker context

If you're ready to deploy the app, you need to use the deployment context.

```bash
$ docker context use deployment
```

To go back to the default context:

```bash
$ docker context use default
```
