import React, { useEffect } from "react"
import Prism from "../../../components/Prism"

const TypeSysyem = () => {
  useEffect(() => {
    const typeHighlight = document.getElementById("type-highlight")
    const queryHighlight = document.getElementById("query-highlight")
    let line = 0
    const typeLines = [2, 6, 7, 6, 8, 13, 14, 9, 18, 19, 20, 13]
    const queryLines = [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14]
    let timer: any

    const highlightLine = () => {
      typeHighlight!.style.top = 17 * typeLines[line] - 9 + "px"
      queryHighlight!.style.top = 17 * queryLines[line] - 9 + "px"
      line = (line + 1) % typeLines.length
      timer = setTimeout(highlightLine, 800 + Math.random() * 200)
    }
    highlightLine()
    return () => clearTimeout(timer)
  }, [])
  return (
    <section className="point3" id="type-system">
      <div className="prose">
        <h2>描述所有的可能<br />类型系统</h2>
        {/*Illustration of a type IDL following a query by line]*/}
        {/*Under: a server <-> client (Capabilities, Requirements)]?*/}
        <p>GraphQL API 基于类型和字段的方式进行组织，而非入口端点。你可以通过一个单一入口端点得到你所有的数据能力。GraphQL 使用类型来保证应用只请求可能的数据，还提供了清晰的辅助性错误信息。应用可以使用类型，而避免编写手动解析代码。</p>
      </div>
      <div className="window strong-typed-query" aria-hidden>
        <div className="query">
          <div id="query-highlight" className="highlight" />
          <Prism
            language="graphql"
            code={
`{
  hero {
    name
    friends {
      name
      homeWorld {
        name
        climate
      }
      species {
        name
        lifespan
        origin {
          name
        }
      }
    }
  }
}`}
          />
        </div>
        <div className="type-system">
          <div id="type-highlight" className="highlight" />
          <Prism
            language="graphql"
            code={
`type Query {
  hero: Character
}

type Character {
  name: String
  friends: [Character]
  homeWorld: Planet
  species: Species
}

type Planet {
  name: String
  climate: String
}

type Species {
  name: String
  lifespan: Int
  origin: Planet
}`}
          />
        </div>
      </div>
    </section>
  )
}

export default TypeSysyem
