import request from "../request";

export default async function request_contest (
    authorization_bearer_token: string,
    contest_id: number | string
): Promise<Response> {
    return request("contests/getByID", authorization_bearer_token, {id: contest_id});
}