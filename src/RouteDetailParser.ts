import { StopLocation, StopListingItem } from "./Stop";
import { RouteDirection } from "./RouteDirection";

export interface RouteDetailResult {
    routeNumber: string,
    routeName: string,
    trips: { [ Direction in RouteDirection ]: Array<StopListingItem> },
}

function getDirectionAttrName(direction: RouteDirection): string {
    if(direction === RouteDirection.OUTBOUND)
        return "Going";
    else if(direction === RouteDirection.INBOUND)
        return "Return";
    throw new Error('direction attr name not implemented');
}

export function parseStops($, direction: RouteDirection): Array<StopListingItem> {
    const directionAttrName = getDirectionAttrName(direction);

    return $(`.DetailTable[data-direction="${directionAttrName}"] li.LineStation`)
        .toArray()
        .map((elem) => {
            const doc = $(elem);
            const stopCode = doc.attr('data-durak-code').trim();
            const stopName = doc.find('.LineStation_name').first().text().trim()
                .replace(/^[0-9]+ - /, '');
            const districtName = doc.find('.LineStation_location').first().text().trim();
            const locationElem =
                $(`ol[data-station-direction="${directionAttrName}"] li[data-station-name="${stopName}"]`).first();
            let location: StopLocation = null;

            if(locationElem.length === 1) {
                const lat = locationElem.attr('data-station-lat');
                const lng = locationElem.attr('data-station-lng');

                location = { lat, lng }
            }

            return Object.assign({ stopCode, stopName, districtName }, location ? { location } : {});
        });
}

export function parser($: CheerioStatic): RouteDetailResult {
    const routeInfo = $('select#DetailSelect option').first();
    const routeNumber = routeInfo.attr('data-line-number').trim();
    const routeName = routeInfo.attr('data-line-name1').trim();
    const trips = {
        [RouteDirection.OUTBOUND]: parseStops($, RouteDirection.OUTBOUND),
        [RouteDirection.INBOUND]: parseStops($, RouteDirection.INBOUND),
    };

    return { routeNumber, routeName, trips };
}

export default parser;
