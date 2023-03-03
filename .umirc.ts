import { defineConfig } from 'dumi';

export default defineConfig({
  title: '慢慢走',
  mode: 'doc',
  exportStatic: {},
  logo: 'https://s2.loli.net/2023/02/24/BLxk6PRgm3JKDhu.png',
  favicon: 'https://s2.loli.net/2023/02/24/BLxk6PRgm3JKDhu.png',
  // more config: https://d.umijs.org/config
  // base: '/southlamp.github.io',
  // publicPath: '/southlamp.github.io/',
  styles: [`.gt-copyright { display: none; }`],
});
