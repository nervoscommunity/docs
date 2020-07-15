module.exports = {
  title: 'Welcome to CKB Docs',
  tagline: 'This docs is for Nervos Community members',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'nervoscommunity', // Usually your GitHub org/user name.
  projectName: 'website', // Usually your repo name.
  themeConfig: {
    gaGtag: {
      trackingID: 'UA-134814659-2',
    },
    algolia: {
      apiKey: '3c7fd59ae6979a7d317d3a94029c7a56',
      indexName: 'ckb',
      appId: '', // Optional, if you run the DocSearch crawler on your own
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
    navbar: {
      title: 'CKB Docs',
      logo: {
        alt: 'My Site Logo',
        src: 'img/ditto.png',
      },
      links: [
        {to: 'docs/docs/welcome/welcome-introduction', label: '文档', position: 'left'},
        {to: 'blog', label: '博客', position: 'left'},
        {
          href: 'https://community.ckb.dev',
          label: '论坛',
          position: 'left',
        },
        {to: 'docs/rfcs/introduction',label:'RFCs',position:'left'},
        {to: 'docs/qa/welcome',label:'百科',position:'left'},
        {
          href: 'https://github.com/nervoscommunity/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '开发文档',
              to: 'docs/docs/welcome/welcome-introduction',
            },
            {
              label: '博客',
              to: 'blog',
            },
            {
              label: 'RFCs',
              to: 'docs/rfcs/introduction',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: '社区开发者论坛',
              href: 'https://community.ckb.dev',
            },
            {
              label: '官方论坛',
              href: 'https://talk.nervos.org',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/uWGUUpw',
            },
          ],
        },
        {
          title: '社交',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/nervoscommunity/docs',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/love_nervos',
            },
            {
              label: '微博',
              href: 'https://weibo.com/7198050632/profile?topnav=1&wvr=6',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nervos Community. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/nervoscommunity/docs/blob/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
