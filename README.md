# luzid-sdk

[![Build+Test+Lint](https://github.com/luzid-app/luzid-sdk/actions/workflows/build-test-lint.yml/badge.svg)](https://github.com/luzid-app/luzid-sdk/actions/workflows/build-test-lint.yml)

The different SDKs to interact with the [Luzid Application](https://luzid.app).

## TypeScript

- [docs](https://luzid.app/luzid-sdk/docs/ts/classes/_luzid_sdk.luzid_sdk.LuzidSdk.html)
- [npm](https://www.npmjs.com/package/@luzid/sdk)
- [SDK Examples](ts/examples/README.md)
- [SDK README](ts/packages/luzid-sdk/README.md)

## Dart

- [pub.dev](https://pub.dev/packages/luzid_sdk)
- [SDK Examples](dart/luzid-sdk/example/)

### Development

The monorepo packages are managed by [melos](https://github.com/invertase/melos).

Thus first install it on your machine via:

```sh
dart pub global activate melos
```

Check for code issues via:

```sh
melos analyze
```

### Publishing

Prepare changelog and version via:

```sh
melos version --changelog
```

If that fails cause it cannot find the packages do to manually update minor versions:

```sh
melos version -V luzid_grpc:minor -V luzid_grpc_client:minor -V luzid_sdk:minor --changelog
```


Check if all is good via:

```sh
melos publish --dry-run
```

Actual publishing is a bit more tricky:

```sh
melos run publish!
```

should work (it's a script in the `melos.yaml` file).

Otherwise going through each package one by one and running `flutter pub publish` may be
needed, especially if not authorized yet.


## LICENSE

MIT
