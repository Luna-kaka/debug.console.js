
const fs = require('fs');
const path = require('path');

module.exports = {

  // 当前配置文件的相对路径上下文
  path: __dirname,

  // package.json路径
  pkg: '.',

  // 注册任务
  task(cuf, pkg, rootPath) {

    let banner = `
/*!
* Debug - ${pkg.description}
* ${pkg.repository.url}
* 
* author ${pkg.author}
*
* version ${pkg.version}
*
* Copyright 心叶
* Released under the ${pkg.license} license
* 
* Date:${new Date()}
*/
        `;

    [
      path.join(rootPath, './build/debug.console.min.js')
    ].forEach(targetPath => {

      fs.writeFileSync(targetPath, banner + "\n" + fs.readFileSync(targetPath));

    });

  }
};