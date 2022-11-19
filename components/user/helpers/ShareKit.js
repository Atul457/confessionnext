import React from 'react';
import { FaTwitter, FaFacebookF, FaEnvelope, FaLinkedinIn } from 'react-icons/fa';
import { ShareButtonRoundSquare, ShareBlockStandard } from 'react-custom-share';

// Utils
import { copyTextToClipboard } from '../../../utils/helpers';
import { forum_types } from '../../../utils/provider';

const ShareKit = (props) => {

    var data, origin, isForum, url, longtext, htmltoEmbed;

    data = { ...props?.postData, ...(props?.postData?.is_forum === 1 ? {} : { is_forum: 0 }) };
    origin = window.location.origin;
    isForum = data?.is_forum === 1
    url = `${origin}/${isForum ? `shareforum/${data?.slug}` : `shareconfession/${data?.confession_id}`}`

    if (!isForum)
        longtext = `${data?.description?.substr(0, 500)}${(data?.description)?.length > 500 ? "..." : ""}`
    else {
        htmltoEmbed = ""
        if (data?.type === forum_types.private) {
            htmltoEmbed = `\npassword: ${data?.password ?? ""}`
        }
        longtext = `${data?.title}\n\n${data?.description?.substr(0, 500)}${(data?.description)?.length > 500 ? "..." : ""}${htmltoEmbed}`
    }

    // CREATE OBJECT WITH PROPS FOR SHAREBLOCK
    const shareBlockProps = {
        url,
        button: ShareButtonRoundSquare,
        buttons: [
            { network: 'Twitter', icon: FaTwitter },
            { network: 'Facebook', icon: FaFacebookF },
            { network: 'Email', icon: FaEnvelope },
            { network: 'Linkedin', icon: FaLinkedinIn },
        ],
        text: `Check out this anonymous post! - www.thetalkplace.com`,
        longtext
    };

    const copylink = () => {
        const linkToCopy = `${origin}/${isForum ? `forums/${data?.slug}` : `confession/${data?.confession_id}`}`
        copyTextToClipboard(linkToCopy)
    }

    return (
        <div className="shareKitButtonsMainCont parent">
            <ShareBlockStandard {...shareBlockProps} className="shareKitButtonsMainCont" />
            <span className='copyLinkBtn' onClick={copylink}>
                <i className="fa fa-files-o" aria-hidden="true"></i>
            </span>
        </div>
    )
}

export default ShareKit;