export const api = `https://manage.adlerprep.de/api`;
//export const api = `http://localhost:8080/api`
export const headers = {
    headers: {
        'Content-Type' : 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin' : "*",
        'Auth' : "",
        'Email' : "",
        'Version': 1.67,
    }
};
export const setAuth = (token:string) => {
    headers.headers.Auth = token;
}