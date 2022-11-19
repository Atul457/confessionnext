import React from 'react'
import Script from 'next/script'
import { envConfig } from '../../utils/envConfig'

const HeaderScripts = () => {
  return (
    <>
      {/* jQuery Cdn */}
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" />
      {/* Bootstrap scripts Cdn */}
      <Script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" />
    </>
  )
}

const FooterScripts = () => {
  return (
    <>
      {
        envConfig.isProdMode
          ?
          <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7031631451622714"
            crossorigin="anonymous" />
          :
          <Script async
            src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" />
      }
    </>
  )
}

export { HeaderScripts, FooterScripts }