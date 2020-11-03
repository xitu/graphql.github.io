import React from "react"
import Layout from "../components/Layout"

export default ({ pageContext }) => {
  return (
    <Layout title="Who's Using | GraphQL" pageContext={pageContext}>
      <section className="whos-using-page">
        <div className="prose">
          <h1>谁在使用 GraphQL？</h1>
          <p>
            GraphQL 已经被各种体量的团队所使用，在不同的环境、不同的语言下，用于增强移动应用、网站和 API。
          </p>
          <p>
            你的公司也在使用 GraphQL 吗？<br />
            请参考 <a href="https://github.com/graphql/graphql-landscape#new-entries">说明文档</a> 来向 <a href="https://github.com/graphql/graphql-landscape">GraphQL Landscape</a> 提交你的拉取请求吧。
          </p>
        </div>

        <iframe
          frameBorder="0"
          id="landscape"
          scrolling="no"
          style={{ width: "1px", minWidth: "100%" }}
          src="https://landscape.graphql.org/category=graph-ql-adopter&format=card-mode&grouping=category&embed=yes"
          onLoad={() => {
            const scriptElem = document.createElement('script');
            scriptElem.type = 'text/javascript';
            scriptElem.src = "https://landscape.cncf.io/iframeResizer.js";
            scriptElem.onload = () => (window as any)["iFrameResize"]();
            document.body.appendChild(scriptElem);
          }}
        ></iframe>
      </section>
    </Layout>
  )
}
