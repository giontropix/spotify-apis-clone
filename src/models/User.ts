import {Playlist} from "./Playlist";

export class User {
    constructor(
        private _id: string,
        private _user_name: string,
        private _mail: string,
        private _playlist: Playlist[] = [],
        private _followers: User[] = [],
        private _following: User[] = []
    ) {
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get user_name(): string {
        return this._user_name;
    }

    set user_name(value: string) {
        this._user_name = value;
    }

    get mail(): string {
        return this._mail;
    }

    set mail(value: string) {
        this._mail = value;
    }

    get playlist(): Playlist[] {
        return this._playlist;
    }

    set playlist(value: Playlist[]) {
        this._playlist = value;
    }

    get followers(): User[] {
        return this._followers;
    }

    set followers(value: User[]) {
        this._followers = value;
    }

    get following(): User[] {
        return this._following;
    }

    set following(value: User[]) {
        this._following = value;
    }
}
