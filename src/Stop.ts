export interface StopLocation {
    lat: number,
    lng: number,
}

export interface StopListingItem {
    districtName: string,
    stopCode: string,
    stopName: string,
    location?: StopLocation,
}
