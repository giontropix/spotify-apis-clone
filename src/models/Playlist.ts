import {Song} from "./Song";
import {User} from "./User";

export class Playlist {
    constructor(private id:number, private title:string, private songs:Song[] = [], private length:number,private owner:User){}

    public getId = (): number => this.id
    public getTitle = (): string => this.title
    public getSongs = (): Song[] => this.songs
    public getLength = (): number => this.length
    public getOwner = (): User => this.owner

    public setId = (value:number): number => (this.id = value)
    public setTitle = (value:string): string => (this.title = value)
    public setSongs = (value:Song[]): Song[] => (this.songs = value)
    public setLength = (value:number): number => (this.length = value)
    public setOwner = (value:User): User => (this.owner = value)


}