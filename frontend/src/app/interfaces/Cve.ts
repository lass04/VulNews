import { Epss } from './Epss';
export interface Cve {
    id:string,
    summary:string,
    published:string,
    lastModified:string,
    cvss:number|null
    epss?:Epss;
}