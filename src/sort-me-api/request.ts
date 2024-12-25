const BASE_URL: URL = new URL("https://api.sort-me.org");

export default async function request(
    path: string,
    authorization_bearer_token?: string,
    params: Object | Map<string, any> | undefined = {},
    body: string | Object | Map<string, any> | undefined = undefined
): Promise<Response> {
    const request_url = new URL(path, BASE_URL);
    Object.entries(params).forEach(([param_name, param_value]) => request_url.searchParams.append(param_name, String(param_value)));

    const request_headers: Record<string, any> = {
        "never-gonna": "let-you-down",
    };
    if (authorization_bearer_token) {
        request_headers["Authorization"] = `Bearer ${authorization_bearer_token}`;
    }

    const request_method = (body == undefined) ? "GET" : "POST";

    let request_body: string | undefined = undefined;
    if (typeof body == "string") {
        request_body = body;
    }
    else if (typeof body == "object") {
        request_body = JSON.stringify(body);
        request_headers["Content-type"] = "application/json";
    }

    return fetch(request_url, {
        method: request_method,
        headers: request_headers,
        body: request_body
    });
}