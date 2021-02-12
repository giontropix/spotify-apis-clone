import {Artist} from './Artist'
import {Album} from "./Album";

export class Song {
    constructor(private id: number, private title: string, private views: number,
                private length: number, private artist: Artist, private genre:string, private album?: Album){}

    public getId = (): number => this.id
    public getTitle = (): string => this.title
    public getViews = (): number => this.views
    public getLength = (): number => this.length
    public getGenre = (): string => this.genre
    public getArtist = (): Artist => this.artist
    //? mi da errore perché potrebbe essere undefined public getAlbum = (): Album => this.album

    public setId = (): number => this.id
    public setTitle = (value:string): string => (this.title = value)
    public setViews = (value:number): number => (this.views = value)
    public setLength = (value:number): number => (this.length = value)
    public setGenre = (value:string): string => (this.genre = value)
    public setArtist = (value:Artist): Artist => (this.artist = value)
    public setAlbum = (value:Album): Album => (this.album = value)

}