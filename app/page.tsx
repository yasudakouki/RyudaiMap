"use client";

import { useEffect } from "react";
import Head from "next/head";
import mapboxgl from "mapbox-gl"; // mapbox-glのインポート

export default function Home() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set");
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // マップを初期化
    const map = new mapboxgl.Map({
      container: "map", // マップを表示するdivのID
      style: "mapbox://styles/mapbox/streets-v11", // マップスタイル
      center: [127.766308,26.249578], // 琉大の中心座標
      zoom: 15.3, // ズームレベル
    });

    console.log(map); // mapオブジェクトの確認

    // コンポーネントがアンマウントされたときにマップを削除
    return () => map.remove();
  }, []);

  return (
    <>
      <Head>
        <title>地図表示</title>
        <meta charSet="utf-8" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div
        id="map"
        style={{
          height: "100vh",
          width: "100%",
        }}
      ></div>
    </>
  );
}
