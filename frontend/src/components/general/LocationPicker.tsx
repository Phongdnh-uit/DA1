import React, { useRef, useEffect, useCallback, useState } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { MapPinIcon } from "lucide-react";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface Coordinates {
    longitude: number;
    latitude: number;
}

interface LocationPickerProps {
    initialLocation?: Coordinates | null;
    onChange?: (coords: Coordinates) => void;
    showGeocoder?: boolean;
    interactive?: boolean;
    height?: string;
    borderRadius?: string;
}

const DEFAULT_CENTER: [number, number] = [106.8019, 10.8712]; // UIT

export const LocationPicker: React.FC<LocationPickerProps> = ({
    initialLocation,
    onChange,
    showGeocoder = true,
    interactive = true,
    height = "400px",
    borderRadius = "0.5rem",
}) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const geocoderContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);

    const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(
        initialLocation || null,
    );

    const onDragEnd = useCallback(() => {
        if (markerRef.current) {
            const { lng, lat } = markerRef.current.getLngLat();
            const newCoords = { longitude: lng, latitude: lat };
            setCurrentCoords(newCoords);
            onChange?.(newCoords);
        }
    }, [onChange]);

    const updateMarkerPosition = useCallback(
        (lng: number, lat: number) => {
            if (!mapRef.current) return;

            const newCoords = { longitude: lng, latitude: lat };
            setCurrentCoords(newCoords);

            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new mapboxgl.Marker({
                    color: "#e30000",
                    draggable: interactive,
                })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);

                if (interactive) {
                    markerRef.current.on("dragend", onDragEnd);
                }
            }
        },
        [interactive, onDragEnd],
    );

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center: DEFAULT_CENTER,
            zoom: 15,
            interactive: interactive,
        });

        mapRef.current.on("click", (e) => {
            if (!interactive) return;
            const { lng, lat } = e.lngLat;
            updateMarkerPosition(lng, lat);
            onChange?.({ longitude: lng, latitude: lat });
        });

        if (showGeocoder) {
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl,
                marker: false,
                placeholder: "Tìm kiếm vị trí...",
                autocomplete: true,
                language: "vi",
                zoom: 17,
            });

            if (geocoderContainerRef.current) {
                geocoderContainerRef.current.innerHTML = "";
                geocoderContainerRef.current.appendChild(
                    geocoder.onAdd(mapRef.current),
                );
            }

            geocoder.on("result", (e) => {
                const [lng, lat] = e.result.center;
                updateMarkerPosition(lng, lat);
                onChange?.({ longitude: lng, latitude: lat });
                mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
            });
        }

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [interactive, showGeocoder, onChange, updateMarkerPosition]);

    useEffect(() => {
        if (!mapRef.current || !initialLocation) return;
        const { longitude, latitude } = initialLocation;

        if (
            longitude !== currentCoords?.longitude ||
            latitude !== currentCoords?.latitude
        ) {
            mapRef.current.flyTo({
                center: [longitude, latitude],
                zoom: 15,
                essential: true,
            });
            updateMarkerPosition(longitude, latitude);
        }
    }, [initialLocation, updateMarkerPosition, currentCoords]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const observer = new ResizeObserver(() => {
            mapRef.current?.resize();
        });

        observer.observe(mapContainerRef.current);

        return () => {
            observer.disconnect();
        };
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
                    {" "}
                    {showGeocoder && (
                        <div
                            ref={geocoderContainerRef}
                            className="absolute top-3 right-3 z-10 w-full max-w-xs"
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
                    <div className="p-3 bg-muted border rounded-md w-full">
                        <h3 className="font-semibold text-foreground text-sm mb-1">
                            Tọa độ đã chọn
                        </h3>
                        <pre className="text-xs text-muted-foreground">
                            {`Long: ${currentCoords.longitude.toFixed(6)}, Lat: ${currentCoords.latitude.toFixed(6)}`}
                        </pre>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default LocationPicker;
