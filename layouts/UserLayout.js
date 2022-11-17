import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// Common Imports
import Footer from '../components/user/Footer'
import Header from '../components/user/header/Header'
import Meta from '../components/user/Meta'
import Sidebar from '../components/user/sidebar/Sidebar'

// Services
import { getCategoriesService } from '../services/user/services'

const UserLayout = ({ children }) => {

    // Hooks and vars
    const dispatch = useDispatch()

    useEffect(() => {
        getCategoriesService({ dispatch })
    }, [])

    return (
        <>
            <Meta />
            <main className="container-fluid">
                <div className="row outerContWrapper">
                    <Header />
                    <Sidebar />
                    <div className="rightColumn rightColumnFeed">
                        <div className="rightMainFormCont rightMainFormContFeed p-0">
                            <div className="preventHeader">preventHead</div>
                            <div className="w-100 py-md-4 p-0 p-md-3 preventFooter">
                                <div className="row forPosSticky">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default UserLayout