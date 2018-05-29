export function buildQueryParameters(params: { [key: string]: string }): string {
    return Object.keys(params)
        .reduce(
            (acc, key) => [ ...acc, `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`],
            []
        ).join('&');
}
