# Openid Connect Authentication
![logo](oidc.png)

The `oidc` authentication lets you protect BigTower access using the [Openid Connect standard](https://openid.net/).

### Variables

| Env var                                  | Required       | Description                                                            | Supported values | Default value when missing |
|------------------------------------------|:--------------:|------------------------------------------------------------------------|------------------|----------------------------|
| `BT_AUTH_OIDC_{auth_name}_CLIENTID`     | :red_circle:   | Client ID                                                              |                  |                            |
| `BT_AUTH_OIDC_{auth_name}_CLIENTSECRET` | :red_circle:   | Client Secret                                                          |                  |                            |
| `BT_AUTH_OIDC_{auth_name}_DISCOVERY`    | :red_circle:   | Oidc discovery URL                                                     |                  |                            |
| `BT_AUTH_OIDC_{auth_name}_REDIRECT`     | :white_circle: | Skip internal login page & automatically redirect to the OIDC provider | `true`, `false`  | `false`                    |
| `BT_AUTH_OIDC_{auth_name}_TIMEOUT`      | :white_circle: | Timeout (in ms) when calling the OIDC provider                         | Minimum is 500   | `5000`                     |

?> The callback URL (to configure in the IDP is built as `${wud_public_url}/auth/oidc/${auth_name}/cb`

!> BigTower tries its best to determine the public address to forge redirections on its own. \
If it fails (irregular reverse proxy configuration...), you can enforce the value using the env var `BT_PUBLIC_URL` 

### How to integrate with&nbsp;[Authelia](https://www.authelia.com)
![logo](authelia.png)

#### Configure an Openid Client for BigTower in Authelia configuration.yml ([see official authelia documentation](https://www.authelia.com/docs/configuration/identity-providers/oidc.html))
```yaml
identity_providers:
  oidc:
    hmac_secret: <a-very-long-string>
    issuer_private_key: |
      -----BEGIN RSA PRIVATE KEY-----
      # <Generate & paste here an RSA private key>
      -----END RSA PRIVATE KEY-----    
    access_token_lifespan: 1h
    authorize_code_lifespan: 1m
    id_token_lifespan: 1h
    refresh_token_lifespan: 90m
    clients:
      - client_id: my-bigtower-client-id
        client_name: BigTower openid client
        client_secret: this-is-a-very-secure-secret
        public: false
        authorization_policy: one_factor
        audience: []
        scopes:
          - openid
          - profile
          - email
        redirect_uris:
          - https://<your_wud_public_domain>/auth/oidc/authelia/cb
        grant_types:
          - refresh_token
          - authorization_code
        response_types:
          - code
        response_modes:
          - form_post
          - query
          - fragment
        userinfo_signing_algorithm: none
```

#### Configure BigTower
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_AUTH_OIDC_AUTHELIA_CLIENTID=my-bigtower-client-id
      - BT_AUTH_OIDC_AUTHELIA_CLIENTSECRET=this-is-a-very-secure-secret
      - BT_AUTH_OIDC_AUTHELIA_DISCOVERY=https://<your_authelia_public_domain>/.well-known/openid-configuration
```
#### **Docker**
```bash
docker run \
  -e BT_AUTH_OIDC_AUTHELIA_CLIENTID="my-bigtower-client-id" \
  -e BT_AUTH_OIDC_AUTHELIA_CLIENTSECRET="this-is-a-very-secure-secret" \
  -e BT_AUTH_OIDC_AUTHELIA_DISCOVERY="https://<your_authelia_public_domain>/.well-known/openid-configuration" \
  ...
  getwud/wud
```
<!-- tabs:end -->

![image](authelia_00.png)

![image](authelia_01.png)

### How to integrate with&nbsp;[Auth0](http://auth0.com)
![logo](auth0.png)

#### Create an application (Regular Web Application)
- `Allowed Callback URLs`: `https://<your_wud_public_domain>/auth/oidc/auth0/cb`

#### Configure BigTower
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_AUTH_OIDC_AUTH0_CLIENTID=<paste the Client ID from auth0 application settings>
      - BT_AUTH_OIDC_AUTH0_CLIENTSECRET=<paste the Client Secret from auth0 application settings>
      - BT_AUTH_OIDC_AUTH0_DISCOVERY=https://<paste the domain from auth0 application settings>/.well-known/openid-configuration
```
#### **Docker**
```bash
docker run \
  -e BT_AUTH_OIDC_AUTH0_CLIENTID="<paste the Client ID from auth0 application settings>" \
  -e BT_AUTH_OIDC_AUTH0_CLIENTSECRET="<paste the Client Secret from auth0 application settings>" \
  -e BT_AUTH_OIDC_AUTH0_DISCOVERY="https://<paste the domain from auth0 application settings>/.well-known/openid-configuration" \
  ...
  getwud/wud
```
<!-- tabs:end -->

![image](auth0_00.png)

![image](auth0_01.png)


### How to integrate with&nbsp;[Authentik](https://goauthentik.io/)
![logo](authentik.png)

#### On Authentik, create a provider with type `Oauth2/OpenID` (or configure an existing one)
![image](authentik_00.png)

#### Important values:
- Client Type: `Confidential`
- Client ID: `<generated value>`
- Client Secret: `<generated value>`
- Redirect URIs/Origins: `https://<your_wud_public_domain>/auth/oidc/authentik/cb`
- Scopes: `email`, `openid`, `profile`

#### On Authentik, create an application associated to the previously created provider
![image](authentik_01.png)

#### Configure BigTower
<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: getwud/wud
    ...
    environment:
      - BT_AUTH_OIDC_AUTHENTIK_CLIENTID=<paste the Client ID from authentik wud_oidc provider>
      - BT_AUTH_OIDC_AUTHENTIK_CLIENTSECRET=<paste the Client Secret from authentik wud_oidc provider>
      - BT_AUTH_OIDC_AUTHENTIK_DISCOVERY=<authentik_url>/application/o/<authentik_application_name>/.well-known/openid-configuration
      - BT_AUTH_OIDC_AUTHENTIK_REDIRECT=true # optional (to skip internal login page)
```
#### **Docker**
```bash
docker run \
  -e BT_AUTH_OIDC_AUTHENTIK_CLIENTID="<paste the Client ID from authentik wud_oidc provider>" \
  -e BT_AUTH_OIDC_AUTHENTIK_CLIENTSECRET="<paste the Client Secret from authentik wud_oidc provider>" \
  -e BT_AUTH_OIDC_AUTHENTIK_DISCOVERY="<authentik_url>/application/o/<authentik_application_name>/.well-known/openid-configuration" \
  -e BT_AUTH_OIDC_AUTHENTIK_REDIRECT=true # optional (to skip internal login page) \  
  ...
  getwud/wud
```
<!-- tabs:end -->
