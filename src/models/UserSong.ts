export class UserSong {
    constructor(private _id: string, private _views: number ) {
    }
    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get views(): number {
        return this._views;
    }

    set views(value: number) {
        this._views = value;
    }
}
