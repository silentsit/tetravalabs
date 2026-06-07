import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import "@/index.css";

const ClientSpa = dynamic(() => import("@/next/ClientSpa"), {
  ssr: false,
});

export default function MyApp(_props: AppProps) {
  return (
    <>
      <Head>
        <title>Tetrava Labs — Research Peptides & Compounds</title>
        <meta
          name="description"
          content="Premium research compounds and peptides with transparent quality standards, secure checkout, and fast fulfillment."
        />
        <meta
          name="keywords"
          content="research peptides, research compounds, tetrava labs, ecommerce"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Tetrava Labs — Research Peptides & Compounds"
        />
        <meta
          property="og:description"
          content="Premium research compounds and peptides with transparent quality standards, secure checkout, and fast fulfillment."
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ClientSpa />
    </>
  );
}
