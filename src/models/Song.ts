export class Song {
    constructor(private _id: string,
                private _title: string,
                private _views: number,
                private _ranking: number,
                private _votes: any[] = [],
                private _length: number,
                private _artist: string,
                private _genre: string,
                private _album?: string
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

    get views(): number {
        return this._views;
    }

    set views(value: number) {
        this._views = value;
    }

    get ranking(): number {
        return this._ranking;
    }

    set ranking(value: number) {
        this._ranking = value;
    }

    get votes(): any[] {
        return this._votes;
    }

    set votes(value: any[]) {
        this._votes = value;
    }

    get length(): number {
        return this._length;
    }

    set length(value: number) {
        this._length = value;
    }

    get artist(): string {
        return this._artist;
    }

    set artist(value: string) {
        this._artist = value;
    }

    get genre(): string {
        return this._genre;
    }

    set genre(value: string) {
        this._genre = value;
    }

    get album(): string | undefined {
        return this._album;
    }

    set album(value: string | undefined) {
        this._album = value;
    }
}
