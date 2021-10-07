import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import { Grid } from '@material-ui/core';
import Game from './components/Game';
import { useState } from 'react';

function App() {

  const [flagCounter, setFlagCounter] = useState(10);

  return (
    <Grid>
      <AppHeader flagCounter={flagCounter} />
      <Game setFlagCounter={setFlagCounter} flagCounter={flagCounter}/>
      <AppFooter />
    </Grid>
  );
}

export default App;
