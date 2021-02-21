import {Playlist} from "./Playlist";
import {Follower} from "./Follower";

export class User {
    constructor(
        private _id: string,
        private _user_name: string,
        private _mail: string,
        private _sex: string,
        private _playlist: Playlist[] = [],
        private _followers: Follower[] = [],
        private _followed: Follower[] = []
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

    get followers(): Follower[] {
        return this._followers;
    }

    set followers(value: Follower[]) {
        this._followers = value;
    }

    get followed(): Follower[] {
        return this._followed;
    }

    set followed(value: Follower[]) {
        this._followed = value;
    }
}
