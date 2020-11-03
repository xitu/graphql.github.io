import React from "react"
import Layout from "../components/Layout"

import Search from "../components/Search"

import Hero from "../Containers/Sections/Hero"
import SingleRequest from "../Containers/Sections/SingleRequest"
import TypeSystem from "../Containers/Sections/TypeSystem"
import PredictableResults from "../Containers/Sections/PredictableResults"
import BringYourOwnData from "../Containers/Sections/BringYourOwnCode"
import WithoutVersions from "../Containers/Sections/WithoutVersion"
import PowerFulTools from "../Containers/Sections/PowerFulTools"
import WhosUsing from "../Containers/Sections/WhosUsing"

export default ({ pageContext }) => {
  return (
    <Layout className={"index"} title="GraphQL | A query language for your API" pageContext={pageContext}>
      <section className="fixedSearch">
        <Search searchID="hero-search-input" />
      </section>
      <Hero />
      <section className="lead">
        <h1>一种用于 API 的查询语言</h1>
        <p>GraphQL 既是一种用于 API 的查询语言也是一个满足你数据查询的运行时。 GraphQL 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。</p>
      </section>
      <PredictableResults />
      <SingleRequest />
      <TypeSystem />
      <PowerFulTools />
      <WithoutVersions />
      <BringYourOwnData />
      <WhosUsing />
    </Layout>
  )
  }
