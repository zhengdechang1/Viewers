/*
 * @Description:
 * @Author: eleven
 * @Date: 2022-11-21 21:22:32
 */
/**
 * Entry point for development and production PWA builds.
 * Packaged (NPM) builds go through `index-umd.js`
 */

import 'regenerator-runtime/runtime';

import App from './App.js';
import React from 'react';
import ReactDOM from 'react-dom';
// test

/**
 * EXTENSIONS
 * =================
 *
 * Importing and modifying the extensions our app uses HERE allows us to leverage
 * tree shaking and a few other niceties. However, by including them here they become
 * "baked in" to the published application.
 *
 * Depending on your use case/needs, you may want to consider not adding any extensions
 * by default HERE, and instead provide them via the extensions configuration key or
 * by using the exported `App` component, and passing in your extensions as props using
 * the defaultExtensions property.
 */
import OHIFVTKExtension from '@ohif/extension-vtk';
import OHIFDicomHtmlExtension from '@ohif/extension-dicom-html';
import OHIFDicomSegmentationExtension from '@ohif/extension-dicom-segmentation';
import OHIFDicomRtExtension from '@ohif/extension-dicom-rt';
import OHIFDicomMicroscopyExtension from '@ohif/extension-dicom-microscopy';
import OHIFDicomPDFExtension from '@ohif/extension-dicom-pdf';
//import OHIFDicomTagBrowserExtension from '@ohif/extension-dicom-tag-browser';
// Add this for Debugging purposes:
//import OHIFDebuggingExtension from '@ohif/extension-debugging';
import { version } from '../package.json';
import ReplaceStr from './utils/replaceStr.js';

/*
 * Default Settings
 */
let config = {};

if (window) {
  config = window.config || {};
  window.version = version;
}

const appProps = {
  config,
  defaultExtensions: [
    OHIFVTKExtension,
    OHIFDicomHtmlExtension,
    OHIFDicomMicroscopyExtension,
    OHIFDicomPDFExtension,
    OHIFDicomSegmentationExtension,
    OHIFDicomRtExtension,
    //OHIFDebuggingExtension,
    //OHIFDicomTagBrowserExtension,
  ],
};

/** Create App */
const app = React.createElement(App, appProps, null);

let serve = new ReplaceStr(window.config.servers.dicomWeb[0])
localStorage.setItem("defaultServe", JSON.stringify(serve.ip))

let serverList = JSON.parse(localStorage.getItem("serverList"))


const defaultServerList = [
  '10.10.99.88',
  '10.10.99.8',
  '10.10.99.123',
  '10.10.99.208',
]

if (JSON.stringify(serverList) == "{}" || !serverList) {
  localStorage.setItem('serverList', JSON.stringify(defaultServerList.map(serve => {
    return { key: serve, ip: serve, alias: serve }
  })))
}




/** Render */
ReactDOM.render(app, document.getElementById('root'));
