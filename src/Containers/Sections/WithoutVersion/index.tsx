import React, { useEffect } from "react"
import Prism from "../../../components/Prism"

const WithoutVersion = () => {
  useEffect(() => {
    let i = 0
    let inView = document.getElementById("typeEvolveView")
    inView!.className = "step" + i
    const interval = setInterval(function () {
      i = (i + 1) % 7
      inView!.className = "step" + i
    }, 2200)
    return () => clearInterval(interval)
  })
  return (
    <div className="grayWash">
      <section className="point5" id="without-versions">
        <div className="prose">
          <h2>API 演进<br />无需划分版本</h2>
          {/*Illustration showing more legs added to a graph? Or a type evolving over time?]*/}
          <p>给你的 GraphQL API 添加字段和类型而无需影响现有查询。老旧的字段可以废弃，从工具中隐藏。通过使用单一演进版本，GraphQL API 使得应用始终能够使用新的特性，并鼓励使用更加简洁、更好维护的服务端代码。</p>
        </div>
        <div className="window type-evolution" aria-hidden>
          <div id="typeEvolveView">
            <div className="v1">
              <Prism
                language="graphql"
                code={
`type Film {
  title: String
  episode: Int
  releaseDate: String



}`}
              />
            </div>
            <div className="v2">
              <div className="add" />
              <Prism
                language="graphql"
                code={
`type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String


}`}
              />
            </div>
            <div className="v3">
              <div className="add" />
              <Prism
                language="graphql"
                code={
`type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String
  
}`}
              />
            </div>
            <div className="v4">
              <div className="add" />
              <div className="add" />
              <div className="add" />
              <div className="add" />
              <div className="add" />
              <div className="add" />
              <div className="remove" />
              <Prism
                language="graphql"
                code={
`type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String
  directedBy: Person
}

type Person {
  name: String
  directed: [Film]
  actedIn: [Film]
}`}
              />
            </div>
            <div className="v5">
              <div className="add" />
              <Prism
                language="graphql"
                code={
`type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String @deprecated
  directedBy: Person
}

type Person {
  name: String
  directed: [Film]
  actedIn: [Film]
  
}`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WithoutVersion
