# Ntfy
![logo](ntfy.png)

The `ntfy` trigger lets you send container update notifications via [Ntfy](https://ntfy.sh/).

### Variables

| Env var                                         |    Required    | Description                               | Supported values                                                                       | Default value when missing |
|-------------------------------------------------|:--------------:|-------------------------------------------|----------------------------------------------------------------------------------------|----------------------------| 
| `BT_TRIGGER_NTFY_{trigger_name}_AUTH_PASSWORD` | :white_circle: | Password (if basic auth is enabled)       |                                                                                        |                            |
| `BT_TRIGGER_NTFY_{trigger_name}_AUTH_TOKEN`    | :white_circle: | Bearer token (if bearer auth is enabled)  |                                                                                        |                            |
| `BT_TRIGGER_NTFY_{trigger_name}_AUTH_USER`     | :white_circle: | User (if basic auth is enabled)           |                                                                                        |                            |
| `BT_TRIGGER_NTFY_{trigger_name}_PRIORITY`      | :white_circle: | The Ntfy message priority                 | Integer between `0` and `5` [see here](https://docs.ntfy.sh/publish/#message-priority) |                            |
| `BT_TRIGGER_NTFY_{trigger_name}_TOPIC`         | :red_circle:   | The Ntfy topic name                       |                                                                                        |                            |
| `BT_TRIGGER_NTFY_{trigger_name}_URL`           | :red_circle:   | The Ntfy server url                       | The `http` or `https` gotify server address                                            | `https://notify.sh`        |

?> This trigger also supports the [common configuration variables](configuration/triggers/?id=common-trigger-configuration).

### Examples

#### Configure the trigger to publish to the official public ntfy service

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_TRIGGER_NTFY_SH_TOPIC=xxxxyyyyzzzz
```
#### **Docker**
```bash
docker run \
  -e BT_TRIGGER_NTFY_SH_TOPIC="xxxxyyyyzzzz" \
  ...
  getwud/wud
```
<!-- tabs:end -->

#### Configure the trigger to publish to a private ntfy service with basic auth enabled

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_TRIGGER_NTFY_PRIVATE_URL=http://ntfy.local
      - BT_TRIGGER_NTFY_PRIVATE_TOPIC=xxxxyyyyzzzz
      - BT_TRIGGER_NTFY_PRIVATE_AUTH_USER=john
      - BT_TRIGGER_NTFY_PRIVATE_AUTH_PASSWORD=doe
```
#### **Docker**
```bash
docker run \
  -e BT_TRIGGER_NTFY_PRIVATE_URL="http://ntfy.local" \
  -e BT_TRIGGER_NTFY_PRIVATE_TOPIC="xxxxyyyyzzzz" \
  -e BT_TRIGGER_NTFY_PRIVATE_AUTH_USER="john" \
  -e BT_TRIGGER_NTFY_PRIVATE_AUTH_PASSWORD="doe" \
  ...
  getwud/wud
```
<!-- tabs:end -->
