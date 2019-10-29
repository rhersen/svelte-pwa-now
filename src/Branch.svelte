<script>
  import {differenceInMinutes, parseISO} from "date-fns"
  import {line1, line2} from "./formatLatestAnnouncement"

  export let key
  export let trains
  export let position
  export let stations

  function color(a) {
    const delay = minutes(a)
    return delay < 1 ? "#0f0" : delay < 2 ? "#fff" : delay < 4 ? "#ff0" : delay < 8 ? "#f80" : "#f00"
  }

  function minutes(a) {
    return differenceInMinutes(parseISO(a.TimeAtLocation), parseISO(a.AdvertisedTimeAtLocation))
  }

  function dy(l) {
    if (l === 1) return 6
    if (l === 2) return (4 * (4 - 1.2)) / 3
    if (l === 3) return (4 * (4 - 1.2)) / (l + 1)
    if (l === 5) return 1.5
    if (l === 6) return 1.15
    if (l === 7) return 0.85
    return (4 * (4 - 1.2)) / (l + 1)
  }
</script>

<style>
  g.pos-nw {
    transform: translate(-4px, -6px);
  }

  g.pos-ne {
    transform: translate(0, -6px);
  }

  g.pos-sw {
    transform: translate(-4px, 2px);
  }

  g.pos-se {
    transform: translate(0, 2px);
  }

  g.pos-c {
    transform: translate(-2px, -2px);
  }

  rect.branch {
    fill: #000;
    stroke: red;
    stroke-width: 0.02px
  }

  text.train {
    font-family: Arial Narrow, Arial, sans-serif;
  }
</style>

<g class={`pos-${position}`}>
  <rect
      class="branch"
      x="0"
      y="0"
      height="4"
      width="4"
  />
  <text class="train" style="font-size: 0.3px">
    {#if trains}
      {#each trains as train}
        <tspan
            x="0.05"
            dy={0.3 * dy(trains.length)}
            fill={color(train)}
            key={train.AdvertisedTrainIdent + 1}
        >
          {line1(train, stations)}
        </tspan>
        <tspan
            x="0.05"
            dy="0.3"
            fill={color(train)}
            key={train.AdvertisedTrainIdent + 2}
        >
          {line2(train, stations)}
        </tspan>
      {/each}
    {/if}
  </text>
</g>