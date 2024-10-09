import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ConnEr';

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    const message = '¿Estás seguro de que quieres salir?';
    $event.returnValue = message; 
    return message;
  }
}
