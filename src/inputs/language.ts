import { QuickPickItem, window } from "vscode";
import Language from "../sort-me-api/objects/language";

class LanguageQuickPickItem implements QuickPickItem {
    public readonly label: string;
    public readonly detail?: string;

    constructor (
        public readonly language: Language,
        public readonly is_suggested: boolean = false
    ) {
        this.label = language.name;

        if (is_suggested) this.detail = "Suggested because of the file extension."
    }
};


export default async function choose_language(
    languages: Array<Language>,
    suggested_language: Language | undefined = undefined
): Promise<Language | undefined> {
    const languages_quick_pick_items = languages
        .map(language => new LanguageQuickPickItem(language))
        .filter((language_quick_pick_item): language_quick_pick_item is LanguageQuickPickItem => language_quick_pick_item !== undefined);

    if (suggested_language) {
        languages_quick_pick_items.unshift(new LanguageQuickPickItem(suggested_language, true));
    }

    const chosen_language_quick_pick_item = await window.showQuickPick(languages_quick_pick_items);

    return chosen_language_quick_pick_item?.language;
}
