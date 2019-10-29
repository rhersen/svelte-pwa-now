import groupBy from "lodash/groupBy"
import maxBy from "lodash/maxBy"
import orderBy from "lodash/orderBy"
import property from "lodash/property"
import * as wgs from "./wgs"

export default function currentTrains(announcement, stations) {
  const grouped = groupBy(announcement, "AdvertisedTrainIdent")
  const object = Object.keys(grouped)
    .map(announcementsToObject)
    .filter(property("ToLocation"))
  const sorted = sortTrains(object, direction(announcement), stations)
  return sorted.filter(hasNotArrivedAtDestination).filter(isPendel)

  function announcementsToObject(k) {
    const v = grouped[k]
    const actual = maxBy(
      v.filter(announcement => announcement.TimeAtLocation),
      a => a.TimeAtLocation + a.ActivityType
    )

    if (actual) {
      const withToLocation = v.find(property("ToLocation"))
      const withProductInformation = v.find(property("ProductInformation"))
      return {
        ...actual,
        ToLocation:
          withToLocation && !actual.ToLocation
            ? withToLocation.ToLocation
            : actual.ToLocation,
        ProductInformation:
          withProductInformation && !actual.ProductInformation
            ? withProductInformation.ProductInformation
            : actual.ProductInformation
      }
    }
  }

  function direction(announcements) {
    return (
      announcements.length &&
      /\d\d\d[13579]/.test(announcements[0].AdvertisedTrainIdent)
    )
  }

  function hasNotArrivedAtDestination(train) {
    return !(
      train.ActivityType === "Ankomst" &&
      train.ToLocation.map(property("LocationName")).join() ===
        train.LocationSignature
    )
  }

  function isPendel(train) {
    return !train.ProductInformation || train.ProductInformation.length === 2
  }

  function sortTrains(object, dir) {
    return orderBy(
      object,
      [
        a => north(a.LocationSignature, stations),
        "ActivityType",
        "TimeAtLocation"
      ],
      ["desc", dir ? "asc" : "desc", dir ? "desc" : "asc"]
    )
  }

  function north(location) {
    if (location === "Gdv") return between("Ngd", "Nyh")
    if (location === "Söc") return between("Söd", "Söu")
    if (location === "Gn") return between("Mö", "Ssä")
    return wgs.north(location, stations)
  }

  function between(loc1, loc2) {
    return 0.5 * wgs.north(loc1, stations) + 0.5 * wgs.north(loc2, stations)
  }
}
