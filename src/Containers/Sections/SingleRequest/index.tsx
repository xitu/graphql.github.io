import React from 'react';
import Prism from '../../../components/Prism';

const SingleRequest = () => {
    return (
        <div className="grayWash">
        <section className="point2" id="single-request">
          <div className="prose">
            <h2>获取多个资源<br />只用一个请求</h2>
            {/*Illustration: a query 2 or 3 levels deep]*/}
            <p>GraphQL 查询不仅能够获得资源的属性，还能沿着资源间引用进一步查询。典型的 REST API 请求多个资源时得载入多个 URL，而 GraphQL 可以通过一次请求就获取你应用所需的所有数据。这样一来，即使是比较慢的移动网络连接下，使用 GraphQL 的应用也能表现得足够迅速。</p>
          </div>
          <div className="app-to-server" aria-hidden>
            <img
              src="/img/phone.svg"
              width="496"
              height="440"
              className="phone"
            />
            <div className="query">
              <Prism code={
`{
    hero {
    name
    friends {
        name
        }
    }
}`} language="graphql" />
            </div>
            <div className="response">
            <Prism code={
`{
    "hero": {
      "name": "Luke Skywalker",
      "friends": [
        { "name": "Obi-Wan Kenobi" },
        { "name": "R2-D2" },
        { "name": "Han Solo" },
        { "name": "Leia Organa" }
      ]
    }
}`} language="json" />
            </div>
            <img
              src="/img/server.svg"
              width="496"
              height="440"
              className="server"
            />
          </div>
        </section>
      </div>
    );
};

export default SingleRequest;