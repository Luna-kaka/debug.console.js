/**
 * 拦截网络请求服务
 *
 * @author 心叶(yelloxing)
 *
 * 2020年8月20日于南京
 */

export default function (target) {

    /**
     * 基于手机端没有IE内核的，
     * 对于new ActiveXObject('Microsoft.XMLHTTP')这种的xhr不考虑
     * 我们考虑的对象是：new XMLHttpRequest()
     */

    if (window.XMLHttpRequest) {

        // 原生的请求方法
        const { open, send } = window.XMLHttpRequest.prototype;

        window.XMLHttpRequest.prototype.open = function () {

            this.__yelloxing__debugger__id__ = "yelloxing-debugger-network^" + arguments[0] + "@" + arguments[1] + ":" + new Date().valueOf() + "[" + (Math.random()) + "]";

            // 响应
            let onreadystatechange = this.onreadystatechange;
            this.onreadystatechange = function () {
                if (onreadystatechange) { onreadystatechange.apply(this, arguments); }
                if (this.readyState == 4) {
                    target.trigger('network@xhr', {
                        method: "onreadystatechange",
                        content: this,
                        fullUrl: this.responseURL,
                        id: this.__yelloxing__debugger__id__
                    });
                }
            };

            // 拦截请求
            open.apply(this, arguments);
            target.trigger('network@xhr', {
                method: "open",
                content: {
                    method: arguments[0],
                    url: arguments[1]
                },
                id: this.__yelloxing__debugger__id__
            });
        };

        // 拦截发送
        window.XMLHttpRequest.prototype.send = function () {
            send.apply(this, arguments);
            target.trigger('network@xhr', {
                method: "send",
                params: arguments[0],
                id: this.__yelloxing__debugger__id__
            });
        };

    } else {

        // 如果不支持说明浏览器是IE内核的
        // todo

    }

};