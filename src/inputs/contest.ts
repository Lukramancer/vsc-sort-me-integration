import { QuickPickItem, window } from "vscode";
import ContestDescription from "../sort-me-api/objects/contest_description";


class ContestQuickPickItem implements QuickPickItem {
    public readonly label: string;
    public readonly description?: string;
    public readonly detail: string;

    constructor(
        public readonly contest_description: ContestDescription
    ) {
        this.label = this.contest_description.name;
        this.description = this.contest_description.organizer;
        this.detail = this.contest_description.get_url();
    };
};

export default async function choose_contest(contests_descriptions: Array<ContestDescription>): Promise<ContestDescription | undefined> {
    const contests_quick_pick_items = contests_descriptions
        .map(contest_description => new ContestQuickPickItem(contest_description));

    const chosen_contest_quick_pick_item = await window.showQuickPick(contests_quick_pick_items);

    return chosen_contest_quick_pick_item?.contest_description;
}