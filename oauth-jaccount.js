import config from 'config';
import oauth from 'oauth';

const PACKAGE_NAME = 'oauth-jaccount';

class OAuthJaccount {

    constructor(configs = {}) {
        const defaultConfigs = {
            client_id: "value1",
            client_secret: 22,
            host: ,
            authorize_path:
            access_token_path:
        };
        let name = PACKAGE_NAME;
        if (typeof configs === 'string') {
            name = configs;
        } else {
            config.util.extendDeep(defaultConfigs, configs);
        }
        config.util.setModuleDefaults(name, defaultConfigs);
    }




}

export default OAuthJaccount;
