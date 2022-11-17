import React, { useEffect } from 'react';
import { isWindowPresent } from '../../../utils/checkDom';


export default function AdMob({ mainContId }) {

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


export const WhatsNewAds = ({ mainContId }) => {

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

export const LastCommentAd = ({ mainContId }) => {

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