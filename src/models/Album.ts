export class Album {
    constructor(private id:number, private title:string, private year:number, private genre:string){}

    public getId = (): number => this.id;
    public getTitle = (): string => this.title;
    public getYear = (): number => this.year;
    public getGenre = (): string => this.genre;

    public setId = (value:number): number => (this.id = value)
    public setTitle = (value:string): string => (this.title = value)
    public setYear = (value:number): number => (this.year = value)
    public setGenre = (value:string): string => (this.genre = value)
}