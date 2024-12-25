import { window, ExtensionContext } from "vscode";
import Problem from "../sort-me-api/objects/problem";
import ContestDescription from "../sort-me-api/objects/contest_description";
import request_contest_task from "../sort-me-api/requests/request_contest_tasks";
import ContestTasksDescription from "../sort-me-api/objects/contest_tasks_descriptions";
import request_upcoming_contest from "../sort-me-api/requests/request_upcoming_contest";
import Language from "../sort-me-api/objects/language";
import choose_contest from "../inputs/contest";
import choose_contest_problem from "../inputs/contest_problem";
import choose_language from "../inputs/language";
import request_submit from "../sort-me-api/requests/request_submit";


function get_problem_index_insight_by_file_name(file_name: string): number | undefined {
    const first_character_code = file_name.charCodeAt(file_name.lastIndexOf('/') + 1);

    if ('A'.charCodeAt(0) <= first_character_code && first_character_code <= 'Z'.charCodeAt(0)) {
        return first_character_code - 'A'.charCodeAt(0);
    }
    else if ('a'.charCodeAt(0) <= first_character_code && first_character_code <= 'z'.charCodeAt(0)) {
        return first_character_code - 'a'.charCodeAt(0);
    }
    else return undefined;
}

function get_problem_insight_by_file_name(file_name: string, problems: Array<Problem>): [number, Problem] | undefined {
    const problem_index = get_problem_index_insight_by_file_name(file_name);

    if ((problem_index !== undefined) && (problem_index < problems.length)) return [problem_index, problems[problem_index]];
    else return undefined;
}

function get_language_insight_by_file_name(file_name: string, languages: Array<Language>): Language | undefined {
    const file_name_extension = file_name.split('.').pop();
    if (!file_name_extension) return undefined;

    return languages.find(language => language.extensions.includes(file_name_extension));
}


export default async function sumbit_current_file(context: ExtensionContext) {
    const active_text_editor_document = window.activeTextEditor?.document;
    if(!active_text_editor_document) {
        window.showErrorMessage("Text editor must be opened and active.");
        return;
    }

    const current_file_text = active_text_editor_document.getText();

    const authorization_bearer_token = await context.secrets.get("bearer_token");
    if (!authorization_bearer_token) {
        window.showErrorMessage("Not authorized: token is not set.");
        return
    }

    const upcoming_contests_response = await request_upcoming_contest(authorization_bearer_token);
    if (upcoming_contests_response.status == 401) {
        window.showErrorMessage("Not authorized: token is not valid.");
        return;
    }
    const upcoming_contests_json: any = await upcoming_contests_response.json() as any;
    if (!Array.isArray(upcoming_contests_json)) {
        console.log("Unexpected response from sort-me.org");
        console.log(upcoming_contests_json);

        window.showErrorMessage("Unexpected response from sort-me.org");
        return;
    }
    const upcoming_contests_descriptions = upcoming_contests_json
        .map(ContestDescription.from_object)
        .filter((contest_description): contest_description is ContestDescription => contest_description !== undefined);


    const chosen_contest_description = await choose_contest(upcoming_contests_descriptions);
    if (!chosen_contest_description) return;

    const contest_tasks_description_response = await request_contest_task(authorization_bearer_token, chosen_contest_description.id);
    const contest_tasks_description_json: any = await contest_tasks_description_response.json();
    const contest_tasks_description = ContestTasksDescription.from_object(contest_tasks_description_json);
    if (!contest_tasks_description) {
        console.log("Unexpected response from sort-me.org");
        console.log(contest_tasks_description_json);

        window.showErrorMessage("Unexpected response from sort-me.org");
        return;   
    }

    const chosen_contest_problem = await choose_contest_problem(
        contest_tasks_description.problems,
        get_problem_insight_by_file_name(active_text_editor_document.fileName, contest_tasks_description.problems)
    );
    if (!chosen_contest_problem) return;

    const chosen_language = await choose_language(
        contest_tasks_description.languages,
        get_language_insight_by_file_name(active_text_editor_document.fileName, contest_tasks_description.languages)
    );
    if (!chosen_language) return;

    const submit_response = await request_submit(
        authorization_bearer_token,
        chosen_contest_description.id, chosen_contest_problem.id, chosen_language.api,
        current_file_text
    )
    
    console.log(submit_response.status);
    console.log(await submit_response.text());
}