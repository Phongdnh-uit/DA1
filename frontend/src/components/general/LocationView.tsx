import React, { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent } from "../ui/card";
import type { PropertyResponse } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { formatCurrency } from "@/utils/converter";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export interface LocationItem {
    id?: string | number;
    latitude: number;
    longitude: number;
    data?: PropertyResponse;
}

interface LocationViewProps {
    locations: LocationItem[];
    height?: string;
    className?: string;
    onRegionChange?: (params: {
        latitude: number;
        longitude: number;
        radiusInMeters: number;
    }) => void;
    isLoading?: boolean;
}

const LocationView: React.FC<LocationViewProps> = ({
    locations,
    height = "400px",
    className = "",
    onRegionChange,
    isLoading = false,
}) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    const [showSearchButton, setShowSearchButton] = useState<boolean>(
        onRegionChange ? true : false,
    );

    const handleSearchArea = useCallback(() => {
        if (!mapRef.current || !onRegionChange) return;

        const center = mapRef.current.getCenter();
        const bounds = mapRef.current.getBounds();
        const northEast = bounds.getNorthEast();

        const radiusInMeters = center.distanceTo(northEast);

        onRegionChange({
            latitude: center.lat,
            longitude: center.lng,
            radiusInMeters: Math.round(radiusInMeters),
        });

        setShowSearchButton(false);
    }, [onRegionChange]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [106.8019, 10.8712],
            zoom: 10,
            interactive: true,
        });

        mapRef.current.on("moveend", () => {
            if (onRegionChange) {
                setShowSearchButton(true);
            }
        });

        return () => {
            mapRef.current?.remove();
        };
    }, [onRegionChange]);

    useEffect(() => {
        if (!mapRef.current || locations.length === 0) return;

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const bounds = new mapboxgl.LngLatBounds();

        locations.forEach((loc) => {
            if (!loc.longitude || !loc.latitude) return;

            if (loc.data) {
                const thumbnail = loc.data.thumbnail?.url || "/no-image.jpg";
                const price = formatCurrency(loc.data.price as number);

                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<div 
        class="p-2 max-w-[200px] cursor-pointer" 
        onclick="window.location.href='/detail/${loc.data.id}'"
    >
        <img 
            src="${thumbnail}" 
            alt="Hình ảnh" 
            class="w-full h-28 object-cover rounded-lg mb-2"
        />

        <h3 class="font-bold text-sm text-gray-900 mb-1 line-clamp-2">
            ${loc.data.title || "Không có tiêu đề"}
        </h3>

        ${price
                        ? `<p class="text-sm font-semibold text-blue-600 mb-1">${price}</p>`
                        : ""
                    }
    </div>`,
                );

                const marker = new mapboxgl.Marker({ color: "#ef4444" })
                    .setLngLat([loc.longitude, loc.latitude])
                    .setPopup(popup)
                    .addTo(mapRef.current!);

                markersRef.current.push(marker);
            } else {
                const marker = new mapboxgl.Marker({ color: "#ef4444" })
                    .setLngLat([loc.longitude, loc.latitude])
                    .addTo(mapRef.current!);

                markersRef.current.push(marker);
            }

            bounds.extend([loc.longitude, loc.latitude]);
        });

        if (!bounds.isEmpty()) {
            mapRef.current.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                maxZoom: 15,
                duration: 1000,
            });
        }
    }, [locations]);

    return (
        <Card className={cn("w-full shadow-lg", className)}>
            <CardContent className="space-y-4 relative">
                {showSearchButton && !isLoading && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Button
                            onClick={handleSearchArea}
                            className="bg-white text-foreground hover:bg-gray-100 shadow-xl rounded-full px-6 py-2 border animate-in fade-in zoom-in duration-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Tìm khu vực này
                        </Button>
                    </div>
                )}
                <div className="relative">
                    <div
                        ref={mapContainerRef}
                        className="w-full overflow-hidden"
                        style={{ height: height }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default LocationView;
