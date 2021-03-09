import axios from 'axios'
import utils from '@/utils/utils';
import _Config from '@/utils/config';

const request = axios.create({
  method: "POST",
  baseURL: "https://motd.52craft.cc/api/",
  timeout: 3000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
  withCredentials: false, // Chrome 80版本后会拦截, 测试时需将Chrome浏览器的 SameSite 关闭
})

// 请求拦截器
request.interceptors.request.use(config => {
  config.params = {
    token: utils.doCrypt(config.params, _Config.tokenKey)
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(response => {
  if (utils.isEmpty(response.data.data)) {
    return [];
  } else {
    response.data.data = JSON.parse(utils.doCrypt(response.data.data, _Config.tokenKey, true));
    // console.log(response);
    return response;
  }

}, function (error) {
  return Promise.reject(error);
});

export default request
