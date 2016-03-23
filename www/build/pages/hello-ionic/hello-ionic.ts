import {Page, NavController} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html'
})
export class HelloIonicPage {
  nav;

  constructor(nav: NavController) {
    this.nav = nav;
  }
}
