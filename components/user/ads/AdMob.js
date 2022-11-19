import React, { useEffect } from 'react';
import { isWindowPresent } from '../../../utils/checkDom';


const AdMob = ({ mainContId }) => {

    let moreContent;

    if (isWindowPresent()) {

        window.googletag = window.googletag || { cmd: [] };
        moreContent = () => {
            window.googletag.cmd.push(function () {
                var infinite_map = window.googletag.sizeMapping().addSize([767, 0], [728, 90]).addSize([300, 0], [300, 250]).build();
                // window.googletag.pubads().collapseEmptyDivs();
                window.googletag.defineSlot('/6355419/Travel/Europe', [[728, 90]], mainContId)
                    .defineSizeMapping(infinite_map)
                    .setTargeting("test", "infinitescroll")
                    .addService(window.googletag.pubads());
                window.googletag.pubads().enableSingleRequest();
                window.googletag.enableServices();
                window.googletag.display(mainContId);
            });
        }
    }

    useEffect(() => {
        moreContent();
    }, [])

    return (
        <div className='d-flex justify-content-center'>
            <div id={mainContId} className="gptAdd">
            </div>
        </div>
    );
}


const WhatsNewAds = ({ mainContId }) => {

    let moreContent;

    if (isWindowPresent()) {

        window.googletag = window.googletag || { cmd: [] };
        moreContent = () => {
            window.googletag.cmd.push(function () {
                var infinite_map = window.googletag.sizeMapping().addSize([767, 0], [728, 90]).addSize([300, 0], [300, 250]).build();
                window.googletag.defineSlot('/6355419/Travel/Europe', [[728, 90]], mainContId)
                    .defineSizeMapping(infinite_map)
                    .setTargeting("test", "infinitescroll")
                    .addService(window.googletag.pubads());
                window.googletag.pubads().enableSingleRequest();
                window.googletag.enableServices();
                window.googletag.display(mainContId);
            });
        }
    }

    useEffect(() => {
        moreContent();
    }, [])

    return (
        <div className='d-flex justify-content-center'>
            <div id={mainContId} className="gptAdd">
            </div>
        </div>
    );
}

const LastCommentAd = ({ mainContId }) => {

    let moreContent;

    if (isWindowPresent()) {

        window.googletag = window.googletag || { cmd: [] };
        moreContent = () => {
            window.googletag.cmd.push(function () {
                var infinite_map = window.googletag.sizeMapping().addSize([767, 0], [728, 90]).addSize([300, 0], [300, 250]).build();
                window.googletag.defineSlot('/6355419/Travel/Europe', [[728, 90]], mainContId)
                    .defineSizeMapping(infinite_map)
                    .setTargeting("test", "infinitescroll")
                    .addService(window.googletag.pubads());
                window.googletag.pubads().enableSingleRequest();
                window.googletag.enableServices();
                window.googletag.display(mainContId);
            });
        }

    }

    useEffect(() => {
        moreContent();
    }, [])

    return (
        <div className='d-flex justify-content-center'>
            <div id={mainContId} className="gptAdd">
            </div>
        </div>
    );
}


const AdSense_ = () => {

    useEffect(() => {
        if (isWindowPresent()) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [])

    if (!envConfig.isProdMode) return null

    return (
        <ins className="adsbygoogle"
            style={{ "display": "block" }}
            data-ad-client="ca-pub-7031631451622714"
            data-ad-slot="6867532774"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    )
}

const AdSenseSideAd = () => {

    const maxWidthToShowAd = 1200
    let windowWidth = window.innerWidth,
        showAd = windowWidth > maxWidthToShowAd

    useEffect(() => {
        if (isWindowPresent()) {
            if (showAd) (window.adsbygoogle = window.adsbygoogle || []).push({});
            const handleShowAd = () => {
                windowWidth = window.innerWidth
                if (windowWidth < maxWidthToShowAd) showAd = false
                if (windowWidth > maxWidthToShowAd) showAd = true
            }

            window.addEventListener("resize", handleShowAd)
        }
        return () => {
            if (isWindowPresent()) {
                window.removeEventListener("resize", handleShowAd)
            }
        }
    }, [])

    if (!envConfig.isProdMode) return null

    if (showAd)
        return (
            <ins className="adsbygoogle"
                style={{ "display": "block" }}
                data-ad-client="ca-pub-7031631451622714"
                data-ad-slot="8349198779"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        )

    return null
}


export default AdMob
export { AdSense_, AdSenseSideAd, LastCommentAd, WhatsNewAds }