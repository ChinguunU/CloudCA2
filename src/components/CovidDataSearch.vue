<template>
  <div id="covidDataSearch">
    <br>
    <div class='drop-down-pos'>
      <country-select className="form-control" v-model="query.country" :country="query.country"/>
    </div>
    <img class='image-pos' :src="flagUrl" width='50' height='40'>

    <br><br>
    <template v-if="dataAvailable">
      <div class="charts">
      <GChart
        type="LineChart"
        :data="chart.data"
        :options="chart.options"
      />
    </div>
    </template>
    <template v-else>
      <img class='no-data-img' src="https://country-images-s3774562.s3.amazonaws.com/countries/noData.png" width='1000' height='500'>
    </template>
  </div>
</template>

<script>

const urlCovidApi = 'https://corona-api.com/countries/'
const chartLabels = [['Date', 'New cases', 'Deaths', 'Recoveries']]

export default {
  name: 'covidDataSearch',
  data () {
    return {
      dataAvailable: false,
      query: {
        country: 'AU'
      },
      flagUrl: '',
      covidUrl: urlCovidApi,
      chart: {
        data: chartLabels,
        options: {
          title: '',
          width: 800,
          height: 500,
          vAxes: {
            // Adds title to axis.
            0: {title: 'Number of cases'}
          },
          hAxis: {
            0: {title: 'Date of cases'}
          }
        }
      }
    }
  },
  methods: {
    show () {
      console.log('showing')
      console.log(this.query.country)
    },
    attachFlag () {
      var url = `https://country-images-s3774562.s3.amazonaws.com/countries/${this.query.country}.png`
      this.flagUrl = url
    },
    populateChart () {
      while (this.chart.data.length > 1) {
        this.chart.data.pop()
      }
      this.attachFlag()
      this.chart.options.title = `Covid-19(New cases, Deaths, Recoveries) of ${this.query.country}`

      this.covidUrl = urlCovidApi
      this.covidUrl += this.query.country

      this.$http.get(this.covidUrl).then(response => {
        var array = response.body.data.timeline
        if (array.length < 1) {
          this.dataAvailable = false
        } else {
          this.dataAvailable = true
        }

        for (var i = array.length - 1; i >= 0; --i) {
          this.chart.data.push([array[i].date, array[i].new_confirmed,
            array[i].new_deaths, array[i].new_recovered])
        }
      }, response => {
        console.log('Error')
      })
    }
  },
  watch: {
    'query.country': function (val) {
      this.populateChart()
    },
    $route (to, from) {
      this.chart.data = chartLabels
    }
  },
  created:
    function (val) {
      this.populateChart()
    }
}
</script>

<style>
.no-data-img {
  position: absolute;
  right: 500px;
}

.image-pos {
  position: absolute;
  right: 600px;
}

.charts {
  display: inline;
  position: absolute;
  right: 500px;
}

.drop-down-pos {
  position: absolute;
  right: 100px;
  width: 500px;
  height: 120px;
}

</style>
