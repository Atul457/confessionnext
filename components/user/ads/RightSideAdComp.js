import React from 'react'
import { envConfig } from '../../../utils/envConfig'
import { AdSenseSideAd } from './AdMob'
import styles from "./SidebarAdComp.module.css"

const RightSideAdComp = () => {
    return (
        <>
            <div className={`${styles.outerAdCont} ${!envConfig?.isProdMode ? styles.bgAdGray : ""}`}>
                <div className={styles.rightSideAdCont}>
                    {envConfig?.isProdMode ? <AdSenseSideAd /> : null}
                </div>
            </div>
        </>
    )
}

export default RightSideAdComp