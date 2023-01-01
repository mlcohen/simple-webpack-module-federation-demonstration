# simple-webpack-module-federation-demonstration
This repo provides a simple demonstration of how Webpack's module federation works.

- Repo contains three directories: A host app directory (`/host-app`) and two remote module directories (`/remote-module-foo` and `/remote-module-bar`). 
- When loaded, the host app will dynamically import the remote modules. 
- The host app and the two remote modules are all served from their own local server: host on `localhost:8000`, remote module foo on `localhost:8001` and remote module bar on `localhost:8002`.
- To setup the repo, run scripts `./scripts/install-all` and then `./scripts/build-all`
- To serve host and the remote module, run `./scripts/server-all` (requires that you have python3 install on your local system)
- To shutdown the local servers, run `./scripts/shutdown-all`
