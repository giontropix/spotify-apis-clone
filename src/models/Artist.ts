import {Song} from "./Song";
import {Album} from "./Album";
import {User} from "./User";

export class Artist {
    constructor(private id: number,
                private name: string,
                private views: number,
                private followers: User[] = [],
                private songs: Song[] = [],
                private discography: Album[] = []
    ){}

    public getId = (): number => this.id
    public getName = (): string => this.name
    public getViews = (): number => this.views
    public getSongs = (): Song[] => this.songs
    public getFollowers = (): User[] => this.followers
    public getDiscography = (): Album[] => this.discography

    public setId = (value:number): number => (this.id = value)
    public setName = (value:string): string => (this.name = value)
    public setViews = (value:number): number => (this.views = value)
    public setSongs = (value:Song[]): Song[] => (this.songs = value)
    public setFollowers = (value:User[]): User[] => (this.followers = value)
    public setDiscography = (value:Album[]): Album[] => (this.discography = value)

}