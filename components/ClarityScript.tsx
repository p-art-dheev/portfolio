import Script from "next/script";

const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Microsoft Clarity: heatmaps, scroll maps and session recordings for the
 * public site. Loaded after the page is idle so it never competes with the
 * first paint. Does nothing until NEXT_PUBLIC_CLARITY_PROJECT_ID is set.
 */
export function ClarityScript() {
  if (!projectId || !/^[a-z0-9]+$/i.test(projectId)) return null;

  return (
    <Script id="microsoft-clarity" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`}
    </Script>
  );
}
