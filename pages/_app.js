import { Provider } from 'react-redux'
import { store } from "../redux/store"

// Styles
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';

// Utils
import auth from '../utils/auth'

// Layouts
import AdminLayout from '../layouts/AdminLayout'
import UserLayout from '../layouts/UserLayout'

// Third Party
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {

  // Hooks and vars
  const additionalProps = "additionalProps" in Component
  const { getRole, roleTypes } = auth
  const isAdminLoggedIn = getRole() === roleTypes.ADMIN

  return (
    <>
      <Provider store={store}>
        {
          isAdminLoggedIn ?
            (<AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>) :
            (<UserLayout {...additionalProps && ({ additionalProps: Component.additionalProps })}>
              <Component {...pageProps} />
            </UserLayout>)
        }
      </Provider>
      <ToastContainer />
    </>
  )
}

export default MyApp
