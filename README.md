# node-oauth-jaccount

A simple warpper for SJTU Jaccount OAuth2 login

## Initialization

### Init with `node-config`

In your config file, add a item called `oauth-jaccount`
with your configs, and simply call this

```
const oauth_jaccount = require('./oauth-jaccount');
const jaccount = new oauth_jaccount;
```

or if you want to use your own item name, use

```
const oauth_jaccount = require('./oauth-jaccount');
const jaccount = new oauth_jaccount('yourItemName');
```

### Init with constructor

```
const oauth_jaccount = require('./oauth-jaccount');
const jaccount = new oauth_jaccount({
    'client_id': 'yourCliendId',
    'client_secret': 'yourClientSecret'
});
```

## Usage



## Default config
```
const defaultConfigs = {
    client_id: null,
    client_secret: null,
    host: 'https://jaccount.sjtu.edu.cn/',
    authorize_path: 'oauth2/authorize',
    access_token_path: 'oauth2/token'
};
```

You should setup `client_id` and `client_secret` yourselves
