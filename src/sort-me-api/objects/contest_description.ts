export default class ContestDescription {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly organizer: string,
        public readonly start: Date,
        public readonly end: Date
    ) {

    }

    static from_object(object: any): ContestDescription | undefined {
        const contest_id = object["id"];
        if (typeof contest_id != "number") return undefined;

        const contest_name = object["name"];
        if (typeof contest_name != "string") return undefined;

        const contest_organizer = object["organizer"] ?? object["org_name"];
        if (typeof contest_organizer != "string") return undefined;

        const contest_start_timestamp = parseInt(object["timings"]?.["start"] ?? object["starts"]);
        if (isNaN(contest_start_timestamp)) return undefined;
        const contest_start = new Date(contest_start_timestamp);

        const contest_end_timestamp = parseInt(object["timings"]?.["end"] ?? object["ends"]);
        if (isNaN(contest_end_timestamp)) return undefined;
        const contest_end = new Date(contest_start_timestamp);

        return new ContestDescription(
            contest_id, contest_name, contest_organizer,
            contest_start, contest_end
        )
    }

    public get_url(): string {
        return `https://sort-me.org/contest/${this.id}`;
    }
};