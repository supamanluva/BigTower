# Server

You can adjust the server configuration with the following environment variables.

### Variables

| Env var                    | Required       | Description                                                                  | Supported values                         | Default value when missing       |
| -------------------------- |:--------------:|----------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------- | 
| `BT_SERVER_ENABLED`       | :white_circle: | If REST API must be exposed                                                  | `true`, `false`                          | `true`                           |
| `BT_SERVER_PORT`          | :white_circle: | Http listener port                                                           | from `0` to `65535`                      | `3000`                           |
| `BT_SERVER_TLS_ENABLED`   | :white_circle: | Enable HTTPS+TLS                                                             | `true`, `false`                          | `false`                          |
| `BT_SERVER_TLS_KEY`       | :white_circle: | TLS server key (required when `BT_SERVER_TLS_ENABLED` is enabled)           | File path to the key file                |                                  |
| `BT_SERVER_TLS_CERT`      | :white_circle: | TLS server certificate (required when `BT_SERVER_TLS_ENABLED` is enabled)   | File path to the cert file               |                                  |
| `BT_SERVER_CORS_ENABLED`  | :white_circle: | Enable [CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS) Requests  | `true`, `false`                          | `false`                          |
| `BT_SERVER_CORS_ORIGIN`   | :white_circle: | Supported CORS origin                                                        |                                          | `*`                              |
| `BT_SERVER_CORS_METHODS`  | :white_circle: | Supported CORS methods                                                       | Comma separated list of valid HTTP verbs | `GET,HEAD,PUT,PATCH,POST,DELETE` |
| `BT_SERVER_FEATURE_DELETE`| :white_circle: | If deleting operations are enabled through API & UI                          | `true`, `false`                          | `true`                           |

### Examples

#### Disable http listener

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_SERVER_ENABLED=false
```
#### **Docker**
```bash
docker run \
  -e BT_SERVER_ENABLED=false \
  ...
  getwud/wud
```
<!-- tabs:end -->

#### Set http listener port to 8080

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_SERVER_PORT=8080
```
#### **Docker**
```bash
docker run \
  -e BT_SERVER_PORT=8080 \
  ...
  getwud/wud
```
<!-- tabs:end -->

#### Enable HTTPS

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_SERVER_TLS_ENABLED=true
      - BT_SERVER_TLS_KEY=/bigtower_certs/server.key
      - BT_SERVER_TLS_CERT=/bigtower_certs/server.crt
```
#### **Docker**
```bash
docker run \
  -e "BT_SERVER_TLS_ENABLED=true" \
  -e "BT_SERVER_TLS_KEY=/bigtower_certs/server.key" \
  -e "BT_SERVER_TLS_CERT=/bigtower_certs/server.crt" \
  ...
  getwud/wud
```
<!-- tabs:end -->
