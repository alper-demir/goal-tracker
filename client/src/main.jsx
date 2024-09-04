import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from "./router.jsx"
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toaster position='top-right' />
    <RouterProvider router={router} />
  </Provider>
)