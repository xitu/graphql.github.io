import { Link } from 'gatsby';
import React from 'react';
import HeaderLinks from '../../../components/HeaderLinks';
import Prism from '../../../components/Prism';

  
const Hero = () => {
    return (
      <div className="hero">
        <div className="abs">
          <header aria-hidden>
            <section>
              <HeaderLinks />
            </section>
          </header>
          <section className="intro">
            <div className="named-logo">
              <img src="/img/logo.svg" alt="GraphQL Logo" />
              <h1>GraphQL</h1>
            </div>

            <div className="marketing-col">
              <h3>描述你的数据</h3>
              <Prism
                code={`type Project {
  name: String
  tagline: String
  contributors: [User] 
}`}
                language={"graphql"}
              />
            </div>

            <div className="marketing-col">
              <h3>请求你所要的数据</h3>
              <Prism
                code={`{
  project(name: "GraphQL") {
    tagline
  }
}`}
                language={"graphql"}
              />
            </div>

            <div className="marketing-col">
              <h3>得到可预测的结果</h3>
              <Prism
                code={`{
  "project": {
    "tagline": "A query language for APIs"
  }
}`}
                language={"json"}
              />
            </div>
          </section>

          <div className="buttons-unit">
            <Link className="button" to="/code/">
              马上开始
            </Link>
            <Link className="button" to="/learn/">
              了解更多
            </Link>
          </div>
        </div>
      </div>
    )
};

export default Hero;