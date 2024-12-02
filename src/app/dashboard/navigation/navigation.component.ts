import { Component } from '@angular/core';
import { routesData } from './routes-data';
import { AdminGuard } from 'src/app/guards/admin.guard';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  routes: any[];
  constructor(private adminGuard: AdminGuard){
    this.routes = routesData;
    if(!adminGuard.canActivate()){
      this.routes.pop();
    }
  }
  


}