yik
===

**Yik 一刻**是一个在线生成15分钟后自动删除的工具。具有如下特点：

- **自动删除** ：15分钟后自动删除
- **阅后即焚** ：可在阅读后主动删除
- **简单方便** ：支持微信及WEB，使用方便

### 适用场景

> 有时候需要把账号共享给他人，又怕别人不及时删除，导致泄密。这时候一刻就派上用场了，将账号和密码分开发给他人，并将其中一部分使用一刻传送，即使因为一些原因导致信息被人看到，别人也只能查看到一部分。

### 安装使用
1. 注册[Leancloud](https://leancloud.cn)账号并建立应用
2. 根据应用相关信息，修改config/global.json里面的相关配置
3. 注册微信公众号并修改cloud/app.js里18行的config
4. 根据[Leancloud云代码部署](https://leancloud.cn/docs/cloud_code_guide.html#部署代码)指南进行代码部署 

### 一刻相关信息
- 网址： https://yik.me
- 微信公众号: 一刻  yik_15

![一刻](https://mp.weixin.qq.com/misc/getqrcode?fakeid=3016159873&token=10962574&style=1)

### 鸣谢

#### Leancloud
一刻使用[Leancloud](https://leancloud.cn)云代码及数据API构建，全站运行在Leadcloud。云代码还可以绑定域名，更赞的是可以使用自己的SSL证书，实现独立域名SSL支持。Leadcloud，你值得拥有。

#### xoxo
感谢开过的SSL比开过的房要多的[@xoxo](http://www.v2ex.com/member/xoxo)提供的免费SSL

#### 引用
- [wechat](https://github.com/node-webot/wechat) 
- [shortid](https://github.com/dylang/shortid)