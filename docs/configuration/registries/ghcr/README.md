# GHCR (Github Container Registry)
![logo](github.png)

The `ghcr` registry lets you configure [GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-docker-registry) integration.

### Variables

| Env var                                      | Required       | Description     | Supported values                         | Default value when missing |
| -------------------------------------------- |:--------------:| --------------- | ---------------------------------------- | -------------------------- | 
| `BT_REGISTRY_GHCR_{REGISTRY_NAME}_USERNAME` | :white_circle: | Github username |                                          |                            |
| `BT_REGISTRY_GHCR_{REGISTRY_NAME}_TOKEN`    | :white_circle: | Github token    | Github password or Github Personal Token |                            |

### Examples

#### Configure to access private images

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_REGISTRY_GHCR_PRIVATE_USERNAME=john@doe
      - BT_REGISTRY_GHCR_PRIVATE_TOKEN=xxxxx 
```
#### **Docker**
```bash
docker run \
  -e BT_REGISTRY_GHCR_PRIVATE_USERNAME="john@doe" \
  -e BT_REGISTRY_GHCR_PRIVATE_TOKEN="xxxxx" \
  ...
  getwud/wud
```
<!-- tabs:end -->

### How to create a Github Personal Token
#### Go to your Github settings and open the Personal Access Token tab
[Click here](https://github.com/settings/tokens)

#### Click on `Generate new token`
Choose an expiration time & appropriate scopes (`read:packages` is only needed for BigTower) and generate.
![image](ghcr_01.png)

#### Copy the token & use it as the BT_REGISTRY_GHCR_{REGISTRY_NAME}_TOKEN value
![image](ghcr_02.png)
