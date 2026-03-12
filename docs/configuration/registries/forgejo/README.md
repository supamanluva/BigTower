# FORGEJO
![logo](forgejo.png)

The `forgejo` registry lets you configure a self-hosted [Forgejo](https://forgejo.org/) integration.

### Variables

| Env var                                         |    Required    | Description                                                     | Supported values                                                      | Default value when missing |
|-------------------------------------------------|:--------------:|-----------------------------------------------------------------|-----------------------------------------------------------------------|----------------------------| 
| `BT_REGISTRY_FORGEJO_{REGISTRY_NAME}_URL`      | :red_circle:   | Registry URL (e.g. https://forgejo.acme.com)                    |                                                                       |                            |
| `BT_REGISTRY_FORGEJO_{REGISTRY_NAME}_LOGIN`    | :red_circle:   | Forgejo username                                                | BT_REGISTRY_FORGEJO_{REGISTRY_NAME}_PASSWORD must be defined         |                            |
| `BT_REGISTRY_FORGEJO_{REGISTRY_NAME}_PASSWORD` | :red_circle:   | Forgejo password or personal access token                       | BT_REGISTRY_FORGEJO_{REGISTRY_NAME}_LOGIN must be defined            |                            |
| `BT_REGISTRY_FORGEJO_{REGISTRY_NAME}_AUTH`     | :white_circle: | Htpasswd string (when htpasswd auth is enabled on the registry) | BT_REGISTRY_FORGEJO_{REGISTRY_NAME}_LOGIN/TOKEN  must not be defined |                            |
### Examples

#### Configure
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_REGISTRY_FORGEJO_PRIVATE_URL=https://forgejo.acme.com
      - BT_REGISTRY_FORGEJO_PRIVATE_LOGIN=john
      - BT_REGISTRY_FORGEJO_PRIVATE_PASSWORD=doe
```
#### **Docker**
```bash
docker run \
  -e "BT_REGISTRY_FORGEJO_PRIVATE_URL=https://forgejo.acme.com" \
  -e "BT_REGISTRY_FORGEJO_PRIVATE_LOGIN=john" \
  -e "BT_REGISTRY_FORGEJO_PRIVATE_PASSWORD=doe" \
  ...
  getwud/wud
```
<!-- tabs:end -->
