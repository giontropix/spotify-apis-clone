export class Song {
    constructor(public id: number,
                public title: string,
                public views: number,
                public ranking: number,
                public votes: any[] = [],
                public length: number,
                public artist: string,
                public genre: string,
                public album?: string
    ){}

    public getId = (): number => this.id
    public getTitle = (): string => this.title
    public getViews = (): number => this.views
    public getLength = (): number => this.length
    public getGenre = (): string => this.genre
    public getArtist = (): string => this.artist
    //? mi da errore perché potrebbe essere undefined public getAlbum = (): Album => this.album

    public setId = (): number => this.id
    public setTitle = (value:string): string => (this.title = value)
    public setViews = (value:number): number => (this.views = value)
    public setLength = (value:number): number => (this.length = value)
    public setGenre = (value:string): string => (this.genre = value)
    public setArtist = (value:string): string => (this.artist = value)
    public setAlbum = (value:string): string => (this.album = value)

}