export enum CalendarDayGroups {
    WEEKDAYS = 'I',
    SATURDAY = 'C',
    SUNDAY = 'P',
}

export enum TripOperator {
    IETT = 0,
    OHO_OAS = 1,
}

function getOperatorByColor(color: string): TripOperator{
    if(color === '000000')
        return TripOperator.IETT;
    return TripOperator.OHO_OAS;
}

export interface StopTime {
    time: string,
    operator: TripOperator,
    extra?: string,
}

export interface StopTimesResult {
    stopCode: string,
    stopName: string,
    routeNumber: string,
    routeName: string,
    firstStop: string,
    notes: string,
    times: { [C in CalendarDayGroups]: Array<StopTime> },
}

export function parseTime(timeRaw: string): { time: string, extra?: string } {
    const match = timeRaw.match(/^([0-9]{2}:[0-9]{2})(.*?)$/);
    if(!match)
        throw new Error('time does not match the regex');

    if(match[2])
        return { time: match[1].trim(), extra: match[2].trim() };
    else
        return { time: match[1].trim() };
}

export function parseStopTime(obj: any): [StopTime, CalendarDayGroups] {
    const { gun: day, renk: color, saat: timeRaw } = obj;
    if(!Object.values(CalendarDayGroups).includes(day))
        throw new Error('calendar day could not be found');

    const stopTime: StopTime = { operator: getOperatorByColor(color), ...parseTime(timeRaw) };
    return [ stopTime, day as CalendarDayGroups ];
}

export function parseStopTimes(obj: any): StopTimesResult {
    if(!obj || !obj['items'])
        throw new Error('not a valid stop times representation.');
    const { items } = obj;
    const {
        durak_code: stopCode, durak_name: stopName, hat_code: routeNumber, hat_name: routeName,
        firstDurak: firstStop, notlar: notes, saat: times
    } = items;

    const parsedTimes = times.map(parseStopTime).reduce((acc, [ stopTime, dayGroup ]) => {
        if(!acc[dayGroup])
            acc[dayGroup] = [];

        acc[dayGroup].push(stopTime);
        return acc;
    }, {});

    return { stopCode, stopName, routeNumber, routeName, firstStop, notes, times: parsedTimes };
}

export function parse(obj: any): Array<StopTimesResult> {
    return obj.map(parseStopTimes);
}

export default parse;
