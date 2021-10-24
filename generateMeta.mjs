import { readDirectoryTree } from "unstable-node";
import fs from "fs";

function eachTreeNodeWithNodeParents(node, callback, parents = []) {
  if (typeof node !== 'object') {
    return;
  }

  Array.isArray(node) && node.map(v => {
    eachTreeNodeWithNodeParents(v, callback);
  });

  //  遍历其子节点时候 parents 加上自己
  let childNodesParents = [...parents, node];

  Array.isArray(node.children) && node.children.map(v => {
    return eachTreeNodeWithNodeParents(v, callback, childNodesParents);
  });

  callback(node, parents);
}

async function generateHadMetaMarkdown() {
  const treeData = await readDirectoryTree("./source/_posts");
  const files = [];
  eachTreeNodeWithNodeParents(treeData, (node, parents) => {
    if (node.type === "file") {
      if (parents) {
        // 所在目录路径
        const directory = parents[parents.length - 1].directory;
        node.categories = directory.substr(directory.lastIndexOf("/") + 1);
        // const lastUpdateTime = node.stat.ctime;
        // const [year, month, day] = [lastUpdateTime.getFullYear(), lastUpdateTime.getMonth(), lastUpdateTime.getDay()];
        files.push({ ...node});
      }
    }
  });
  files.forEach((node) => {
    const filename = node.file.substr(node.file.lastIndexOf("/") + 1).split(".")[0];
  //   year: ${node.year}
  // month: ${node.month}
  // day: ${node.day}
    const fileContent = `---
title: ${filename}
${node.categories ? `categories: ${node.categories}` : ""}
---
${fs.readFileSync(node.file, "utf-8")}`;
    fs.writeFileSync(node.file, fileContent);
  });
}
try {
  generateHadMetaMarkdown();
} catch(err) {
  console.log(err);
}

console.log("runed");