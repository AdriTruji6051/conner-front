import { AfterViewInit, Component, Input, OnChanges, SimpleChanges  } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  template: `
    <div style="display: block; width: 80%; margin: auto;">
      <canvas id="lineChart"></canvas>
    </div>

  `,
  styles: [
  ]
})

export class LineChartComponent implements AfterViewInit, OnChanges{
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  private chart: Chart | null = null; // Referencia al gráfico

  constructor() {
    // Registrar componentes necesarios de Chart.js
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.createLineChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    alert('Emboscada!')
    if (changes['labels'] || changes['data']) {
      this.updateChart();
    }
  }

  createLineChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line', // Tipo de gráfica
      data: {
        labels: this.labels, // Etiquetas del eje X
        datasets: [
          {
            label: 'Ventas del día',
            data: this.data, // Datos
            borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de relleno bajo la línea
            borderWidth: 2, // Grosor de la línea
            tension: 0.3, // Curvatura de la línea
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
              text: 'Meses',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Cantidad (en USD)',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destruye la instancia actual
    }
    this.createLineChart(); // Crea una nueva instancia con los valores actualizados
  }
}
