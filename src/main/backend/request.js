/**
 * The function `sendRequest` is a JavaScript function that sends an HTTP request using XMLHttpRequest
 * and returns a promise that resolves with the response.
 * @param request - The `request` parameter is an object that contains the details of the HTTP request
 * to be sent. It has the following properties:
 * @returns The function `sendRequest` is returning a Promise.
 */

var XMLHttpRequest = require('xhr2');
export default function sendRequest(request) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(request.method, request.url, true);
        for (const [header, value] of Object.entries(request.headers))
            xhr.setRequestHeader(header, value);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                const response = {
                    status: xhr.status,
                    headers: xhr.getAllResponseHeaders(),
                    body: xhr.responseText
                };
                resolve(response);
            }
        };
        xhr.send(request.body);
    });
}
