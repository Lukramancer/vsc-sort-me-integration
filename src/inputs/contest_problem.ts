import { QuickPickItem, window } from "vscode";
import Problem from "../sort-me-api/objects/problem";

class ContestProblemQuickPickItem implements QuickPickItem {
    public readonly label: string;
    public readonly description: string;
    public readonly detail?: string;

    constructor(
        public readonly contest_problem_index: number,
        public readonly problem: Problem,
        public readonly is_suggested: boolean = false
    ) {
        this.label = String.fromCharCode('A'.charCodeAt(0) + contest_problem_index);
        this.description = problem.name;

        if (is_suggested) this.detail = "Suggested beacuse of file name";
    }
};

export default async function choose_contest_problem(
    contest_problems: Array<Problem>,
    suggested_problem_with_index: [number, Problem] | undefined = undefined
): Promise<Problem | undefined> {
    const contest_problems_quick_pick_items = contest_problems
        .map((contest_problem, contest_problem_index) => new ContestProblemQuickPickItem(contest_problem_index, contest_problem))
        .filter((contest_problem_quick_pick_item): contest_problem_quick_pick_item is ContestProblemQuickPickItem => contest_problem_quick_pick_item !== undefined);

    if (suggested_problem_with_index !== undefined) {
        contest_problems_quick_pick_items.unshift(new ContestProblemQuickPickItem(suggested_problem_with_index[0], suggested_problem_with_index[1], true));
    }

    const chosen_contest_problem_quick_pick_item = await window.showQuickPick(contest_problems_quick_pick_items);

    return chosen_contest_problem_quick_pick_item?.problem;
}