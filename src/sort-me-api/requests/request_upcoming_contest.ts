import request from "../request";

export default async function request_upcoming_contest (
    authorization_bearer_token: string
): Promise<Response> {
    return request("getUpcomingContests", authorization_bearer_token);
}