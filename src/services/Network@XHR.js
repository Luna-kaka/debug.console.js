/**
 * 拦截网络请求服务(Xml Http Request)
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
            let { ontimeout, onerror, onloadend } = this;


            this.onloadend = function () {
                if (onloadend) { onloadend.apply(this, arguments); }

                if (this.readyState == 4) {
                    target.trigger('network@xhr', {
                        method: "end",
                        responseMessage: {
                            URL: this.responseURL,
                            status: this.status,
                            statusText: this.statusText,
                            response: this.response ? JSON.parse(this.response) : this.response,
                            responseText: this.responseText
                        },
                        // 表示正常结束
                        type: 'network-ok',
                        id: this.__yelloxing__debugger__id__
                    });
                }
            };

            this.ontimeout = function () {
                if (ontimeout) { ontimeout.apply(this, arguments); }
                target.trigger('network@xhr', {
                    method: "end",
                    responseMessage: {},
                    // 表示请求超时
                    type: 'timeout',
                    id: this.__yelloxing__debugger__id__
                });
            };

            this.onerror = function () {
                if (onerror) { onerror.apply(this, arguments); }
                target.trigger('network@xhr', {
                    method: "end",
                    responseMessage: {},
                    // 表示发生错误
                    type: 'error',
                    id: this.__yelloxing__debugger__id__
                });
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
            try {
                send.apply(this, arguments);
            } catch (e) {
                target.trigger('network@xhr', {
                    method: "end",
                    responseMessage: e,
                    type: "send-error",
                    id: this.__yelloxing__debugger__id__
                });
                throw e;
            }

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