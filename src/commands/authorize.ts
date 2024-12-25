import { window, ExtensionContext } from "vscode";

export default async function authorize(context: ExtensionContext) {
    const inputed_token = await window.showInputBox({
        prompt: "Bearer token"
    });

    if (!inputed_token) return;

    const sortme_avalibale_languages_response = await fetch("https://api.sort-me.org/submissions/getAvailableLanguages", {
        headers: {
            Authorization: `Bearer ${inputed_token}`
        }
    });

    if (sortme_avalibale_languages_response.status == 401) {
        window.showErrorMessage(`Error inputed token is not valid.`);
        return;
    }
    else if (sortme_avalibale_languages_response.status == 200) {
        window.showInformationMessage(`Successfully authorized on sort-me.org`);
        context.secrets.store("bearer_token", inputed_token);
    }
    else {
        window.showErrorMessage(`Unexcpected response from sort-me.org code ${sortme_avalibale_languages_response.status}`);
        return;
    }
}