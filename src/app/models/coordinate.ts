export interface Coordinate {
    latitude: number;
    longitude: number;
    speed: number | null;
    altitude: number | null;
    altitudeAccuracy: number| null;
    heading: number | null,
}