import Script from "next/script";

export const SalesIQ = () => {
  return (
    <>
      <Script
        id="zsalesiqscript"
        dangerouslySetInnerHTML={{
          __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`,
        }}
      />
      <Script
        src={`https://salesiq.zohopublic.in/widget?wc=${process.env.NEXT_PUBLIC_SALES_IQ_ID}`}
        defer
        strategy="lazyOnload"
        id="zsiqscript"
      />
    </>
  );
};
