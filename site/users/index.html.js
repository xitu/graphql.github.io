/**
 * Copyright (c) 2015, GraphQL Contributors
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var Site = require('../_core/Site');

const iframe = '<iframe frameBorder="0" id="landscape" scrolling="no" style="width: 1px; min-width: 100%" src="https://landscape.graphql.org/category=graph-ql-adopter&format=card-mode&grouping=category&embed=yes"></iframe>';

function Iframe(props) {
  return (<div dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }} />);
}

module.exports = ({ page }) =>
  <Site title="谁在使用" page={page}>
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

      <Iframe iframe={iframe} />

      <script src="https://landscape.cncf.io/iframeResizer.js"></script>

    </section>
  </Site>
