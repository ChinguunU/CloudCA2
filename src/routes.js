import Home from './components/Home.vue'
import CovidAnalysis from './components/CovidAnalysis.vue'
import CovidDataSearch from './components/CovidDataSearch.vue'

export const routes = [
  { path: '', name: 'home', component: Home },
  { path: '/covidAnalysis', name: 'covidAnalysis', component: CovidAnalysis },
  { path: '/covidDataSearch', name: 'covidDataSearch', component: CovidDataSearch },
  { path: '*', redirect: { name: 'home' } }
];
