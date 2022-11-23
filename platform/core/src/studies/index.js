/*
 * @Description:
 * @Author: eleven
 * @Date: 2022-11-21 21:23:56
 */
import { QIDO, WADO } from './services/';
import {
  deleteStudyMetadataPromise,
  retrieveStudyMetadata,
} from './retrieveStudyMetadata.js';

import getStudyBoxData from './getStudyBoxData';
import retrieveStudiesMetadata from './retrieveStudiesMetadata.js';
import searchStudies from './searchStudies';
import sortStudy from './sortStudy';


// const retrieveStudiesMetadata = (server, ...res) => {
//   let serve = JSON.parse(localStorage.getItem('serve'))
//   console.log('serve12333r: ', serve);
//   if (serve !== undefined || serve !== {}) {
//     server = { ...server, ...serve }
//   }
//   return retrieveStudiesMetadatas(server, ...res)
// }

export const changeServe = (object) => {

  let list = Object.keys(object)

  let res = list.reduce((pre, item) => {
    let midFn = object[item]
    console.log('midFn: ', midFn);
    Object.defineProperty(object, [item], {
      value: function (...arg) {
        let [server, ...params] = arg
        if (server) {
          let serve = JSON.parse(localStorage.getItem('serve'))
          if (!serve || JSON.stringify(serve) !== "{}") {
            server = { ...server, ...serve }
            params = [server, ...params]
          }
        }
        midFn(...params)
      }
    })
    pre[item] = object[item]
    return pre
  }, {})
  return res
}

let serveApi = {
  retrieveStudyMetadata,
  deleteStudyMetadataPromise,
  retrieveStudiesMetadata,

}
let serveApiExport = changeServe(serveApi)

const studies = {
  services: {
    QIDO,
    WADO,
  },
  loadingDict: {},
  searchStudies,
  sortStudy,
  getStudyBoxData,
  ...serveApiExport
};

export default studies;
