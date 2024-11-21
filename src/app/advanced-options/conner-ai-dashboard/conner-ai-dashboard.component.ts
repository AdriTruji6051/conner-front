import { Component } from '@angular/core';
import { IaDataScienceService } from 'src/app/services/ia-dataScience/ia-data-science.service';

@Component({
  selector: 'app-conner-ai-dashboard',
  templateUrl: './conner-ai-dashboard.component.html',
  styleUrls: ['./conner-ai-dashboard.component.css']
})
export class ConnerAIDashboardComponent {
  asociation_rules!: any;

  constructor(private connerService: IaDataScienceService){
    this.connerService.asociationRules().subscribe({
      next: (data) => this.asociation_rules = data,
      error: (error) => console.error(error),
    })
  }
}
