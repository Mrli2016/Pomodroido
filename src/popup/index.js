import Vue from "vue";
import AppComponent from "./App.vue";
// import '@/styles/variables.scss' // global css
import '@/styles/index.scss' // global css

import {
  ButtonGroup,
  Button,
  InputNumber
} from 'element-ui';

Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(Button.name, Button);
Vue.component(InputNumber.name, InputNumber);
Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});