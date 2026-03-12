# LSCR (LinuxServer Container Registry)
![logo](linuxserver.png)

The `lscr` registry lets you configure [LSCR](https://fleet.linuxserver.io/) integration.

### Variables

| Env var                                      |   Required    | Description     | Supported values                         | Default value when missing |
|----------------------------------------------|:-------------:|-----------------|------------------------------------------|----------------------------|
| `BT_REGISTRY_LSCR_{REGISTRY_NAME}_USERNAME` | :red_circle:  | Github username |                                          |                            |
| `BT_REGISTRY_LSCR_{REGISTRY_NAME}_TOKEN`    | :red_circle:  | Github token    | Github password or Github Personal Token |                            |

### Examples

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_REGISTRY_LSCR_PRIVATE_USERNAME=johndoe
      - BT_REGISTRY_LSCR_PRIVATE_TOKEN=xxxxx 
```
#### **Docker**
```bash
docker run \
  -e BT_REGISTRY_LSCR_PRIVATE_USERNAME="johndoe" \
  -e BT_REGISTRY_LSCR_PRIVATE_TOKEN="xxxxx" \
  ...
  getwud/wud
```
<!-- tabs:end -->

### How to create a Github Personal Token
#### Go to your Github settings and open the Personal Access Token tab
[Click here](https://github.com/settings/tokens)

#### Click on `Generate new token`
Choose an expiration time & appropriate scopes (`read:packages` is only needed for BigTower) and generate.
![image](lscr_01.png)

#### Copy the token & use it as the BT_REGISTRY_LSCR_{REGISTRY_NAME}_TOKEN value
![image](lscr_02.png)
