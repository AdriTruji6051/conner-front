import { Component } from '@angular/core';
import { routesData } from './routes-data';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  routes = routesData
}
