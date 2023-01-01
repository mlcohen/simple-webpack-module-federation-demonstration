# simple-webpack-module-federation-demonstration

This repo provides a simple demonstration of how Webpack's module federation works.

The repository contains three directories:

- A host app directory `/host-app`
- two remote module directories: `/remote-module-foo` and `/remote-module-bar`

The host app and the two remote modules are all served from their own local server:

- host on `localhost:8000`
- remote module foo on `localhost:8001`
- remote module bar on `localhost:8002`


### Setup

1. `yarn install`
2. `yarn install:all`
3. `yarn build:all`


### Running the Demonstration

- To serve host and the remote modules, run `yarn serve:all`
- To shutdown the local servers, run `yarn shutdown:all`

When the servers are all running, open your browser and go to `http://localhost:8000`. In your browser's JavaScript console, you should see the following output:

```
LOADED remote module foo
remote foo action invoked
LOADED remote module bar
remote bar action invoked
```