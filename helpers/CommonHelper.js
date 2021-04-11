const CommonHelper = {

  mergeObjArr(a, b, p) {
    return a.filter( aa => ! b.find ( bb => aa[p] === bb[p]) ).concat(b);
  },

  copyObject(obj){
    return JSON.parse(JSON.stringify(obj));
  }

}


module.exports = CommonHelper;