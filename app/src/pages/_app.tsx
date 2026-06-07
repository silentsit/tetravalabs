import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "@/index.css";

const ClientSpa = dynamic(() => import("@/next/ClientSpa"), {
  ssr: false,
});

export default function MyApp(_props: AppProps) {
  return <ClientSpa />;
}
