/**
 * 拦截网络请求服务(Web Socket)
 *
 * @author 心叶(yelloxing)
 *
 * 2020年8月21日于南京
 */

export default function (target) {

    if (window.WebSocket) {

        // 原生的请求方法
        // const { onmessage } = window.WebSocket.prototype;

        // window.WebSocket.prototype.onmessage = function () {
        //     if (onmessage) { onmessage.apply(this, arguments); }
        //     debugger
        //     target.trigger('network@ws', {
        //     });
        // };

    } else {

        // 如果浏览器不支持
        // todo

    }

};