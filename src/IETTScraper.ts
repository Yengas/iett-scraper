import { load } from 'cheerio';
import fetch from 'node-fetch';
import RouteListingParser, { RouteListingItem } from './RouteListingParser';

export interface IETTScraperOptions {
    host?: string,
    scheme?: "https" | "http",
    headers?: { [index: string]: string },
}

const defaultOptions: IETTScraperOptions = {
    host: "www.iett.istanbul",
    scheme: "http",
    headers: {
        "Referer": "https://www.google.com",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            + "(KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
    }
};

export class IETTScraper {
    constructor(
        private readonly options: IETTScraperOptions = {}
    ){
        this.options = Object.assign({}, defaultOptions, options);

    }

    private async getDocument(url: string): Promise<CheerioStatic> {
        const response = await fetch(url, {
            method: 'GET',
            headers: this.options.headers,
        });

        return load(await response.text());
    }

    private buildURL(path: string){
        const { host, scheme } = this.options;
        return `${scheme}://${host}${path}`;
    }

    async getRoutes(): Promise<Array<RouteListingItem>> {
        const $ = await this.getDocument(
            this.buildURL('/tr/main/hatlar')
        );

        return RouteListingParser($);
    }
}

export default IETTScraper;
