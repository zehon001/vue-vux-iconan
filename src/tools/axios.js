import axios from "axios"
import Vue from "vue"


//设置全局请求为ajax请求
axios.interceptors.request.use((config) => {
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    return config;
});

//错误处理
axios.interceptors.response.use(
    (response) => {
        let result = response.data;
        //console.log(result);

        if (!result) {
            result = {
                code: 3,
                msg: "未获取到数据"
            }
        }

        result.message = result.msg;
        

        //stateCode为0表示正常返回数据，其他情况表示有错误，错误信息由message提供
        switch (result.code) {
            case 0:
                return result.data;
            case 1:
                //没有登录
                break;
            case 2:
                //其他错误
                break;
            default:
                break;
        }

        let err = new Error(result.message);

        err.data = result;
        err.response = response;

        throw err;
    },
    (err) => {
        if (err && err.response) {
            if (err.response.status == 404) {
                err.message = "请求地址不存在";
            }
            else {
                err.message = "网络异常，请稍后重试[" + err.response.status + "]";
            }
        }
        else {
            err.message = "网络异常，请稍后重试";
        }
        Vue.prototype.instance.$vux.toast.show(err.message);
        return Promise.reject(err);
    }
);

export default axios;