import {Playlist} from "./Playlist";

export class User {
    constructor(
        private user_name: string,
        private password: string,
        private playlist: Playlist[] = [],
        private followers: User[] = [],
        private following: User[] = []) {}

    public getUser_name = (): string => this.user_name
    public getPassword = (): string => this.password
    public getPlaylist = (): Playlist[] => this.playlist
    public getFollowers = (): User[] => this.followers
    public getFollowing = (): User[] => this.following

    public setUser_name = (value: string): string => (this.user_name = value)
    public setPassword = (value: string): string => (this.password = value)
    public setPlaylist = (value: Playlist[]): Playlist[] => (this.playlist = value)
    public setFollowers = (value: User[]): User[] => (this.followers = value)
    public setFollowing = (value: User[]): User[] => (this.following = value)

}
