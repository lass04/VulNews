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
          post.reactions.forEach(ele=>{post.likedByMe = ele._id===this.currentUser._id});
          
          // Initialize showComments flag
          post.showComments = false;
          
          // Load comments for each post
          this.CommentSvc.getPostComments(post._id).subscribe(
            (res) => {post.comments = res.data}
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
      author: this.currentUser._id
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
    
    
    if (wasLiked) {
      // Remove like
      const index = post.reactions.indexOf(this.currentUser);
      if (index > -1) {
        this.PostSvc.UnlikePost(this.currentUser._id,post._id).subscribe({
          next: () => {
                   post.reactions.splice(index, 1);
                   post.likedByMe = !post.likedByMe;
          },
          error: () => {alert("Cannot Unlike post")}
        });
 
      }
    } else {
      this.PostSvc.LikePost(this.currentUser._id,post._id).subscribe({
          next: () => {
                   post.reactions.push(this.currentUser);
                   post.likedByMe = !post.likedByMe;
          },
          error: () => {alert("Cannot Like post")}
        });
      
    }
    
    
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

  deletePost(post: Post) {
    if (!post._id) return;
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    this.PostSvc.deletePost(post._id).subscribe({
      next: () => {
        // Remove comment from the post's comments array
        const index = this.posts.findIndex(p => p._id === post._id);
        if (index !== undefined && index > -1 && this.posts) {
          this.posts.splice(index, 1);
        }
      },
      error: (err) => {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post. Please try again.');
      }
    });
  }

  canDeletePost(post: Post): boolean {
    // User can delete their own comments or admins can delete any comment
    return post.author._id === this.currentUser._id || 
           this.currentUser.role === 'admin';
  }

}