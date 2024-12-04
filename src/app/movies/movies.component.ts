import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MoviesTmdbServiceImpl} from './services/movies-tmdb.service.impl';
import {MoviesRequest} from './dtos/movies-request';
import {Movie} from './dtos/movie';
import {Pagination} from '../commons/dtos/pagination';
import {environment} from '../../environments/environment';
import {
    distinctUntilChanged,
    filter,
    Observable, startWith,
    Subject,
    switchMap,
    takeUntil,
    tap
} from 'rxjs';
import {DatePipe, NgIf, UpperCasePipe} from '@angular/common';
import {Language} from './dtos/language';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {getFibonacci, isPrimeNumber} from '../commons/utils/math.util';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';

const BG_COLORS = ['#a00709', '#a16b09'];
const DEFAULT_FILTERS: MoviesRequest = {
    page: 1,
    category: 'popular',
    language: 'en',
    bgRule: 'odd_even'
};

@Component({
    selector: 'app-movies',
    imports: [
        DatePipe,
        UpperCasePipe,
        FormsModule,
        ReactiveFormsModule,
        InfiniteScrollDirective,
        NgIf,
    ],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.css',
    encapsulation: ViewEncapsulation.None
})
export class MoviesComponent implements OnInit, OnDestroy {
    moviesPagination: Pagination<Movie> = {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0
    };

    languages: Language[] = [
        {id: 'en', name: 'English'},
        {id: 'es', name: 'Spanish'},
        {id: 'fr', name: 'French'},
    ];

    bgRules: Language[] = [
        {id: 'odd_even', name: 'Odd/Even'},
        {id: 'fibonacci', name: 'Fibonacci'},
        {id: 'prime_numbers', name: 'Prime Numbers'},
    ];

    moviesFiltersForm!: FormGroup;
    imagesPath = environment.imagesBaseUrl;
    loading = false;
    destroy$ = new Subject<void>();
    allMovies: Movie[] = [];

    constructor(private readonly moviesService: MoviesTmdbServiceImpl) {}

    ngOnInit() {
        this.moviesFiltersForm = new FormGroup({
            category: new FormControl(DEFAULT_FILTERS.category),
            language: new FormControl(DEFAULT_FILTERS.language),
            bgRule: new FormControl(DEFAULT_FILTERS.bgRule),
            page: new FormControl(DEFAULT_FILTERS.page),
        });

        this.movieFilters$.pipe(
            takeUntil(this.destroy$),
            tap(() => this.loading = true),
            switchMap((filters) => this.moviesService.findAll(filters))
        ).subscribe({
            next: (resp) => {
                this.allMovies = [...this.allMovies, ...resp.results];
                this.moviesPagination = resp;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    get movieFilters$(): Observable<MoviesRequest> {
        return this.moviesFiltersForm.valueChanges.pipe(
            startWith(DEFAULT_FILTERS),
            distinctUntilChanged(),
            filter(() => !this.loading)
        );
    }

    onImageLoad(placeholder: HTMLElement) {
        placeholder.style.display = 'none'
    }

    onErrorLoadingImage(movieImage: HTMLElement, loadingPlaceholder: HTMLElement, noImagePlaceholder: HTMLElement) {
        movieImage.style.display = 'none';
        loadingPlaceholder.style.display = 'none';

        noImagePlaceholder.style.display = 'flex';
        noImagePlaceholder.innerText = 'No image loaded'
    }

    getFibonacciColor(index: number): string {
        const fib = getFibonacci(index);

        return BG_COLORS[fib % BG_COLORS.length];
    }

    getRuleColor(index: number) {
        const bgRule = this.moviesFiltersForm.get('bgRule')?.value;

        if (bgRule === 'fibonacci') return this.getFibonacciColor(index);

        if (bgRule === 'prime_numbers') return isPrimeNumber(index) ? BG_COLORS[0] : BG_COLORS[1];

        return index % 2 === 0 ? BG_COLORS[1] : BG_COLORS[0];
    }

    onScroll() {
        if (
            !this.loading &&
            this.moviesPagination.page < this.moviesPagination.total_pages
        ) {
            const page = (this.moviesFiltersForm.get('page')?.value || 1) + 1;
            this.moviesFiltersForm.patchValue({page});
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
