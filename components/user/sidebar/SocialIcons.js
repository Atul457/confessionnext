import Image from 'next/image'
import React from 'react'

const SocialIcons = () => {
    return (
        <>
            {/* SOCIAL LINKS PANEL */}
            <div className="leftSidebarFooter">
                <div className='categoryHead pb-1'>
                    Follow us on
                </div>
                <div className='socialLinksIconWrapperFeed'>
                    <ul>
                        <li pulsate='07-07-22,pulsatingIcon social'>
                            <a
                                target="blank"
                                href="https://www.facebook.com/TheTalkPlaceOfficial">
                                <Image
                                    src="/images/fbSocial.svg" alt="fbSocialIcon"
                                    fill={true} />
                            </a>
                        </li>
                        <li pulsate='07-07-22,pulsatingIcon social'>
                            <a target="blank" href="http://twitter.com/the_talkplace">
                                <Image
                                    src="/images/TwitterSocial.svg" alt="TwitterSocialIcon"
                                    fill={true} />
                            </a>
                        </li>
                        <li pulsate='07-07-22,pulsatingIcon social'>
                            <a target="blank" href="https://www.instagram.com/the_talkplace_official/">
                                <Image
                                    src="/images/instaSocial.svg" alt="instaSocialIcon"
                                    fill={true} />
                            </a>
                        </li>
                        <li pulsate='07-07-22,pulsatingIcon social'>
                            <a target="blank" href="http://TikTok.com/@the_talkplace">
                                <Image
                                    src="/images/tiktokSocial.svg" alt="tiktokSocialIcon"
                                    fill={true} />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* SOCIAL LINKS PANEL */}
        </>
    )
}

export default SocialIcons