import './App.css'
import Routing from './config/router/Routing'

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
// import store from './config/redux/store';
import { store, persistor } from './config/redux/store';


import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";


function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PrimeReactProvider>
          <Routing />
        </PrimeReactProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
