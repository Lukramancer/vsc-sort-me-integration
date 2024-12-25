import request from "../request";

export default async function request_available_contest (
    authorization_bearer_token: string
): Promise<Response> {
    return request("contests/getAvailable", authorization_bearer_token);
}