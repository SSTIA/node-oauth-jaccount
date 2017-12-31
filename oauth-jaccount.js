const config = require('config');
const oauth = require('oauth');
const crypto = require('crypto');
const querystring = require('querystring');

const PACKAGE_NAME = 'oauth-jaccount';
const defaultConfigs = {
    client_id: null,
    client_secret: null,
    host: 'https://jaccount.sjtu.edu.cn/',
    authorize_path: 'oauth2/authorize',
    access_token_path: 'oauth2/token',
    logout_path: 'oauth2/logout',
    api_host: 'https://api.sjtu.edu.cn/',
    profile_path: 'v1/me/profile'
};

class OAuthJaccount {

    constructor(configs = {}) {
        this.name = PACKAGE_NAME;
        if (configs instanceof String) {
            this.name = configs;
        } else {
            config.util.extendDeep(defaultConfigs, configs);
        }
        config.util.setModuleDefaults(this.name, defaultConfigs);
        this.examine();
    }

    getConfig(attr) {
        const key = this.name + '.' + attr;
        if (config.has(key)) {
            return config.get(key);
        }
        return null;
    }

    error(message) {
        console.error('ERROR: oauth-jaccount: ' + message);
    }

    examine() {
        this.configMap = {};
        let flag = true;
        Object.keys(defaultConfigs).forEach(value => {
            let configValue = this.getConfig(value);
            this.configMap[value] = configValue;
            if (!configValue) {
                flag = false;
                this.error(value + ' not found');
            }
        });
        this.oauth2 = new oauth.OAuth2(
            this.configMap['client_id'],
            this.configMap['client_secret'],
            this.configMap['host'],
            this.configMap['authorize_path'],
            this.configMap['access_token_path'],
            null
        );
        return flag;
    }

    getAuthorizeURL(redirect_uri) {
        const randomState = crypto.randomBytes(32).toString('hex');
        return this.oauth2.getAuthorizeUrl({
            redirect_uri: redirect_uri,
            state: randomState,
            response_type: 'code'
        });
    }

    getLogoutURL(redirect_uri) {
        const params = {post_logout_redirect_uri: redirect_uri};
        return this.configMap['host'] + this.configMap['logout_path']
            + "?" + querystring.stringify(params);
    }

    getToken(code, redirect_uri) {
        return new Promise((resolve, reject) => {
            this.oauth2.getOAuthAccessToken(
                code, {
                    grant_type: 'authorization_code',
                    redirect_uri: redirect_uri
                }, (e, access_token, refresh_token, results) => {
                    resolve({
                        e: e,
                        access_token: access_token,
                        refresh_token: refresh_token,
                        results: results
                    });
                }
            );
        });
    }

    refreshToken(refresh_token, redirect_uri) {
        return new Promise((resolve, reject) => {
            this.oauth2.getOAuthAccessToken(
                refresh_token, {
                    grant_type: 'refresh_token',
                    redirect_uri: redirect_uri
                }, (e, access_token, refresh_token, results) => {
                    resolve({
                        e: e,
                        access_token: access_token,
                        refresh_token: refresh_token,
                        results: results
                    });
                }
            );
        });
    }

    getProfile(access_token) {
        const url = this.configMap['api_host'] + this.configMap['profile_path'];
        return new Promise((resolve, reject) => {
            this.oauth2.get(url, access_token, (error, data) => {
                if (error) {
                    if (error.statusCode == 404) error.url = url;
                    reject(error);
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

}

module.exports = OAuthJaccount;
