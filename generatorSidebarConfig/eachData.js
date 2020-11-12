function eachData(data, callback) {
  if(typeof data !== 'object') {
    return data;
  }
  if(data.children instanceof Array) {
    let result = {...data};
    result.children = data.children.map(v=> {
      return eachData(v, callback);
    });
    return callback(result);
  }else {
    return  callback(data);
  }
}

export default eachData;