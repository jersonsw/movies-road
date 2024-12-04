import {Component, OnInit} from '@angular/core';
import {MoviesTmdbServiceImpl} from '../services/movies-tmdb.service.impl';

@Component({
  selector: 'app-movies',
  imports: [],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit{
  constructor(private readonly moviesService: MoviesTmdbServiceImpl) {}

  ngOnInit() {
    this.moviesService.find().subscribe({
      next: (resp) => console.log('Resp', resp),
      error: (err) => console.log('Error', err),
    })
  }
}
