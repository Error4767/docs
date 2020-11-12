import { readDirectoryTree } from 'unstable-node';
import eachData from './eachData.js';
import fs from 'fs';

(async function () {
  let result = await readDirectoryTree('./Markdown');
  let rt = eachData(result, (node)=> {
    if(node.file) {
      const title = node.file.substr(node.file.lastIndexOf('/') + 1).replace('.md', '');
      node.title = title;
      const path = encodeURI('/' + node.file.replace('.md', ''));
      delete node.file;
      delete node.type;
      delete node.stat;
      node = [path, title];
    }else if(node.directory){
      const title = node.directory.substr(node.directory.lastIndexOf('/') + 1);
      node.title = title;
      // node.path = '/' + node.directory.replace('./', '') + '/README';
      delete node.directory;
      delete node.type;
    }
    return node;
  });
  console.log(rt);
  fs.writeFileSync('./sidebar.json', JSON.stringify(rt, null, 2));
})()