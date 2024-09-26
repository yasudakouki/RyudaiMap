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
      center: [127.766308, 26.249578], // 琉大の中心座標
      zoom: 15.3, // ズームレベル
    });

    // GeoJSONデータを使ってカスタムポイントを追加
    const customPoint: GeoJSON.FeatureCollection = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [127.764780, 26.252861] // 琉大北口の座標
          },
          'properties': {
            'name': '琉大北口'
          }
        }
      ]
    };
    
    // スタイルが読み込まれたときにカスタムレイヤーを追加
    map.on('style.load', () => {
      // カスタムポイントのソースを追加
      map.addSource('custom-point', {
        'type': 'geojson',
        'data': customPoint
      });

      // ラベルを追加するレイヤー
      map.addLayer({
        'id': 'custom-point-layer',
        'type': 'symbol',
        'source': 'custom-point',
        'layout': {
          'text-field': ['get', 'name'], // propertiesからラベルのテキストを取得
          'text-size': 16, // テキストサイズ
          'text-offset': [0, 1.25], // テキスト位置のオフセット
          'text-anchor': 'top' // テキストのアンカー位置
        },
        'paint': {
          'text-color': '#000000' // テキストの色を指定
        }
      });
    });

    console.log(map); // mapオブジェクトの確認

    // コンポーネントがアンマウントされたときにマップを削除
    return () => map.remove();
  }, []);

  return (
    <>
      <Head>
        <title>琉大マップ - 地図表示</title>
        <meta charSet="utf-8" />
        <meta name="description" content="琉大マップのブラウザ版です。" />
        <meta name="keywords" content="琉大, マップ, Mapbox, 地図, 琉球大学" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div>
        琉大マップだよー!
      </div>

      <div
        id="map"
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
      </div>
    </>
  );
}
