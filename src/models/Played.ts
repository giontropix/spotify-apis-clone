export class Played {
    constructor(
        private _id: string,
        private _genre: string
    ) {}

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get genre(): string {
        return this._genre;
    }

    set genre(value: string) {
        this._genre = value;
    }
}
