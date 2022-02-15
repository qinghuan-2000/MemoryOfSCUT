import axios from 'axios';

const DEFALUT_PAGE_INDEX = 1; // 从 1 开始
const DEFAULT_PAGE_SIZE = 20;

const inst = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : 'http://127.0.0.1:8088',
  timeout: 5000
});

inst.interceptors.request.use((v) => {
  console.log(v.url, v.params);
  return v;
});

inst.interceptors.response.use(
  // 2xx
  function (response) {
    return response.data;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

// 获取首页轮播图
export function getCarouselList(campus = 'all', keyword = '') {
  return inst.get('/api/lunbo', {
    params: {
      campus,
      keyword
    }
  });
}

// 获取背景音乐
export function getBackgroundMusic() {
  return inst.get('/api/music');
}

// 获取列表
export function getList(url, options = {}) {
  let config = {
    ...options,
    params: {
      offset: DEFALUT_PAGE_INDEX,
      limit: DEFAULT_PAGE_SIZE,
      keyword: '',
      ...options.params
    }
  };
  return inst.get(url, config);
}

// 获取成员列表
export function getMemberList() {
  return inst.get('/api/member').then((response) => response.data);
}

// 获取时光格子
export function getTimeBox(options) {
  return axios.get('/timebox/random', {
    ...options
  });
}
