import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import Home from './features/home/Home';
import Started from './features/comp/Started';
import Merge from './features/comp/Merge';
import Update from './features/comp/Updates';
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      
        <Home/>
    
    ),
  },
  {
    path: '/merge',
    element: (
      
      <Merge/>
    
    ),
  },
  // #get-started
  {
    path: '/get-started',
    element: (
      <Started/>
    
    ),
  },
  {
    path: '/updates',
    element: (
      <Update/>
    
    ),
  }
]);
function App() {
  return (
    <div className="App">
    {/* <Provider template={AlertTemplate} {...options}> */}
            <RouterProvider router={router} />
          {/* </Provider> */}
    </div>

  );
}

export default App;
