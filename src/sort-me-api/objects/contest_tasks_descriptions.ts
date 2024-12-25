import Language from "./language";
import Problem from "./problem";

export default class ContestTasksDescription {
    constructor(
        public readonly languages: Array<Language>,
        public readonly problems: Array<Problem>
    ) { }

    static from_object(object: any): ContestTasksDescription | undefined {
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

        return new ContestTasksDescription(contest_languages, contest_problems);
    }
};