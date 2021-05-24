import React from "react"

const PowerFulTools = () => {
  return (
    <div className="darkWash">
      <section className="point4" id="powerful-tools">
        <div className="prose">
          <h2>快步前进<br />强大的开发者工具</h2>
          {/*Illustration of GraphiQL validation error and typeahead, animated?]*/}
          <p>不用离开编辑器就能准确知道你可以从 API 中请求的数据，发送查询之前就能高亮潜在问题，高级代码智能提示。利用 API 的类型系统，GraphQL 让你可以更简单地构建如同
            <a href="https://github.com/graphql/graphiql" target="_blank" rel="noopener">Graph<em>i</em>QL</a>
            的强大工具。</p>
        </div>
        <div className="graphiqlVid">
          {" "}
          <video autoPlay muted loop playsInline >
            <source src="/img/graphiql.mp4?x" type="video/mp4" />
          </video>
        </div>
      </section>
    </div>
  )
}

export default PowerFulTools
