module.exports = {
  siteMetadata: {
    title: "一种为你的 API 而生的查询语言",
    description:
      "GraphQL 提供了 API 中数据的完整描述，提供让客户端能够准确地获取需要的数据而不包含任何冗余的能力，让 API 更加容易随着时间推移而演进，并提供强大的开发者工具。",
    siteUrl: "http://graphql.cn/",
  },

  plugins: [
    "gatsby-plugin-react-helmet",
    'gatsby-plugin-anchor-links',
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/src/content`,
      },
    },
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: `Rubik`,
              variants: [`300`],
            },
            {
              family: `Roboto Mono`,
              variants: [`400`, `400i`, `600`],
            },
            {
              family: `Roboto`,
              variants: [`300`],
            },
          ],
        },
      },
    },
    `gatsby-plugin-less`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-44373548-16",
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(
                ({
                  node: {
                    excerpt,
                    frontmatter: { title, date, permalink, byline },
                  },
                }) => ({
                  title,
                  date,
                  url: site.siteMetadata.siteUrl + permalink,
                  description: excerpt,
                  author: byline,
                })
              ),
            query: `
              {
                allMarkdownRemark(
                  filter: {frontmatter: {layout: {eq: "blog"}}},
                  sort: { order: DESC, fields: [frontmatter___date] }
                ) {
                  edges {
                    node {
                      excerpt
                      frontmatter {
                        title
                        date
                        permalink
                        byline
                      }
                    }
                  }
                }
              }
            `,
            output: "/blog/rss.xml",
            title: "Blog | GraphQL",
            feed_url: "http://graphql.org/blog/rss.xml",
            site_url: "http://graphql.org",
          },
        ],
      },
    },
  ],
}
