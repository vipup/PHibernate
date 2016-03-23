import {IonicApp, Page, NavController, NavParams} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/item-details/item-details.html'
})
export class ItemDetailsPage {
  nav;
  selectedItem;

  constructor(app: IonicApp, nav: NavController, navParams: NavParams) {
    this.nav = nav;
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }
}
