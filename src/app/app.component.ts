import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-table-pro';
  displayedColumns: string[] = [
    'id',
    'address',
    'beds',
    'baths',
    'sq__ft',
    'type',
    'sale_date',
    'price',
    'location'
  ];
  dataSource: MatTableDataSource<any>;
  userArray: any = [];
  allData: any = [];
  headerArr: string[] = [];
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  pageEvent: PageEvent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchSection = new FormGroup({
    city: new FormControl(''),
    state: new FormControl(''),
    beds: new FormControl(''),
    // bed_operator: new FormControl(''),
    baths: new FormControl(''),
    // bath_operator: new FormControl('')
  });

  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http.get('../../assets/data.csv', { responseType: 'text' }).subscribe(
      (data) => {
        let csvToRowArray = data.split('\r');
        this.headerArr = this.getHeaderArray(csvToRowArray);
        console.log(this.headerArr);
        for (let index = 1; index < csvToRowArray.length - 1; index++) {
          let row = csvToRowArray[index].split(',');
          this.userArray.push({
            id: this.userArray.length + 1,
            street: row[0],
            city: row[1],
            zip: row[2],
            state: row[3],
            beds: row[4],
            baths: row[5],
            sq__ft: row[6],
            type: row[7],
            sale_date: new Date(row[8]).toLocaleDateString(),
            price: row[9],
            latitude: row[10],
            longitude: row[11],
          });
        }
        this.allData = this.userArray;
        this.dataSource = new MatTableDataSource(this.userArray.slice(0, 5));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  onPageChanged(e: any) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.dataSource = this.userArray.slice(firstCut, secondCut);
  }

  reset () {
    this.userArray = this.allData;
    this.dataSource = this.userArray.splice(0, 5)
  }

  onSubmit() {
    var temp = this.searchSection.value;
    var data = this.allData.map( (el: any) => { 
      var s = false;
      var w = true;
      if( ( temp['city'] && temp['city'] == el['city']) ) { s = true}
      else if ( temp['city'] && temp['city'] !== el['city'] )  { w = false }

      if( ( temp['state'] && temp['state'] == el['state']) ) { s = true }
      else if( ( temp['state'] && temp['state'] !== el['state']) ) { w = false }

      if( ( temp['beds'] && temp['beds'] == el['beds']) ) { s = true }
      else if( ( temp['beds'] && temp['beds'] !== el['beds']) ) { w = false }

      if( ( temp['baths'] && temp['baths'] == el['baths']) ) { s = true }
      else if( ( temp['baths'] && temp['baths'] !== el['baths']) ) { w = false }

      if ( s && w) return el 
    }).filter(Boolean);
    if ( data.length > 0) {
      this.userArray = data
      this.dataSource = data.slice(0, this.pageSize);
    }
    else {
      alert("No Record Found")
    }
  }
}
 