import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'isbn';

  formgrp!: FormGroup;
  results!: Array<any>;
  timeoutId!: any;
  subscriptions!: Subscription;
  inprogress = false;
  recordsFound = 0;

  constructor(private http: HttpClient, private builder: FormBuilder){}

  ngOnInit(): void {
    this.subscriptions = new Subscription();
    this.formgrp = this.builder.group({
      search: new FormControl('')
    });
  }

  ngOnDestroy(): void {
    this.inprogress = false;
    this.subscriptions.unsubscribe();
  }

  onSearch() {
    if(!this.formgrp.controls['search'].value.trim()) {
      return;
    }
    this.results = [];

    this.inprogress = true;

    this.subscriptions.add(
    this.http.get(`https://openlibrary.org/search.json?q=${this.formgrp.controls['search'].value.trim()}&limit=10`)
    .subscribe({
        next: (response: any)=>{
          console.log(response);
          this.results = response.docs;
          this.recordsFound = response.numFound;
          this.inprogress = false;
        },
        error: (error: any) => {
          this.inprogress = false;
        }
      })
    );
  }

  getImageUrl(isbn: String): String {
    return `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  }
}
