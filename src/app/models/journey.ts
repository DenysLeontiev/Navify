export class Journey {
    id: string;
    startTime: Date;
    endTime: Date;
    distance: number;
    maxSpeed: number;
    averageSpeed: number;
    startLocation?: string;
    endLocation?: string;

    constructor(id: string, startTime: Date, endTime: Date, distance: number, maxSpeed: number, averageSpeed: number) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.distance = distance;
        this.maxSpeed = maxSpeed
        this.averageSpeed = averageSpeed;
    }

    get calculateDuration() {
        let diffMs = this.endTime.getTime() - this.startTime.getTime();

        if (diffMs < 0) diffMs = 0; // avoid negative durations

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        return `${hours}:${minutes}:${seconds}`;
    }
}