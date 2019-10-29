<script>
  import HelloWorld from './components/HelloWorld.svelte';
  import Router from './components/Router.svelte';
  import {onMount} from 'svelte'
  import * as grid from "./grid"
  import Trains from "./Trains.svelte"

  let result = {TrainAnnouncement: []};
  let locations = {};
  let clicked;
  let loaded;

  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }

  onMount(async () => {
    const res = await fetch(`.netlify/functions/locations`);
    locations = await res.json();
  });

  function getCurrent(direction) {
    return async () => {
      result = {TrainAnnouncement: []};
      clicked = direction;
      loaded = undefined;

      const res = await fetch(`.netlify/functions/announcements?direction=${direction}`);
      const json = await res.json();

      if (res.ok) {
        result = json;
        loaded = direction;
      } else {
        throw new Error(json);
      }
      clicked = undefined;
    }
  }
</script>

<style>
  polygon {
    stroke-width: 0.02px
  }

  polygon.clicked {
    fill: gray
  }

  polygon.loaded {
    fill: hsl(240, 100%, 50%)
  }
</style>

<svg viewBox="-4 -6 8 12">
  <polygon
      class={ loaded === "n" ? "loaded" : clicked === "n" ? "clicked" : "idle" }
      points={grid.leftTriangle()}
      stroke="#005CFF"
      fill="#f5f5f5"
      on:click={getCurrent("n")}
  />
  <polygon
      class={ loaded === "s" ? "loaded" : clicked === "s" ? "clicked" : "idle" }
      points={grid.rightTriangle()}
      stroke="#005CFF"
      fill="#f5f5f5"
      on:click={getCurrent("s")}
  />
  <g>
    <text className="timestamp" textAnchor="middle" x="-1.5" y="-0.5">
    </text>
  </g>
  <Trains result={result} stations={locations}/>
</svg>
