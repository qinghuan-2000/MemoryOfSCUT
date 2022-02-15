export default {
  // assetsPublicPath: './',
  publicDir: './',
  base: './',
  proxy: {
    '/api': {
      target: 'https://acimg.micerlabs.com/momscut',
      changeOrigin: true,
      rewrite: (path) => {
        console.log('/api', path);
        return path;
      }
    }
  }
};
