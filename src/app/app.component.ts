import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  public automateSale: any = {};
  id: any;
  constructor(private http: HttpClient) { }
  title = 'ThreeShape.AutomateStatistics';

  ngOnInit() {
    this.getSales();
    this.id = setInterval(() => {
      this.getSales();
    }, 15 * 60 * 1000); // one time per 15 minutes
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
  getSales() {
    this.http.get<any>('https://sky-usagestatistics-prod.azurewebsites.net/dailyUsage').subscribe(
      (result: string | any[]) => {
        let labelArray = [];
        let soldArray = [];
        let rejectedArray = [];
        for (let i = 0; i < result.length; i++) {
          let d = new Date(result[i].date);
          labelArray.push(d.toDateString());
          soldArray.push(result[i].sold);
          rejectedArray.push(result[i].rejected);
        }
        this.automateSale = {
          labels: labelArray,
          datasets: [
            {
              label: 'Accepted Crown Orders',
              data: soldArray,
              fill: true,
              backgroundColor: 'rgb(64, 128, 64)',
              tension: 1,
              borderWidth: 2
            },
            {
              label: 'Rejected Crown Orders',
              data: rejectedArray,
              fill: true,
              backgroundColor: 'rgb(128, 64, 64)',
              tension: 1,
              borderWidth: 2
            }
          ]
        };

      },
      (error) => {
        console.error(error);
      }
    );
  }

}
