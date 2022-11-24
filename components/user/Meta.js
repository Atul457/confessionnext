import Head from "next/head";
import React from "react";
import { HeaderScripts } from "./Scripts";

const Meta = (props) => {
  const description =
    props?.description ??
    "Confess. Rant. Anonymously. Find Community and make friends";
  const title = props?.title
    ? `${props?.title} - The Talk Place`
    : "The Talk Place";
  const removeDefaultMeta =
    props?.description && props?.title && props?.removeDefaultMeta === true;

  return (
    <Head>
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />

      {/* HTML Meta Tags */}
      <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
      <title>{title}</title>
      <meta
        name="description"
        content="The Talk Place lets you post confessions. Go ahead. Confess anonymously. Rant anonymously. Make friends anonymously. Engage with your preferred community anonymously. We're not afraid of your deepest secret confessions; The Talk Place is a safe space. So, go ahead; you're anonymous!"
      />

      <meta
        name="facebook-domain-verification"
        content="9tgawc2spy2ii3mghquezrn8ex7onj"
      />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content="https://thetalkplace.com/" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      <meta property="og:type" content="website" />
      {!removeDefaultMeta && (
        <>
          <meta property="og:title" content="The Talk Place" />
          <meta property="og:description" content={description} />
        </>
      )}
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
      {!removeDefaultMeta && (
        <>
          <meta name="twitter:title" content="The Talk Place" />
          <meta name="twitter:description" content={description} />
        </>
      )}
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

      <HeaderScripts />

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto&family=Poppins:wght@200;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Kalam&family=Montserrat:wght@400&family=Raleway:wght@700&family=Roboto&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
    </Head>
  );
};

export default Meta;
