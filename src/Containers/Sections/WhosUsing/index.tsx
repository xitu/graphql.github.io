import React from "react"
import { Link } from "gatsby"

const WhosUsing = () => {
  return (
    <section className="powered-by" id="whos-using">
      <div className="prose">
        <h2>谁在使用 GraphQL？</h2>
        <p>Facebook 的移动应用从 2012 年就开始使用 GraphQL。GraphQL 规范于 2015 年开源，现已经在多种环境下可用，并被各种体量的团队所使用。</p>
      </div>
      <div className="logos">
        {/* Waiting for permission from some of the below */}
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/users/logos/facebook.png" title="Facebook" />
        </a>
        {/** /}
    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
      <img src="/users/logos/twitter.png" title="Twitter" className="round" />
    </a>
    {/**/}
        <a
          href="https://docs.github.com/en/graphql"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/users/logos/github.png" title="GitHub" className="round" />
        </a>
        <a
          href="https://www.pinterest.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/users/logos/pinterest.png"
            title="Pinterest"
            className="round"
          />
        </a>
        {/** /}
    <a href="https://www.airbnb.com/" target="_blank" rel="noopener noreferrer">
      <img src="/users/logos/airbnb.png" title="Airbnb" className="round" />
    </a>
    {/**/}
        <a
          href="https://www.intuit.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/users/logos/intuit.png" title="Intuit" />
        </a>
        <a
          href="https://www.coursera.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/users/logos/coursera.png" title="Coursera" />
        </a>
        <a
          href="https://www.shopify.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/users/logos/shopify.png"
            title="Shopify"
            className="round"
          />
        </a>
      </div>

      <Link to="/users" className="button">
        更多 GraphQL 使用者
      </Link>
    </section>
  )
}

export default WhosUsing
