import {Song} from "./Song";

export class Playlist {
    constructor(private _id: string,
                private _title: string,
                private _songs: Song[] = [],
    ) {
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get songs(): Song[] {
        return this._songs;
    }
}
