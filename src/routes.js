// import Impression from './pages/Impression.vue';
// import TimeGridContainer from './pages/TimeGridContainer.vue';
// import LearnMore from './pages/LearnMore.vue';
// import VisualSymbol from './pages/VisualSymbol.vue';
// import Activity from './pages/Activity.vue';
// import ArtisticCreation from './pages/ArtisticCreation.vue';
// import FristScreen from './pages/FirstScreen.vue';

const routes = [
  { path: '/impression', component: () => import('./pages/Impression.vue') },
  { path: '/time-grid', component: () => import('./pages/TimeGridContainer.vue') },
  { path: '/learn-more', component: () => import('./pages/LearnMore.vue') },
  { path: '/visual-symbol', component: () => import('./pages/VisualSymbol.vue') },
  { path: '/artistic-creation', component: () => import('./pages/ArtisticCreation.vue') },
  { path: '/activity', component: () => import('./pages/Activity.vue') },
  { path: '/', component: () => import('./pages/FirstScreen.vue') }
  // { path: '/impression', component: Impression },
  // { path: '/time-grid', component: TimeGridContainer },
  // { path: '/learn-more', component: LearnMore },
  // { path: '/visual-symbol', component: VisualSymbol },
  // { path: '/artistic-creation', component: ArtisticCreation },
  // { path: '/activity', component: Activity },
  // { path: '/', component: FristScreen }
];

export default routes;
