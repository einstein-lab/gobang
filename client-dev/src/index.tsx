import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import App from './App';
import 'antd/dist/antd.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// window.gobang = {
//   player1Run: (board) => {
//     for (let row = 0, len = board?.length; row < len; row++) {
//       for (let column = 0, len = board?.[row]?.length; column < len; column++) {
//         if (board?.[row]?.[column] === 0) {
//           return [row, column];
//         }
//       }
//     }
//     return [0, 0];
//   },
//   player2Run: (board) => {
//     for (let row = 0, len = board?.length; row < len; row++) {
//       for (let column = 0, len = board?.[row]?.length; column < len; column++) {
//         if (board?.[row]?.[column] === 0) {
//           return [row, column];
//         }
//       }
//     }
//     return [0, 0];
//   },
// };
