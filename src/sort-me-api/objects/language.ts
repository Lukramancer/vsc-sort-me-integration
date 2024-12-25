export default class Language {
    static readonly EXTENSIONS_SEPARATOR = ':';


    constructor (
        public readonly name: string,
        public readonly api: string,
        public readonly extensions: Array<string>
    ) { }

    static get_extensions(extensions_list_string: string): Array<string> {
        return extensions_list_string.split(this.EXTENSIONS_SEPARATOR);
    }

    static from_object(object: any): Language | undefined {
        const name = object["name"];
        if (typeof name != "string") return undefined;

        const extensions_list_string = object["ext"];
        if (typeof extensions_list_string != "string") return undefined;

        const api = object["api"];
        if (typeof api != "string") return undefined;

        return new Language(name, api, this.get_extensions(extensions_list_string));
    }
};