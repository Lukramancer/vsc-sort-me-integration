import request from "../request";

export default async function request_contest_task(
    authorization_bearer_token: string,
    contest_id: number | string
): Promise<Response> {
    return request("getContestTasks", authorization_bearer_token, {id: contest_id});
}