class Sample {
    public readonly stdin: string;
    public readonly stdout: string;

    constructor (stdin: string, stdout: string) {
        this.stdin = stdin;
        this.stdout = stdout;
    }

    static from_object(object: any): Sample | undefined {
        const stdin = object["stdin"] ?? object["in"];
        if (typeof stdin != "string") return undefined;

        const stdout = object["stdout"] ?? object["out"];
        if (typeof stdout != "string") return undefined;

        return new Sample(stdin, stdout);
    }
};

export default class Problem {
    constructor (
        public readonly id: number,
        public readonly name: string,

        public readonly legend: string,
        public readonly input_description: string,
        public readonly output_description: string,

        public readonly time_limit_milliseconds_amount: number,
        public readonly memory_limit_megabytes_amount: number,

        public readonly samples: Array<Sample>
    ) {

    }
    
    static from_object(object: any): Problem | undefined {
        const problem_name = object["name"];
        if (typeof problem_name != "string") return undefined;


        const problem_id = object["id"];
        if (typeof problem_id != "number") return undefined;


        const problem_legend = object["statement"]?.["legend"] ?? object["main_description"];
        const problem_input_description = object["statement"]?.["legend"] ?? object["in_description"];
        const problem_output_description = object["statement"]?.["legend"] ?? object["out_description"];

        if (
            typeof problem_legend != "string" ||
            typeof problem_input_description != "string" ||
            typeof problem_output_description != "string"
        ) return undefined;


        const problem_time_limit_milliseconds_amount = object["limits"]?.["time"] ?? object["time_limit_milliseconds"];
        const problem_memory_limit_megabytes_amount = object["limits"]?.["memory"] ?? object["memory_limit_megabytes"];

        if (
            typeof problem_time_limit_milliseconds_amount != "number" ||
            typeof problem_memory_limit_megabytes_amount != "number"
        ) return undefined;


        const problem_samples = (
            (Array.isArray(object["samples"])) ?
            object["samples"].map(Sample.from_object).filter((sample) : sample is Sample => sample !== undefined) :
            []
        );

        return new Problem(
            problem_id, problem_name,
            problem_legend, problem_input_description, problem_output_description,
            problem_time_limit_milliseconds_amount, problem_memory_limit_megabytes_amount,
            problem_samples
        )
    }
};