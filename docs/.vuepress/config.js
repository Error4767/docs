const sidebar = require('./sidebar.json');
module.exports = {
  title: 'Ecuder Document',
  description: 'Just playing around',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide' },
      { text: 'GitHub', link: 'https://github.com/Error4767/Error4767-static/tree/master/Markdown' }
    ],
    sidebar: [
      ...sidebar.children
    ]
  }
}