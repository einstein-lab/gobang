import styles from './App.less';
import React from 'react';
import { GobangRender as Gobang } from './components';

const App: React.FunctionComponent = () => {
  return (
    <div className={styles['app']}>
      <Gobang />
    </div>
  );
};

export default App;
