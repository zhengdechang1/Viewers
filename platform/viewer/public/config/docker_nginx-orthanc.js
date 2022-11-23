/*
 * @Description: 
 * @Author: eleven
 * @Date: 2022-11-21 21:23:57
 */


window.config = {
  routerBasename: '/',
  showStudyList: true,
  servers: {
    dicomWeb: [
      {
        name: 'Orthanc',
        wadoUriRoot: '/10.10.99.88:8042/wado',
        qidoRoot: '/10.10.99.88:8042/dicom-web',
        wadoRoot: '/10.10.99.88:8042/dicom-web',
        // wadoUriRoot: 'http://10.10.99.8:8042/wado',
        // qidoRoot: 'http://10.10.99.8:8042/dicom-web',
        // wadoRoot: 'http://10.10.99.8:8042/dicom-web',
        qidoSupportsIncludeField: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
      },
    ],
  },
};
