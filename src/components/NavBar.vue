<template>
  <div id="navBar">
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand>
          <router-link to="/">
            <b-icon-house-fill font-scale="2"></b-icon-house-fill>
          </router-link>
        </b-navbar-brand>
        <b-navbar-brand>
          <b-nav-item>
            <router-link to="/covidAnalysis">
              Covid-19 Analysis
            </router-link>
          </b-nav-item>
        </b-navbar-brand>
        <b-navbar-brand>
          <b-nav-item>
            <router-link to="/covidDataSearch">
              Covid-19 Data Search
            </router-link>
          </b-nav-item>
        </b-navbar-brand>

      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>

export default {
  name: 'navBar',
  data () {
    return {
    }
  }
}
</script>
