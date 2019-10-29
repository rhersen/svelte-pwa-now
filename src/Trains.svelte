<script>
  import groupBy from "lodash/groupBy"
  import branchDivider from "./branchDivider"
  import currentTrains from "./currentTrains"
  import Branch from "./Branch.svelte"

  export let result;
  export let stations;

  $: grouped = groupBy(currentTrains(result.TrainAnnouncement, stations), train => branchDivider(train, stations))

  let keys = ["nw", "ne", "sw", "se", "c"]

  function stationName(locationSignature, stations) {
    return ((stations && stations[locationSignature] && stations[locationSignature].AdvertisedShortLocationName) || locationSignature)
  }
</script>

<g>
  {#each keys as key}
    <Branch
        key={key}
        trains={grouped[key]}
        position={key}
        stations={stations}
    />
  {/each}
</g>

{#each Object.keys(grouped) as key}
  <h3>{key}</h3>
  <ol>
    {#each grouped[key] as announcement}
      <li>{announcement.AdvertisedTrainIdent} {announcement.ActivityType} {stationName(announcement.LocationSignature, stations)}</li>
    {/each}
  </ol>
{/each}
