import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const AppLogo = () => {
    return (
        <div className="appLogo">
            <Link href="/">
                <Image src="/images/appLogo.svg" width={170} height={50} alt="App logo" />
                <span className='betaLogo'>BETA</span>
            </Link>
        </div>
    )
}

export default AppLogo