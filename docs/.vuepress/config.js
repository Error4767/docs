const sidebar = require('./sidebar.json');
module.exports = {
  title: 'Ecuder Document',
  description: 'Just playing around',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'GitHub', link: 'https://github.com/Error4767/Error4767-static/tree/master/Markdown' }
    ],
    sidebar: [
      ...sidebar.children
    ]
  }
}