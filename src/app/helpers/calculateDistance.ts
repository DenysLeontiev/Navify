import { Coordinate } from "../models/coordinate";

export function calculateAverageSpeed(coordinates: Coordinate[]): number {
    const validSpeeds = coordinates
        .map(c => c.speed)
        .filter((s): s is number => s != null && !isNaN(s));

    if (validSpeeds.length === 0) return 0;

    const sum = validSpeeds.reduce((acc, speed) => acc + speed, 0);
    return sum / validSpeeds.length;
}

export function calculateTotalDistanceInMeters(coordinates: Coordinate[]): number {
    let distance: number = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
        distance += calculateDistanceBetweenCoordinatesInMeters(coordinates[i], coordinates[i + 1]);
    }
    return distance;
}

export function calculateDistanceBetweenCoordinatesInMeters(firstCoordinate: Coordinate, secondCoordinate: Coordinate): number {
    var R = 6371000;
    var dLat = deg2rad(firstCoordinate.latitude - secondCoordinate.latitude);
    var dLon = deg2rad(firstCoordinate.longitude - secondCoordinate.longitude);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(firstCoordinate.latitude)) * Math.cos(deg2rad(secondCoordinate.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

export function deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
}