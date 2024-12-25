import ContestDescription from "./contest_description";
import Language from "./language";
import Problem from "./problem";

export default class Contest extends ContestDescription {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly organizer: string,

        public readonly start: Date,
        public readonly end: Date,

        public readonly languages: Array<Language>,

        public readonly problems: Array<Problem>
    ) {
        super(id, name, organizer, start, end);
    }

    public static from_object(object: any): Contest | undefined {
        const contest_id = object["id"];
        if (typeof contest_id != "number") return undefined;

        const contest_name = object["name"];
        if (typeof contest_name != "string") return undefined;

        const contest_description = object["description"];
        if (typeof contest_description != "string") return undefined;

        const contest_organizer = object["organizer"];
        if (typeof contest_organizer != "string") return undefined;

        const contest_start_timestamp = parseInt(object["timings"]?.["start"] ?? object["starts"]);
        if (isNaN(contest_start_timestamp)) return undefined;
        const contest_start = new Date(contest_start_timestamp);

        const contest_end_timestamp = parseInt(object["timings"]?.["end"] ?? object["ends"]);
        if (isNaN(contest_end_timestamp)) return undefined;
        const contest_end = new Date(contest_start_timestamp);


        const object_problems = object["problems"] ?? object["tasks"];
        if (!Array.isArray(object_problems)) return undefined;

        const contest_problems = object_problems
            .map(Problem.from_object)
            .filter((problem): problem is Problem => problem !== undefined);
        
        
        let contest_languages: Array<Language> = new Array<Language>();
        if (Array.isArray(object["languages"])) {
            contest_languages = object["languages"]
                .map(Language.from_object)
                .filter((language): language is Language => language !== undefined);
        }
        else if (
            Array.isArray(object["langs"]?.["verbose"]) &&
            Array.isArray(object["langs"]?.["api"]) &&
            Array.isArray(object["langs"]?.["extensions"])
        ) {
            for (
                let language_index = 0;
                language_index < Math.min(object["langs"]["verbose"].length, object["langs"]["api"].length, object["langs"]["extensions"].length);
                language_index++
            ) {
                const language_name = object["langs"]["verbose"][language_index];
                if (typeof language_name != "string") continue;

                const language_api = object["langs"]["api"][language_index];
                if (typeof language_api != "string") continue;

                const language_extensions = object["langs"]["extensions"][language_index];
                if (!Array.isArray(language_extensions)) continue;

                if (!language_extensions.every((language_extension): language_extension is string => typeof language_extension == "string")) {
                    continue;
                }
                contest_languages.push(new Language(language_name, language_api, language_extensions));
            }
        }

        return new Contest(
            contest_id,
            contest_name, contest_description, contest_organizer,
            contest_start, contest_end,
            contest_languages, contest_problems
        );
    }
};