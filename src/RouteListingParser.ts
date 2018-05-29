export interface RouteListingItem {
    routeName: string,
    routeNumber: string,
    detailURL: string,
}

export function parse($: CheerioStatic): Array<RouteListingItem> {
    return $(".DetailLi").toArray().map((elem) => {
            const doc = $(elem);
            const routeName = doc.find('span.line-name1').first().text().trim();
            const routeNumber = doc.find('span.line-number').first().text().trim();
            const detailURL = doc.find('a.DetailLi_action-detail').first().attr('href').trim();

            return { routeName, routeNumber, detailURL };
    });
}

export default parse;
