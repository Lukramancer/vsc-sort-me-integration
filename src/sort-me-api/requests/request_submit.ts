import request from "../request";

export default function request_submit(
    authorization_bearer_token: string,
    contest_id: number,
    problem_id: number,
    language: string,
    code: string
): Promise<Response> {
    return request("submit", authorization_bearer_token, undefined, {
        task_id: problem_id,
        lang: language,
        code,
        contest_id
    });
}