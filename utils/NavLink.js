import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const NavLink = ({ href = null, className = null, children, asHref = null }) => {

    // Hooks and vars
    const pathname = useRouter().pathname
    const tempPathName = pathname.replace("/", "")
    const tempPath = href.replace("/", "")
    let isCurrentLinkActive = tempPathName.startsWith(tempPath) && href !== ""
    if (href === "/") isCurrentLinkActive = pathname === "/"

    const props = {
        className: `${isCurrentLinkActive ? "active" : ""} ${className ?? ""}`,
        ...(asHref && { as: asHref })
    }

    return (
        <Link
            href={href}
            {...props}>
            {children}
        </Link>
    )
}

export default NavLink