import React, { useEffect, useRef, useState } from "react";

function Map() {
	const kakaoMap = useRef<HTMLElement | null>(null);
	const [keyword, setKeyword] = useState("");

	useEffect(() => {
		const $script = document.createElement("script");
		$script.async = true;
		$script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&autoload=false&libraries=services,clusterer,drawing`;
		document.head.appendChild($script);

		const onLoadKakaoMap = () => {
			window.kakao.maps.load(() => {
				//  지도 생성
				const container = document.getElementById("map");
				const options = {
					center: new window.kakao.maps.LatLng(37.3595316, 127.1052133),
					level: 5,
				};
				kakaoMap.current = new window.kakao.maps.Map(container, options);

				//  줌 옵션 설정
				const zoomControl = new window.kakao.maps.ZoomControl();
				kakaoMap.current.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

				// 임시 데터
				const data = [
					{ y: 37.3595316, x: 127.1052133, content: "네이버" },
					{ y: 37.359531, x: 127.1052133, content: "다음" },
					{ y: 37.5559, x: 126.9723, content: "네이버" },
					{ y: 37.5663, x: 126.9779, content: "네이버" },
					{ y: 37.5465, x: 126.9647, content: "네이버" },
				];
				const clusterer = new window.kakao.maps.MarkerClusterer({
					map: kakaoMap.current, // 마커들을 클러스터로 관리하고 표시할 지도 객체
					averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
					minLevel: 0, // 클러스터 할 최소 지도 레벨
					styles: [
						{
							background: "rgba(255, 80, 80, .8)",
							width: "60px",
							height: "60px",
							color: "#fff",
							borderRadius: "30px",
							textAlign: "center",
							lineHeight: "61px",
						},
					],
				});
				clusterer.setMinClusterSize(0);
				const markers = data.map(
					(item) =>
						new window.kakao.maps.Marker({
							position: new window.kakao.maps.LatLng(item.y, item.x),
						}),
				);

				clusterer.addMarkers(markers);
			});
		};
		$script.addEventListener("load", onLoadKakaoMap);

		return () => $script.removeEventListener("load", onLoadKakaoMap);
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const geocoder = new window.kakao.maps.services.Geocoder();
		const places = new window.kakao.maps.services.Places();
		const searchAddress = (result, status) => {
			if (result.length === 0) return;
			if (status === window.kakao.maps.services.Status.OK) {
				const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

				kakaoMap.current.setCenter(coords);
			}
		};

		geocoder.addressSearch(keyword, searchAddress);
		places.keywordSearch(keyword, searchAddress);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				검색
				<input type="text" value={keyword} onChange={handleChange} />
			</form>
			<div
				id="map"
				style={{
					width: "70%",
					height: "700px",
				}}
			></div>
		</>
	);
}

export default Map;
