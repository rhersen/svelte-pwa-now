import { differenceInMinutes, parseISO } from "date-fns"

export function line1(train, stations) {
  if (!train) return "Aktuell information saknas"

  return `${id(train)} mot ${train.ToLocation.map(loc => loc.LocationName).map(
    loc => stationName(loc, stations)
  )} ${precision(train)}`
}

export function line2(train, stations) {
  if (!train) return "line2"

  return `${activity(train)} ${location(
    train
  )} kl ${train.TimeAtLocation.substring(11, 16)}`

  function location(a) {
    return stationName(a.LocationSignature, stations)
  }
}

function id(a) {
  return a.AdvertisedTrainIdent
}

function stationName(locationSignature, stations) {
  return (
    (stations &&
      stations[locationSignature] &&
      stations[locationSignature].AdvertisedShortLocationName) ||
    locationSignature
  )
}

function precision(a) {
  const delay = differenceInMinutes(
    parseISO(a.TimeAtLocation),
    parseISO(a.AdvertisedTimeAtLocation)
  )

  return delay === 1
    ? "nästan i tid"
    : delay > 0
    ? `${delay} minuter försenat`
    : delay < -1
    ? "i god tid"
    : "i tid"
}

function activity(a) {
  return a.ActivityType === "Ankomst" ? "ank" : "avg"
}
