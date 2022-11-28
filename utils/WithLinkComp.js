import Link from 'next/link'
import React from 'react'
import { scrollDetails } from './dom'


const WithLinkComp = ({ children, link, className = "", ...rest }) => {

    // console.log(link)

    const classList = className === "" ? "" : ` ${className} `
    const props = {
        ...(rest?.rememberScrollPos === true && {
            onClick: () => {
                scrollDetails.setScrollDetails({ pageName: rest?.pageName, scrollPosition: window.scrollY })
            }
        })
    }
    return (
        <Link
            {...props}
            href={link ?? "#"}
            className={`${classList}text-decoration-none`}>
            {children}
        </Link>
    )
}

export default WithLinkComp