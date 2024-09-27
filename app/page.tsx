"use client";

import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useState } from "react";
import Head from "next/head";
import mapboxgl from "mapbox-gl"; // mapbox-glのインポート
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [textareaValue, setTextareaValue] = useState(""); // テキストエリアの状態を管理
  const [roomInfo, setRoomInfo] = useState(""); // 講義室情報を管理する状態
  const [map, setMap] = useState<mapboxgl.Map | null>(null); // mapboxgl.Map型またはnull型
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null); // マーカーを管理

  // 講義名と教室名、座標を保存するMap変数
  const classInfoMap = new Map([
    ["情報技術演習Ⅰ", { name: "地創棟508", coordinates: [127.76586765027561, 26.253177640375156] }]
  ]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set");
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // マップを初期化
    const initMap = new mapboxgl.Map({
      container: "map", // マップを表示するdivのID
      style: "mapbox://styles/mapbox/streets-v11", // マップスタイル
      center: [127.766308, 26.249578], // 琉大の中心座標
      zoom: 15.3, // ズームレベル
    });

    setMap(initMap); // マップオブジェクトを状態に保存

    // GeoJSONデータを使ってカスタムポイントを追加
    const customPoint: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [127.764780, 26.252861] // 琉大北口の座標
          },
          properties: {
            name: '琉大北口'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [127.76586765027561, 26.253177640375156] // 地域創生総合研究棟の座標
          },
          properties: {
            name: '地域創生総合研究棟'
          }
        }
      ]
    };

    // スタイルが読み込まれたときにカスタムレイヤーを追加
    initMap.on('style.load', () => {
      // カスタムポイントのソースを追加
      initMap.addSource('custom-point', {
        type: 'geojson',
        data: customPoint
      });

      // ラベルを追加するレイヤー
      initMap.addLayer({
        id: 'custom-point-layer',
        type: 'symbol',
        source: 'custom-point',
        layout: {
          'text-field': ['get', 'name'], // propertiesからラベルのテキストを取得
          'text-size': 16, // テキストサイズ
          'text-offset': [0, 1.25], // テキスト位置のオフセット
          'text-anchor': 'top' // テキストのアンカー位置
        },
        paint: {
          'text-color': '#000000' // テキストの色を指定
        }
      });
    });

    // コンポーネントがアンマウントされたときにマップを削除
    return () => initMap.remove();
  }, []);

  // ボタンクリック時のハンドラ
  const handleClick = () => {
    const room = classInfoMap.get(textareaValue);
    if (room) {
      setRoomInfo(`${room.name}が講義室です。`); // 講義室情報を更新

      // 既存のマーカーを削除
      if (marker) {
        marker.remove();
      }

      // 新しいマーカーを作成して追加
      const newMarker = new mapboxgl.Marker()
        .setLngLat(room.coordinates as [number, number]) // 座標を設定
        .addTo(map!); // マップに追加

      setMarker(newMarker); // 新しいマーカーを状態に保存

      // マップの中心をマーカーの位置に移動
      map!.flyTo({ center: room.coordinates as [number, number], zoom: 16 });
    } else {
      setRoomInfo("講義室が見つかりませんでした。"); // 講義室が見つからなかった場合のメッセージ
    }
  };

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
          onChange={(e) => setTextareaValue(e.target.value)}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "200px",
            color: "black",
            backgroundColor: "white",
            zIndex: 1,
            resize: "none", // サイズ変更を無効化
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

        {/* 講義室情報を表示するための要素 */}
        {roomInfo && ( // roomInfoが空でない場合のみ表示
          <div
            style={{
              position: "absolute",
              top: "60px", // Textareaの下に配置
              left: "10px",
              zIndex: 1,
              color: "black",
              backgroundColor: "white", // 背景を白にする
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // 影を追加
            }}
          >
            {roomInfo} {/* 講義室情報を表示 */}
          </div>
        )}
      </div>
      <div>
        琉大マップだよー!
      </div>
    </>
  );
}
