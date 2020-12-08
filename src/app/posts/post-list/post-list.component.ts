import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'; // to store subscription created below
import { PageEvent } from '@angular/material/paginator';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // implement lifecycles
  // @Input() posts: Post[] = [];  // apply input decorator to listen for event from parent app; posts is now bound; also acts as conditional for directives in this html component

  // define props
  posts: Post[] = [];
  isLoading = false;
  // dummy value for pagination
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription; // type for storing subscription
  private authStatusSub: Subscription;

  // dependency injection of our services:
  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  // define lifecycle method and call service getter
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage); // get a list even though empty at start; add pagination params
    console.log('getPosts function was run');
    this.userId = this.authService.getUserId();
    // subscribe to postsService Subject and save to postsSub (rxjs Subscription)
    this.postsSub = this.postsService
      .getPostUpdateListener() // getPostsUpdateListener = my custom method
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });

    // this is a hack, since the subscription doesn't work if this page gets loaded after login; although it is the first page to be loaded on landing, before login; I don't get it, the header works with the subscription
    this.userIsAuthenticated = this.authService.getIsAuth();

    // subscribe to authService to check for logged in status
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }
  // pagination method
  onChangePage(pageData: PageEvent) {
    this.isLoading = true; // set spinner
    this.currentPage = pageData.pageIndex + 1; // pageData arg gets passed as $event from template
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage); // with dynamic pagination query params
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe(); // in order to prevent mem leaks
    this.authStatusSub.unsubscribe();
  }
}
