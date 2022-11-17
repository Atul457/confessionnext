import Head from 'next/head'
import React from 'react'

const Meta = () => {
    return (
        <Head>
            <meta charset="utf-8" />
            <link rel="icon" href="/favicon.ico" />

            {/* HTML Meta Tags */}
            <title>The Talk Place</title>
            <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
            <meta name="description" content="The Talk Place lets you post confessions. Go ahead. Confess anonymously. Rant anonymously. Make friends anonymously. Engage with your preferred community anonymously. We're not afraid of your deepest secret confessions; The Talk Place is a safe space. So, go ahead; you're anonymous!" />
            <meta
                name="facebook-domain-verification"
                content="9tgawc2spy2ii3mghquezrn8ex7onj"
            />

            {/* Facebook Meta Tags */}
            <meta property="og:url" content="https://thetalkplace.com/" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="627" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="The Talk Place" />
            <meta property="og:description" content="Confess. Rant. Anonymously. Find Community and make friends" />
            <meta
                property="og:image"
                content="https://thetalkplace.com/applogo12.jpg"
            />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="thetalkplace.com" />
            <meta property="twitter:url" content="https://thetalkplace.com/" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="627" />
            <meta name="twitter:title" content="The Talk Place" />
            <meta name="twitter:description" content="Confess. Rant. Anonymously. Find Community and make friends" />
            <meta
                name="twitter:image"
                content="https://thetalkplace.com/applogo12.jpg"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
            />
            <meta name="theme-color" content="#000000" />
            <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        </Head>
    )
}

export default Meta