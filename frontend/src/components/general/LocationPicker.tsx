import React, { useRef, useEffect, useCallback, useState } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { MapPinIcon, TrashIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../ui/button";

const MotionButton = motion(Button);

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface Coordinates {
    longitude: number;
    latitude: number;
}

interface LocationPickerProps {
    initialLocation?: Coordinates | null;
    onChange?: (coords: Coordinates | null) => void;
    showGeocoder?: boolean;
    isMarkerEditable?: boolean;
    interactive?: boolean;
    height?: string;
    borderRadius?: string;
}

const DEFAULT_CENTER: [number, number] = [106.8019, 10.8712]; // UIT

export const LocationPicker: React.FC<LocationPickerProps> = ({
    initialLocation,
    onChange,
    showGeocoder = true,
    isMarkerEditable = true,
    interactive = true,
    height = "400px",
    borderRadius = "0.5rem",
}) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const geocoderContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);

    // Dùng Ref để lưu onChange tránh re-render map khi hàm này thay đổi ở cha
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(
        initialLocation || null,
    );

    // Hàm cập nhật vị trí Marker (không khởi tạo lại map)
    const updateMarker = useCallback(
        (lng: number, lat: number) => {
            if (!mapRef.current) return;

            setCurrentCoords({ longitude: lng, latitude: lat });

            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new mapboxgl.Marker({
                    color: "#e30000",
                    draggable: interactive && isMarkerEditable,
                })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);

                // Gán sự kiện kéo thả cho marker mới tạo
                markerRef.current.on("dragend", () => {
                    const { lng: newLng, lat: newLat } = markerRef.current!.getLngLat();
                    const coords = { longitude: newLng, latitude: newLat };
                    setCurrentCoords(coords);
                    onChangeRef.current?.(coords);
                });
            }
        },
        [interactive, isMarkerEditable],
    );

    // 1. KHỞI TẠO BẢN ĐỒ (CHỈ CHẠY 1 LẦN)
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center: initialLocation
                ? [initialLocation.longitude, initialLocation.latitude]
                : DEFAULT_CENTER,
            zoom: 15,
            interactive: interactive,
        });

        mapRef.current = map;

        map.on("load", () => {
            if (initialLocation) {
                updateMarker(initialLocation.longitude, initialLocation.latitude);
            }
        });

        map.on("click", (e) => {
            if (!(interactive && isMarkerEditable)) return;
            const { lng, lat } = e.lngLat;
            updateMarker(lng, lat);
            onChangeRef.current?.({ longitude: lng, latitude: lat });
        });

        if (showGeocoder) {
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl,
                marker: false,
                placeholder: "Tìm kiếm vị trí...",
                language: "vi",
                zoom: 17,
            });

            if (geocoderContainerRef.current) {
                geocoderContainerRef.current.innerHTML = "";
                geocoderContainerRef.current.appendChild(geocoder.onAdd(map));
            }

            geocoder.on("result", (e) => {
                const [lng, lat] = e.result.center;
                updateMarker(lng, lat);
                onChangeRef.current?.({ longitude: lng, latitude: lat });
            });
        }

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
        // Mảng phụ thuộc rỗng để không bao giờ khởi tạo lại map
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. ĐỒNG BỘ TỪ BÊN NGOÀI (Khi initialLocation thay đổi, vd: Reset Form)
    useEffect(() => {
        if (initialLocation && mapRef.current) {
            const { longitude, latitude } = initialLocation;
            // Chỉ cập nhật nếu tọa độ thực sự khác với state hiện tại
            if (
                longitude !== currentCoords?.longitude ||
                latitude !== currentCoords?.latitude
            ) {
                updateMarker(longitude, latitude);
                mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLocation?.longitude, initialLocation?.latitude]);

    // 3. XỬ LÝ RESIZE
    useEffect(() => {
        if (!mapContainerRef.current) return;
        const observer = new ResizeObserver(() => mapRef.current?.resize());
        observer.observe(mapContainerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleClearLocation = useCallback(() => {
        setCurrentCoords(null);
        markerRef.current?.remove();
        markerRef.current = null;
        onChangeRef.current?.(null);
    }, []);

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <h1 className="text-2xl font-bold text-foreground">Chọn vị trí</h1>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <MapPinIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                        Chọn vị trí bằng cách nhấp vào bản đồ, kéo thả ghim, hoặc sử dụng
                        thanh tìm kiếm.
                    </p>
                </div>

                <div className="relative">
                    {showGeocoder && (
                        <div
                            ref={geocoderContainerRef}
                            className="absolute top-3 right-0 z-10 w-full max-w-xs"
                        />
                    )}
                    <div
                        ref={mapContainerRef}
                        className="w-full overflow-hidden"
                        style={{ height: height, borderRadius: borderRadius }}
                    />
                </div>
            </CardContent>

            {currentCoords && (
                <CardFooter>
                    <div className="p-3 bg-muted border rounded-md w-full flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground text-sm mb-1">
                                Tọa độ đã chọn
                            </h3>
                            <pre className="text-xs text-muted-foreground">
                                {`Long: ${currentCoords.longitude.toFixed(6)}, Lat: ${currentCoords.latitude.toFixed(6)}`}
                            </pre>
                        </div>
                        {interactive && (
                            <MotionButton
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="transition-none"
                                onClick={handleClearLocation}
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Xóa vị trí
                            </MotionButton>
                        )}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default LocationPicker;
