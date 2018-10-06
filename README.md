# ETHSF 2018 Hackathon

> We don't even know what we're building yet!

See subfolders


## SETUP
- install and run ipfs
  - `brew install ipfs`
  - `brew services start ipfs`
- install and run postgres
  - `brew install postgresql`
  - `brew services start postgres`
- create db to use with the graph `createdb hagraph`



```
cargo run -p graph-node --release -- \
  --postgres-url postgresql://<USERNAME><:PASSWORD>@localhost:5432/<POSTGRES_DB_NAME> \
  --ethereum-rpc <ETHEREUM_NETWORK_NAME>:https://mainnet.infura.io`
  --ipfs 127.0.0.1:5001 \
```