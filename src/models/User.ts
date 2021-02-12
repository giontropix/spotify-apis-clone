import {Playlist} from "./Playlist";

export class User {
    constructor(private id:number, private nickname:string, private playlist:Playlist[] = [],
                private followers:User[] = [],private following:User[] = []){}

    public getId = (): number => this.id
    public getNickname = (): string => this.nickname
    public getPlaylist = (): Playlist[] => this.playlist
    public getFollowers = (): User[] => this.followers
    public getFollowing = (): User[] => this.following

    public setId = (value:number): number => (this.id = value)
    public setNickname = (value:string): string => (this.nickname = value)
    public setPlaylist = (value:Playlist[]): Playlist[] => (this.playlist = value)
    public setFollowers = (value:User[]): User[] => (this.followers = value)
    public setFollowing = (value:User[]): User[] => (this.following = value)

}