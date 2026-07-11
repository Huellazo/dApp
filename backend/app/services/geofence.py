from shapely.geometry import Point
from shapely.ops import transform
import pyproj

def validate_geofence(
    user_lat: float,
    user_lon: float,
    merchant_lat: float,
    merchant_lon: float,
    radius_meters: int,
) -> bool:
    aeqd = pyproj.Proj(
        proj="aeqd",
        ellps="WGS84",
        datum="WGS84",
        lat_0=merchant_lat,
        lon_0=merchant_lon,
    )
    wgs84 = pyproj.Proj(proj="latlong", ellps="WGS84")

    project = pyproj.Transformer.from_proj(wgs84, aeqd, always_xy=True).transform
    user_point = transform(project, Point(user_lon, user_lat))
    merchant_point = transform(project, Point(merchant_lon, merchant_lat))

    distance_meters = user_point.distance(merchant_point)
    return distance_meters <= radius_meters

def compute_distance_meters(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    geod = pyproj.Geod(ellps="WGS84")
    _, _, distance = geod.inv(lon1, lat1, lon2, lat2)
    return abs(distance)
