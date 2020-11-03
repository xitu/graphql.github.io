import React, { useEffect } from "react"
import Prism from "../../../components/Prism"

const PredictableResults = () => {
  useEffect(() => {
    const showResponse = (num: Number) => {
      document.getElementById("r1")!.style.display =
        num === 1 ? "block" : "none"
      document.getElementById("r2")!.style.display =
        num === 2 ? "block" : "none"
      document.getElementById("r3")!.style.display =
        num === 3 ? "block" : "none"
    }
    let i = 0
    let forward = true
    let timer: any
    timer = setTimeout(type, 2000)
    showResponse(1)
    function type() {
      if (forward) {
        if (document.getElementById("ch" + i)) {
          document.getElementById("ch" + i)!.style.display = "inline"
          i++
          if (i === 20) {
            forward = false
            showResponse(3)
            timer = setTimeout(type, 1500)
          } else if (i === 11) {
            showResponse(2)
            timer = setTimeout(type, 1500)
          } else {
            timer = setTimeout(type, Math.random() * 180 + 70)
          }
        }
      } else {
        i--
        if (document.getElementById("ch" + i)) {
          document.getElementById("ch" + i)!.style.display = "none"
          if (i === 0) {
            forward = true
            showResponse(1)
            timer = setTimeout(type, 2000)
          } else {
            timer = setTimeout(type, 80)
          }
        }
      }
    }
    return () => clearTimeout(timer)
  }, [])
  return (
    <section className="point1" id="predictable-results">
      <div className="prose">
        <h2>请求你所要的数据<br />不多不少</h2>
        {/*[Illustration: just a simple query and response?]*/}
        <p>向你的 API 发出一个 GraphQL 请求就能准确获得你想要的数据，不多不少。 GraphQL 查询总是返回可预测的结果。使用 GraphQL 的应用可以工作得又快又稳，因为控制数据的是应用，而不是服务器。</p>
      </div>
      <div className="window faux-graphiql" aria-hidden>
        <div className="query">
          <pre className="prism">
            {"{"}
            {"\n  hero {"}
            {"\n    name"}
            {"\n    height\n    mass".split("").map((c, i) => (
              <span key={i} id={"ch" + i} className="ch">
                {c === "\n" ? <br /> : c}
              </span>
            ))}
            <span className="cursor" />
            {"\n  }"}
            {"\n}"}
          </pre>
        </div>
        <div className="response">
          <div id="r1">
            <Prism
              language="json"
              code={
`{
  "hero": {
      "name": "Luke Skywalker"
  }
}`}
            />
          </div>
          <div id="r2">
            <Prism
              language="json"
              code={
`{
  "hero": {
      "name": "Luke Skywalker",
      "height": 1.72
  }
}`}
            />
          </div>
          <div id="r3">
            <Prism
              language="json"
              code={
`{
  "hero": {
      "name": "Luke Skywalker",
      "height": 1.72,
      "mass": 77
  }
}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default PredictableResults
