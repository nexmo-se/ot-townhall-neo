import "@vonagevolta/volta2/dist/css/volta.min.css";
import "assets/css/style.css";

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import OT from "@opentok/client"
import * as serviceWorker from './serviceWorker';

import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
  disableGlobal: true
});

// OT.setLogLevel(OT.DEBUG);
ReactDOM.render(
  <StylesProvider generateClassName={generateClassName}>
    <App />
  </StylesProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
