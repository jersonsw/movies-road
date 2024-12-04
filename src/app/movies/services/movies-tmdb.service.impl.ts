import {MoviesService} from './movies.service';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Pagination} from '../../commons/dtos/pagination';
import {MoviesRequest} from '../dtos/movies-request';
import {Movie} from '../dtos/movie';

@Injectable({
    providedIn: 'root'
})
export class MoviesTmdbServiceImpl implements MoviesService {

    constructor(private readonly httpClient: HttpClient) {
    }

    findAll(req: MoviesRequest): Observable<Pagination<Movie>> {
        const endpoint = this.buildEndpoint(req);

        return this.httpClient.get<Pagination<Movie>>(endpoint);
    }

    private buildEndpoint(req: MoviesRequest): string {
        return `${environment.apiUrl}/${req.category}?language=${req.language}&api_key=${environment.apiKey}&page=${req.page}`;
    }
}