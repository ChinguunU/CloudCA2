<template>
  <div id="covidAnalysis">
    <br>
    <country-select className="select-css" v-model="query.country" :country="query.country"/>
    <button @click="show">Click</button>

    <GChart
      type="LineChart"
      :data="chart.data"
      :options="chart.options"
    />
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'

const urlBase = 'https://corona-api.com/countries/'
const chartLabels = [['date', 'New cases', 'Deaths', 'Recoveries']]

export default {
  name: 'covidAnalysis',
  data () {
    return {
      on: false,
      query: {
        country: 'AU'
      },
      url: urlBase,
      chart: {
        data: chartLabels,
        options: {
          chart: {
            title: 'Covid-19(New cases, Deaths, Recoveries) by country',
            subtitle: 'by daily data'
          },
          width: 900,
          height: 500
        }
      }
    }
  },
  watch: {
    'query.country': function(val) {
      this.chart.data = chartLabels
      this.url = urlBase
      // if(this.on) {
      //   this.url += 'switzerland'
      // } else {
      //   this.url += 'mongolia'
      // }
      this.url += this.query.country
      console.log(this.url)
      this.$http.get(this.url).then(response => {

        var array = response.body.data.timeline
        console.log(array)
        for(var i = array.length - 1; i >= 0; --i) {

          this.chart.data.push([array[i].date, array[i].new_confirmed,
          array[i].new_deaths, array[i].new_recovered])
        }
        console.log(response.body)
        this.on = !this.on

      }, response => {
        // error callback
      });
    }
  },
  // created:
  // function (val) {
  //   this.chart.data = [['date', 'newCases', 'deaths', 'recoveries']]
  //     this.url = urlGen
  //     this.url += this.country
  //     this.$http.get(this.url).then(response => {

  //       var array = response.body
  //       for(var i = 0; i < array.length; ++i) {

  //         this.chart.data.push([array[i].Date, array[i].Confirmed,
  //         array[i].Deaths, array[i].Recovered])
  //       }
  //       console.log(response.body)
  //       this.on = !this.on

  //     }, response => {
  //       // error callback
  //     });
  // },
  methods: {
    show() {
      // const key = { "Content-Type": "application/json;charset=utf-8",
      //   "x-api-key": LNkCeQjNcS9uWxrLVPlUnaGu1P41bRyYaEbDy7ha };
      this.$http.get("https://4prxbmd4q6.execute-api.us-east-1.amazonaws.com/development/Australia?date=01-02-20").then(response => {

        console.log(response);

      }, response => {
        // error callback
      });
    }
  }

}
</script>

<style>
.select-css {
    display: inline;
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 700;
    color: #444;
    line-height: 1.3;
    padding: .6em 1.4em .5em .8em;
    width: 25%;
    max-width: 100%; /* useful when width is set to anything other than 100% */
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    /* note: bg image below uses 2 urls. The first is an svg data uri for the arrow icon, and the second is the gradient.
        for the icon, if you want to change the color, be sure to use `%23` instead of `#`, since it's a url. You can also swap in a different svg icon or an external image reference

    */
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
    background-repeat: no-repeat, repeat;
    /* arrow icon position (1em from the right, 50% vertical) , then gradient position*/
    background-position: right .7em top 50%, 0 0;
    /* icon size, then gradient */
    background-size: .65em auto, 50%;
}
/* Hide arrow icon in IE browsers */
.select-css::-ms-expand {
    display: none;
}
/* Hover style */
.select-css:hover {
    border-color: #888;
}
/* Focus style */
.select-css:focus {
    border-color: #aaa;
    /* It'd be nice to use -webkit-focus-ring-color here but it doesn't work on box-shadow */
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
}

/* Set options to normal weight */
.select-css option {
    font-weight:normal;
}

/* Support for rtl text, explicit support for Arabic and Hebrew */
*[dir="rtl"] .select-css, :root:lang(ar) .select-css, :root:lang(iw) .select-css {
    background-position: left .7em top 50%, 0 0;
    padding: .6em .8em .5em 1.4em;
}

/* Disabled styles */
.select-css:disabled, .select-css[aria-disabled=true] {
    color: graytext;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22graytext%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
}

.select-css:disabled:hover, .select-css[aria-disabled=true] {
    border-color: #aaa;
}
</style>
