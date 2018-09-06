const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小游戏 App ID
    appId: 'wxfdd206c03b158c68',

    // 微信小游戏 App Secret
    appSecret: '7f74f963c32f8970480bc771a3c99dc0',

    // 是否使用腾讯云代理登录小游戏
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小游戏解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小游戏 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'WX/fdd206c03b158c68',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh',

    // 其他配置 ...本地试调打开
    serverHost: 'localhost',
    tunnelServerUrl: '',//https://p2pnowly.qcloud.la
    tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
    // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    qcloudAppId: '1257126548',
    qcloudSecretId: 'AKIDJYs7IM98oUNICynTkyGbuCb4b8nSlpw7',
    qcloudSecretKey: 'vux579EOkUG61qbEh1Cwb5Z9pUl094sW',
    wxMessageToken: 'weixinmsgtoken',
    networkTimeout: 30000
}

module.exports = CONF
