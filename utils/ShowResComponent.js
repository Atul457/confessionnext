import React from 'react'

const ShowResComponent = ({
    isError = true,
    classList = "",
    style = {},
    message = ""
}) => {
    return (
        <span className={`d-block ${isError ? "errorCont" : 'success_cont text-success'} ${classList}`} style={style}>
            {message}
        </span>
    )
}

export {
    ShowResComponent
}