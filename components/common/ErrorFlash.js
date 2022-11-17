import React from 'react'

// Utils
import { getMessageToShow } from '../../utils/api'

const ErrorFlash = ({ className = null, type = "danger", message }) => {
    return (
        <div className={`${className ? className : ""} alert alert-${type} w-100`} role="alert">
            {getMessageToShow(message)}
        </div>
    )
}

export default ErrorFlash