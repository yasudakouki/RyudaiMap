"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import mapboxgl from "mapbox-gl"; // mapbox-glのインポート
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [textareaValue, setTextareaValue] = useState(""); // テキストエリアの状態を管理

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set");
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // マップを初期化
    const map = new mapboxgl.Map({
      container: "map", // マップを表示するdivのID
      style: "mapbox://styles/mapbox/streets-v11", // マップスタイル
      center: [127.766086, 26.249847], // 地図の中心座標（東京駅）
      zoom: 15, // ズームレベル
    });

    console.log(map); // mapオブジェクトの確認

    // コンポーネントがアンマウントされたときにマップを削除
    return () => map.remove();
  }, []);

  // ボタンクリック時のハンドラ
  const handleClick = () => {
    console.log("ボタンが押されました");
    console.log("Textareaの内容:", textareaValue); // テキストエリアの内容を出力
  };

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
          height: "90vh",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Textareaをマップの左上に配置 */}
        <Textarea
          placeholder="講義検索"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)} // 入力を状態に反映
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "200px",
            color: "black",
            backgroundColor: "white",
            zIndex: 1, // マップの上に表示されるようにする
          }}
        />
        <Button
          onClick={handleClick}
          style={{
            position: "absolute",
            top: "10px",
            left: "220px",
            zIndex: 1,
            color: "white",
          }}
        >
          検索
        </Button>
      </div>
    </>
  );
}
