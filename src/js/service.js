/**
 * @desc return color according to Tel Aviv temperature
 */
export function getColor() {
    const telAvivTempUrl = "http://api.apixu.com/v1/current.json?key=dda6e762ae4f41efb7e173552192204&q=tel%20aviv";
    return fetch(telAvivTempUrl)
        .then(validateResponse)
        .then(readResponseAsJSON)
        .then(getTempInC)
        .then(getColor)
}
function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function readResponseAsJSON(response) {
    return response.json();
}

function getTempInC(data) {
    return data.current.temp_c;
}

function getColor(tem) {
    switch (tem) {
        case tem <= 10:
            return 'blue';
        case 10 < tem <= 20:
            return 'green';
        case 20 < tem <= 30:
            return 'yellow';
        default:
            return "red";

    }
}