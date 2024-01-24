# Luzid SDK Examples

This repository contains examples that show how to use the Luzid SDK.

## Prerequisites

- [Node.js](https://nodejs.org/en/download)
- [Yarn](https://yarnpkg.com/getting-started/install) or [npm](https://www.npmjs.com/get-npm)
- [The Luzid App](https://luzid.app)

## Getting Started

1. Clone this repository

```bash
git clone https://github.com/luzid-app/luzid-sdk.git --depth 10
```

2. Navigate to the examples and install the dependencies

**With Yarn**:

```bash
cd examples
yarn
```

**With NPM**:
```bash
cd examples
npm install
```

## Running the examples

Assuming you **started the Luzid App** and are inside the _examples_ directory, you can run
each of the examples via simple commands included below.

Make sure to compare the output with the example code to understand how things work.

It is also recommended to have a look at the [SDK API documentation](https://luzid.app/luzid-sdk/docs/ts/classes/_luzid_sdk.luzid_sdk.LuzidSdk.html)

### Validator Interaction

Demonstrates how to start, stop and restart the validator.

```bash
yarn validator
```

[source](src/01_validator.ts)

### Mutator Account Modification

Demonstrates how luzid allows you to modify account state, including owner, data and lamports
without running a transaction to do so.

```bash
yarn mutator:modify
```

[source](src/02_mutator.modify-account.ts)

### Mutator Account Cloning

Demonstrates how luzid allows you to clone an account from devnet or mainnet. For program
accounts luzid will clone the IDL acconut and the executable data automatically.

```bash
yarn mutator:clone
```

[source](src/03_mutator.clone-account.ts)

### Snapshot

Demonstrates how luzid allows you to take a snapshot of the current state of accounts in side
the validator and restore them later.

```bash
yarn snapshot
```

[source](src/04_snapshot.ts)

## LICENSE

MIT
