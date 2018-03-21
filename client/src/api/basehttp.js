import Vue from 'vue'
import TokenMgr from '../mgr/TokenMgr'
import { Message } from 'element-ui'

let vue = new Vue()

export function getHttp (url, params) {
  return new Promise((resolve, reject) => {
    vue.axios.get(url, {params: params})
      .then(response => {
        if (response.data.success === false) {
          Message.error(response.data.message)
          return
        }
        setTimeout(() => {
          resolve(response.data)
        }, 300)
      })
      .catch(error => {
        reject(error.message)
      })
  })
}

export function deleteHttp (url) {
  return new Promise((resolve, reject) => {
    configAxios()
    vue.axios.delete(url)
      .then(response => {
        setTimeout(() => {
          if (response.data.success === false) {
            Message.error(response.data.message)
            return
          }
          resolve(response.data)
        }, 300)
      })
      .catch(error => {
        reject(error.message)
      })
  })
}
export function postHttp (url, body, params) {
  return new Promise((resolve, reject) => {
    vue.axios({
      method: 'post',
      url: url,
      params: params,
      data: body
    }).then(response => {
      setTimeout(() => {
        if (response.data.success === false) {
          Message.error(response.data.message)
          return
        }
        resolve(response.data)
      }, 300)
    }).catch(error => {
      reject(error.message)
    })
  })
}

export function configAxios() {
  vue.axios.defaults.baseURL = 'http://localhost:3008/'
  vue.axios.defaults.headers.common['Content-Type'] = 'application/json'
  vue.axios.default.timeout = 60000
  let token = TokenMgr.get(vue.axios.defaults.baseURL)
  if (token) {
    vue.axios.defaults.headers.Authorization = 'Bearer' + ' ' + token
  }
  vue.axios.interceptors.response.use({}, error => {
    if (!error.response) {
      error.message = '请检查网络设置'
      return Promise.reject(error)
    }
    switch (error.response.status) {
      case 101:
        break
      case 401:
        error.message = '登录已过期,请重新登录!'
        // 清除用户信息
        // 登录
        setTimeout(() => {
          vue.router.push('/')
        }, 500)
        break
      case 403:
        error.message = '禁止访问!'
        break
      case 408:
        error.message = '请求超时!'
        break
      case 500:
        error.message = '服务内部异常!'
        break
      case 503:
        error.message = '服务器升级中!'
        break
      case 504:
        error.message = '网关超时!'
        break
      default:
        error.message = '未知错误'
        break
    }
    return Promise.reject(error)
  })
}
