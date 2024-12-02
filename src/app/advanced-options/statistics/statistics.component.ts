import { AfterViewInit, Component } from '@angular/core';
import { MatTabsModule} from '@angular/material/tabs';
import { StatisticService } from 'src/app/services/statisticService/statistic.service';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule} from '@angular/material/core';
import { MatCardModule} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { roundNumber } from 'src/app/utils/number-tratment';

import { Chart, registerables } from 'chart.js';
import { format, parse } from "@formkit/tempo"


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [MatTabsModule,MatInputModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatCardModule, FormsModule],

})
export class StatisticsComponent implements AfterViewInit{
  dayTicketsCount: number = 0;
  dayArticlesCount: number = 0;
  dayAverageTicket: number = 0;
  dayAverageArticlePrice: number = 0;
  dayTotalSale: number = 0;
  dayTotalProfit: number = 0;
  dayTotalDiscounts: number = 0;

  dayWorkloadCantity: number[] = [];
  dayWorkloadHours: string[] = [];
  private chart: Chart | null = null;
  
  readable: any;
  date: any;

  constructor(private statistics: StatisticService){
    const now = new Date();
    now.setHours(now.getHours() + -now.getTimezoneOffset() / 60);

    this.date = now.toISOString().split('T')[0];
    this.readable = format(new Date(), "full")

    Chart.register(...registerables);

  }

  ngAfterViewInit(): void {
    this.getDayValues();
  }

  getDayValues(){
    this.statistics.day_statistics(this.date).subscribe({
      next: (data) => this.setDayValues(data),
      error: () => console.log('NOT FOUND')
    })
  }

  setDayValues(values: any){
    console.log(values);
    
    this.dayTicketsCount = roundNumber(values.count);
    this.dayArticlesCount = roundNumber(values.SUMArticleCount);
    this.dayAverageTicket = roundNumber(values.averageTicket);
    this.dayAverageArticlePrice = roundNumber(values.averageProductPrice);
    this.dayTotalSale = roundNumber(values.SUMSubTotal);
    this.dayTotalProfit = roundNumber(values.SUMProfit);
    this.dayTotalDiscounts = roundNumber(values.SUMDiscount);

    this.dayWorkloadCantity = [];
    this.dayWorkloadHours = [];

    values.workload.forEach((element: {
        hour: string; articles: number; 
      }) => {
        this.dayWorkloadCantity.push(element.articles);
        this.dayWorkloadHours.push(element.hour);
      });
    
      this.updateChart();

  }

  onDateChange(event: any): void {
    const selectedDate = event.value;
    this.readable = format(selectedDate, "full")
    const yyyymmdd = this.dateFormater(selectedDate);
    this.date = yyyymmdd;
    this.getDayValues();
  }

  private dateFormater(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes (0 = Enero)
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.createLineChart();
  }

  createLineChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line', // Tipo de gráfica
      data: {
        labels: this.dayWorkloadHours, // Etiquetas del eje X
        datasets: [
          {
            label: 'Ventas del día',
            data: this.dayWorkloadCantity, // Datos
            borderColor: 'rgba(22, 104, 179, 1)', // Color de la línea
            backgroundColor: 'rgba(22, 104, 179, 0.2)', // Color de relleno bajo la línea
            borderWidth: 3, 
            tension: 0.3,
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hora de trabajo',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Cantidad de trabajo (Tickets emitidos)',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

}
