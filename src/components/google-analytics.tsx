import Script from "next/script";

const measurementId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID??"G-H01GDSV01X";

export function GoogleAnalytics(){return <><Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="lazyOnload"/><Script id="carspect-google-analytics" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}</Script></>}
