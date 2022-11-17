import Head from 'next/head'
import { Provider } from 'react-redux'
import { store } from "../redux/store"

// Styles
import '../styles/globals.css'

// Utils
import auth from '../utils/auth'


// Layouts
import AdminLayout from '../layouts/AdminLayout'
import UserLayout from '../layouts/UserLayout'

function MyApp({ Component, pageProps }) {

  const { getRole, roleTypes } = auth
  const isAdminLoggedIn = getRole() === roleTypes.ADMIN

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
        />

        {/* jQuery library */}
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

        {/* Latest compiled JavaScript */}
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto&family=Poppins:wght@200;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalam&family=Montserrat:wght@400&family=Raleway:wght@700&family=Roboto&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
      </Head>

      <Provider store={store}>
        {
          isAdminLoggedIn ?
            (<AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>) :
            (<UserLayout>
              <Component {...pageProps} />
            </UserLayout>)
        }
      </Provider>

    </>
  )
}

export default MyApp
