export enum RouteDirection {
    OUTBOUND = '0',
    INBOUND = '1',
}

export function getDirectionCode(direction: RouteDirection){
    if(!Object.values(RouteDirection).includes(direction))
        throw new Error('route direction is not valid.');
    return (['G', 'D'])[direction];
}
