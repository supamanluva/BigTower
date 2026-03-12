# CUSTOM (Self-hosted Docker Registry)
![logo](custom.png)

The `custom` registry lets you configure a self-hosted [Docker Registry](https://docs.docker.com/registry/) integration.

### Variables

| Env var                        | Required       | Description                                                     | Supported values                                     | Default value when missing |
| ------------------------------ |:--------------:| --------------------------------------------------------------- | ---------------------------------------------------- | -------------------------- | 
| `BT_REGISTRY_CUSTOM_{REGISTRY_NAME}_URL`      | :red_circle:   | Registry URL (e.g. http://localhost:5000)                       |                                                      |                            |
| `BT_REGISTRY_CUSTOM_{REGISTRY_NAME}_LOGIN`    | :white_circle: | Login (when htpasswd auth is enabled on the registry)           | BT_REGISTRY_CUSTOM_{REGISTRY_NAME}_PASSWORD must be defined         |                            |
| `BT_REGISTRY_CUSTOM_{REGISTRY_NAME}_PASSWORD` | :white_circle: | Password (when htpasswd auth is enabled on the registry)        | BT_REGISTRY_CUSTOM_{REGISTRY_NAME}_LOGIN must be defined            |                            |
| `BT_REGISTRY_CUSTOM_{REGISTRY_NAME}_AUTH`     | :white_circle: | Htpasswd string (when htpasswd auth is enabled on the registry) | BT_REGISTRY_CUSTOM_{REGISTRY_NAME}_LOGIN/TOKEN  must not be defined |                            |
### Examples

#### Configure for anonymous access
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_REGISTRY_CUSTOM_PRIVATE_URL=http://localhost:5000
```
#### **Docker**
```bash
docker run \
  -e "BT_REGISTRY_CUSTOM_PRIVATE_URL=http://localhost:5000" \
  ...
  getwud/wud
```
<!-- tabs:end -->

#### Configure [for Basic Auth](https://docs.docker.com/registry/configuration/#htpasswd)
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_REGISTRY_CUSTOM_PRIVATE_URL=http://localhost:5000
      - BT_REGISTRY_CUSTOM_PRIVATE_LOGIN=john
      - BT_REGISTRY_CUSTOM_PRIVATE_PASSWORD=doe
```
#### **Docker**
```bash
docker run \
  -e "BT_REGISTRY_CUSTOM_PRIVATE_URL=http://localhost:5000" \
  -e "BT_REGISTRY_CUSTOM_PRIVATE_LOGIN=john" \
  -e "BT_REGISTRY_CUSTOM_PRIVATE_PASSWORD=doe" \
  ...
  getwud/wud
```
<!-- tabs:end -->


#### Configure multiple custom registries
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_REGISTRY_CUSTOM_PRIVATE1_URL=http://localhost:5000
      - BT_REGISTRY_CUSTOM_PRIVATE1_LOGIN=john
      - BT_REGISTRY_CUSTOM_PRIVATE1_PASSWORD=doe
      - BT_REGISTRY_CUSTOM_PRIVATE2_URL=http://localhost:5001
      - BT_REGISTRY_CUSTOM_PRIVATE2_LOGIN=jane
      - BT_REGISTRY_CUSTOM_PRIVATE2_PASSWORD=doe      
```
#### **Docker**
```bash
docker run \
  -e "BT_REGISTRY_CUSTOM_PRIVATE1_URL=http://localhost:5000" \
  -e "BT_REGISTRY_CUSTOM_PRIVATE1_LOGIN=john" \
  -e "BT_REGISTRY_CUSTOM_PRIVATE1_PASSWORD=doe" \
  -e "BT_REGISTRY_CUSTOM_PRIVATE2_URL=http://localhost:5001" \
  -e "BT_REGISTRY_CUSTOM_PRIVATE2_LOGIN=jane" \
  -e "BT_REGISTRY_CUSTOM_PRIVATE2_PASSWORD=doe" \  
  ...
  getwud/wud
```
<!-- tabs:end -->
