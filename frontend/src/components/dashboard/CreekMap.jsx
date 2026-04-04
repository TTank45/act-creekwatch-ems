import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function CreekMap({ sites }) {
  const canberraCenter = [-35.2809, 149.13];

  return (
    <div className="map-wrapper">
      <MapContainer
        center={canberraCenter}
        zoom={11}
        scrollWheelZoom={false}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sites.map((site) => (
          <Marker key={site.id} position={[site.lat, site.lng]}>
            <Popup>
              <strong>{site.name}</strong>
              <br />
              Status: {site.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CreekMap;