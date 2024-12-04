import {Observable} from 'rxjs';
import {Pagination} from '../../commons/dtos/pagination';
import {MoviesRequest} from '../dtos/movies-request';
import {Movie} from '../dtos/movie';

export interface MoviesService {
    findAll(req: MoviesRequest): Observable<Pagination<Movie>>;
}