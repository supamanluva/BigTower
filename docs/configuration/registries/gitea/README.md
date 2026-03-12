# GITEA
![logo](gitea.png)

The `gitea` registry lets you configure a self-hosted [Gitea](https://gitea.com) integration.

### Variables

| Env var                                       |    Required    | Description                                                     | Supported values                                                    | Default value when missing |
|-----------------------------------------------|:--------------:|-----------------------------------------------------------------|---------------------------------------------------------------------|----------------------------| 
| `BT_REGISTRY_GITEA_{REGISTRY_NAME}_URL`      |  :red_circle:  | Registry URL (e.g. https://gitea.acme.com)                      |                                                                     |                            |
| `BT_REGISTRY_GITEA_{REGISTRY_NAME}_LOGIN`    | :red_circle:   | Gitea username                                                  | BT_REGISTRY_GITEA_{REGISTRY_NAME}_PASSWORD must be defined         |                            |
| `BT_REGISTRY_GITEA_{REGISTRY_NAME}_PASSWORD` |  :red_circle:  | Gitea password                                                  | BT_REGISTRY_GITEA_{REGISTRY_NAME}_LOGIN must be defined            |                            |
| `BT_REGISTRY_GITEA_{REGISTRY_NAME}_AUTH`     | :white_circle: | Htpasswd string (when htpasswd auth is enabled on the registry) | BT_REGISTRY_GITEA_{REGISTRY_NAME}_LOGIN/TOKEN  must not be defined |                            |
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
      - BT_REGISTRY_GITEA_PRIVATE_URL=https://gitea.acme.com
      - BT_REGISTRY_GITEA_PRIVATE_LOGIN=john
      - BT_REGISTRY_GITEA_PRIVATE_PASSWORD=doe
```
#### **Docker**
```bash
docker run \
  -e "BT_REGISTRY_GITEA_PRIVATE_URL=https://gitea.acme.com/" \
  -e "BT_REGISTRY_GITEA_PRIVATE_LOGIN=john" \
  -e "BT_REGISTRY_GITEA_PRIVATE_PASSWORD=doe" \
  ...
  getwud/wud
```
<!-- tabs:end -->
