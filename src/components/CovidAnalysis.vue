<template>
  <div id="covidAnalysis">
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

const urlCovidApiGateway = 'https://4prxbmd4q6.execute-api.us-east-1.amazonaws.com/development/'
const chartLabels = [['Date', 'Rate of Growth', 'Expected Growth Tommorow', 'Rate of Deaths', 'Expected Deaths Tommorow']]

export default {
  name: 'covidAnalysis',
  data () {
    return {
      dataAvailable: false,
      query: {
        country: 'AU'
      },
      flagUrl: '',
      covidUrl: urlCovidApiGateway,
      chart: {
        data: chartLabels,
        options: {
          title: '',
          width: 800,
          height: 500,
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
      this.chart.options.title = `Covid-19(Growth analysis) of ${this.query.country}`

      this.covidUrl = urlCovidApiGateway
      this.covidUrl += this.query.country
      this.covidUrl += '/all?date='

      let dateOb = new Date()

      // current date
      // adjust 0 before single digit date
      let date = ('0' + dateOb.getDate()).slice(-2)

      // current month
      let month = ('0' + (dateOb.getMonth() + 1)).slice(-2)

      // current year
      let year = dateOb.getFullYear()

      let curDate = date + '-' + month + '-' + year
      this.covidUrl += curDate

      this.$http.get(this.covidUrl).then(response => {
        var array = response.body
        if (array.length < 1) {
          this.dataAvailable = false
        } else {
          this.dataAvailable = true
        }

        for (var i = array.length - 1; i >= 0; --i) {
          this.chart.data.push([array[i].date, array[i].rateOfGrowth,
            array[i].nextDayPrediction, array[i].rateOfGrowthDeaths, array[i].nextDayPredictionDeaths])
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
