import React from 'react'
import ErrorFlash from '../components/common/ErrorFlash'

const _error = () => {
    return (
        <h5 className='w-100'><ErrorFlash message="404 | Page not found" /></h5>
    )
}

export default _error