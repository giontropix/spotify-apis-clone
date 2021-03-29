import {Playlist} from "./Playlist";
import {Follower} from "./Follower";
import {Played} from "./Played";

export class User {
    constructor(
        private _id: string,
        private _user_name: string,
        private _mail: string,
        private _sex: string,
        private _playlist: Playlist[] = [],
        private _followers: Follower[] = [],
        private _followed: Follower[] = [],
        private _lastTenSongsPlayed: Played[] = new Array(10)
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

    get followers(): Follower[] {
        return this._followers;
    }

    get followed(): Follower[] {
        return this._followed;
    }

    get lastTenSongsPlayed(): Played[] {
        return this._lastTenSongsPlayed;
    }

    set lastTenSongsPlayed(value: Played[]) {
        this._lastTenSongsPlayed = value;
    }
}
