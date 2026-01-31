import { Comment } from './../../interfaces/Comment';
import { CommentService } from './../../core/services/comment/comment-svc';
import { Navbar } from './../../components/navbar/navbar';
import { User } from './../../interfaces/User';
import { AuthService } from './../../core/services/auth/auth-service';
import { FormsModule } from '@angular/forms';
import { Post } from './../../interfaces/Post';
import { PostService } from './../../core/services/post/post-svc';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-community',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './community.html'
})
export class Community implements OnInit {
  posts: Post[] = [];
  newPostContent: string = '';
  isSubmitting: boolean = false;
  loading: boolean = true;
  
  private authSvc = inject(AuthService);
  private PostSvc = inject(PostService);
  private CommentSvc = inject(CommentService);
  currentUser!: User;

  constructor() {}

  ngOnInit() {
    this.currentUser = this.authSvc.getUser();
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.PostSvc.getPosts().subscribe({
      next: (res) => {
        this.posts = res.data;
        this.posts.forEach(post => {
          // Check if current user has liked this post
          post.likedByMe = post.reactions.includes(this.currentUser._id);
          
          // Initialize showComments flag
          post.showComments = false;
          
          // Load comments for each post
          this.CommentSvc.getPostComments(post._id).subscribe(
            (res) => {post.comments = res.data;console.log(res.data)}
          );
        });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  submitPost() {
    if (!this.newPostContent.trim()) return;
    
    this.isSubmitting = true;
    const newPost = { 
      content: this.newPostContent, 
      authorName: 'Current User' 
    };
    
    this.PostSvc.createPost(newPost).subscribe({
      next: (post) => {
        this.posts.unshift(post as Post);
        this.newPostContent = '';
        this.isSubmitting = false;
      },
      error: () => this.isSubmitting = false
    });
  }

  toggleLike(post: Post) {
    if (!post._id) return;
    
    const wasLiked = post.likedByMe;
    
    // Optimistically update UI
    post.likedByMe = !post.likedByMe;
    
    if (wasLiked) {
      // Remove like
      const index = post.reactions.indexOf(this.currentUser._id);
      if (index > -1) {
        post.reactions.splice(index, 1);
      }
    } else {
      // Add like
      post.reactions.push(this.currentUser._id);
    }
    
    // Send request to server
    this.PostSvc.LikePost(this.currentUser._id, post._id).subscribe({
      error: () => {
        // Revert on error
        post.likedByMe = wasLiked;
        
        if (wasLiked) {
          post.reactions.push(this.currentUser._id);
        } else {
          const index = post.reactions.indexOf(this.currentUser._id);
          if (index > -1) {
            post.reactions.splice(index, 1);
          }
        }
      }
    });
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  addComment(post: Post) {

    if (!post.newComment?.trim() || !post._id) return;
    
    const payload = {
      content: post.newComment,
      author: this.currentUser._id,
      post: post._id
    };
    
    this.CommentSvc.createComment(payload).subscribe({
      next: (res) => {
        post.comments = post.comments || [];
        post.comments.push(res.data);
        post.newComment = '';
      }
    });
  }

   deleteComment(post: Post, comment: Comment) {
    if (!comment._id) return;
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    this.CommentSvc.deleteComment(comment._id).subscribe({
      next: () => {
        // Remove comment from the post's comments array
        const index = post.comments?.findIndex(c => c._id === comment._id);
        if (index !== undefined && index > -1 && post.comments) {
          post.comments.splice(index, 1);
        }
      },
      error: (err) => {
        console.error('Failed to delete comment:', err);
        alert('Failed to delete comment. Please try again.');
      }
    });
  }

  canDeleteComment(comment: Comment): boolean {
    // User can delete their own comments or admins can delete any comment
    return comment.author._id === this.currentUser._id || 
           this.currentUser.role === 'admin';
  }
}