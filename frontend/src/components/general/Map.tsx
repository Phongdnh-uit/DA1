import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESSTOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

mapboxgl.accessToken = MAPBOX_ACCESSTOKEN;

const Mapbox = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center: [-74.5, 40],
            zoom: 9,
        });
        return () => {
            if (mapRef.current) mapRef.current.remove();
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            className="map-container"
            style={{ width: "100%", height: "400px" }}
        />
    );
};

export default Mapbox;
