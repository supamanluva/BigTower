# Pushover
![logo](pushover.png)

The `pushover` trigger lets you send realtime notifications to your devices (Android, iPhone...) using the [Pushover Service](https://pushover.net/).

### Variables

| Env var                                        | Required       | Description                                                          | Supported values                                                                                   | Default value when missing  |
|------------------------------------------------|:--------------:|----------------------------------------------------------------------| -------------------------------------------------------------------------------------------------- |-----------------------------| 
| `BT_TRIGGER_PUSHOVER_{trigger_name}_DEVICE`   | :white_circle: | Optional device(s) to notify                                         | Coma separated list of devices (e.g. dev1,dev2) ([see here](https://pushover.net/api#identifiers)) |                             |
| `BT_TRIGGER_PUSHOVER_{trigger_name}_EXPIRE`   | :white_circle: | Optional notification expire in seconds (only when priority=2)       | [see here](https://pushover.net/api#priority)                                                      |                             |
| `BT_TRIGGER_PUSHOVER_{trigger_name}_HTML`     | :white_circle: | Allow HTML formatting in message body (supported in Pushover 2.3+)   | [see here](https://pushover.net/api#html)                                                          | `0`                         |
| `BT_TRIGGER_PUSHOVER_{trigger_name}_PRIORITY` | :white_circle: | The notification priority                                            | [see here](https://pushover.net/api#priority)                                                      | `0`                         |
| `BT_TRIGGER_PUSHOVER_{trigger_name}_RETRY`    | :white_circle: | Optional notification retry in seconds (only when priority=2)        | [see here](https://pushover.net/api#priority)                                                      |                             |
| `BT_TRIGGER_PUSHOVER_{trigger_name}_SOUND`    | :white_circle: | The notification sound                                               | [see here](https://pushover.net/api#sounds)                                                        | `pushover`                  |
| `BT_TRIGGER_PUSHOVER_{trigger_name}_TOKEN`    | :red_circle:   | The API token                                                        |                                                                                                    |                             |
| `BT_TRIGGER_PUSHOVER_{trigger_name}_TTL`      | :white_circle: | Optional message time to live (in seconds)                           | [see here](https://pushover.net/api#ttl)                                                           |                             |
| `BT_TRIGGER_PUSHOVER_{trigger_name}_USER`     | :red_circle:   | The User key                                                         |                                                                                                    |                             |


?> This trigger also supports the [common configuration variables](configuration/triggers/?id=common-trigger-configuration).

### Examples

#### Configuration
##### Minimal
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_TRIGGER_PUSHOVER_1_TOKEN=*****************************
      - BT_TRIGGER_PUSHOVER_1_USER=******************************
```

#### **Docker**
```bash
docker run \
  -e BT_TRIGGER_PUSHOVER_1_TOKEN="*****************************" \
  -e BT_TRIGGER_PUSHOVER_1_USER="******************************" \
  ...
  getwud/wud
```
<!-- tabs:end -->

##### Full
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
        - BT_TRIGGER_PUSHOVER_1_TOKEN=*****************************
        - BT_TRIGGER_PUSHOVER_1_USER=******************************
        - BT_TRIGGER_PUSHOVER_1_DEVICE=myIphone,mySamsung
        - BT_TRIGGER_PUSHOVER_1_SOUND=cosmic
        - BT_TRIGGER_PUSHOVER_1_PRIORITY=2
        - BT_TRIGGER_PUSHOVER_1_EXPIRE=600
        - BT_TRIGGER_PUSHOVER_1_RETRY=60
```

#### **Docker**
```bash
docker run \
    -e BT_TRIGGER_PUSHOVER_1_TOKEN="*****************************" \
    -e BT_TRIGGER_PUSHOVER_1_USER="******************************" \
    -e BT_TRIGGER_PUSHOVER_1_DEVICE="myIphone,mySamsung" \
    -e BT_TRIGGER_PUSHOVER_1_SOUND="cosmic" \
    -e BT_TRIGGER_PUSHOVER_1_PRIORITY="2" \
    -e BT_TRIGGER_PUSHOVER_1_EXPIRE="600" \
    -e BT_TRIGGER_PUSHOVER_1_RETRY="60" \
  ...
  getwud/wud
```
<!-- tabs:end -->

### How to get the User key
[Click here](https://pushover.net/settings)

The key is printed under the section `Reset User Key`.

### How to get an API token
#### Register a new application
[Click here](https://pushover.net/apps/build)

![image](pushover_register.png)

#### Copy the API token
![image](pushover_api_token.png)
