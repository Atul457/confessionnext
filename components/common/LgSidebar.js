// import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AppLogo from './AppLogo'


export default function LgSidebar(props) {

    return (
        <div className="leftColumn">
            <div className="leftColumnWrapper">
                <div className="appLogo">
                    <AppLogo />
                </div>

                <Link href={`${props?.removeLink === true ? "#" : "/"}`} className='textDecNone'>
                    <div className="middleContLoginReg">
                        <div className="confesstText">
                            {props.middleTitle}
                        </div>
                        <div className="loginInfoCont">
                            {props.middleTextBody}
                        </div>
                    </div>
                </Link>

                <div className={`bottomContLoginReg ${props.hidden === true && "hiddenImg"}`}>
                    <Link href={`${props?.removeLink ? "#" : "/"}`} className='textDecNone'>
                        <img src={props.bottomLogo} alt="bottomLogo" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
