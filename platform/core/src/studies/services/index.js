/*
 * @Description:
 * @Author: eleven
 * @Date: 2022-11-21 21:26:10
 */
// DICOMWeb instance, study, and metadata retrieval
import Instances from './qido/instances.js';
import Studies from './qido/studies.js';
import RetrieveMetadata from './wado/retrieveMetadata.js';


let WADO = {
  RetrieveMetadata,
};

let QIDO = {
  Studies,
  Instances,
};




export { QIDO, WADO };
