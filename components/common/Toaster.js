import React from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Toaster = ({ message, confDetails }) => {

    const navigate = useRouter().push
    const type = parseInt(confDetails.type)
    const isForum = type === 4
    const confession_link = `/${isForum ? "forums" : "confession"}/${confDetails.slug}`

    const navigateToConfession = () => {
        if (type === 1 || isForum) return navigate(confession_link)
        navigate("/chat")
    }
    return (
        <div className='toastBody' onClick={navigateToConfession}>
            <Image src="/images/applogo12.jpg" width={30} height={20} alt="applogo" />
            <span>{message}</span>
        </div>
    )
}

const Toaster2 = ({ message }) => {
    return (
        <div className='toastBody'>
            <Image src="/images/applogo12.jpg" width={30} height={20} alt="applogo"/>
            <span>{message}</span>
        </div>
    )
}

const toaster = (message, data) => {
    toast(<Toaster message={message} confDetails={data} />, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    })
}

const toaster2 = (message) => {
    toast(<Toaster2 message={message} />, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    })
}

const info = (message, data) => {
    toaster(message, data)
}

const toaster2Info = (message) => {
    toaster2(message)
}

const toastMethods = {
    info,
    toaster2Info
}


export default toastMethods