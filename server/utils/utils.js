const axios = require('axios')

const axiosProxyRequest = (proxyIp, url) => {
  return axios.get(url, {
    proxy: {
      host: proxyIp.split(':')[0],
      port: proxyIp.split(':')[1],
    },
  })
}

module.exports = { axiosProxyRequest }
