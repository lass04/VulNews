import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from './../../components/navbar/navbar';
import { Tool } from './../../interfaces/Tool';
import { ToolService } from './../../core/services/tool/tool-svc';
import { Category } from './../../interfaces/Category';
import { CategoryService } from './../../core/services/category/category-svc';

@Component({
  selector: 'app-tools',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './tools-component.html'
})
export class Tools implements OnInit {
  tools: Tool[] = [];
  filteredTools: Tool[] = [];
  categories: Category[] = [];
  
  loading: boolean = true;
  searchQuery: string = '';
  selectedCategory: string = 'all';
  
  // View mode
  viewMode: 'grid' | 'list' = 'grid';
  
  private toolSvc = inject(ToolService);
  private categorySvc = inject(CategoryService);

  constructor() {}

  ngOnInit() {
    this.loadCategories();
    this.loadTools();
  }

  loadCategories() {
    this.categorySvc.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  loadTools() {
    this.loading = true;
    this.toolSvc.getTools().subscribe({
      next: (res) => {
        this.tools = res.data;
        this.filteredTools = this.tools;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tools:', err);
        this.loading = false;
      }
    });
  }

  filterTools() {
    let result = [...this.tools];

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (this.selectedCategory !== 'all') {
      result = result.filter(tool =>
        tool.category.includes(this.selectedCategory)
      );
    }

    this.filteredTools = result;
  }

  onSearchChange() {
    this.filterTools();
  }

  onCategoryChange(categoryId: string) {
    this.selectedCategory = categoryId;
    this.filterTools();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  openTool(tool: Tool) {
    window.open(tool.link, '_blank');
  }

  getCategoryNames(categoryIds: string[]): string {
    if (!categoryIds || categoryIds.length === 0) return 'Uncategorized';
    
    const names = categoryIds
      .map(id => {
        const category = this.categories.find(c => c._id === id);
        return category?.title || '';
      })
      .filter(name => name);
    
    return names.join(', ') || 'Uncategorized';
  }

  getCategoryColor(categoryId: string): string {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-orange-100 text-orange-800',
    ];
    
    // Use category ID to consistently assign colors
    const index = categoryId ? categoryId.charCodeAt(categoryId.length - 1) % colors.length : 0;
    return colors[index];
  }

  getToolInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.filteredTools = this.tools;
  }

  getResultsText(): string {
    const total = this.tools.length;
    const filtered = this.filteredTools.length;
    
    if (filtered === total) {
      return `Showing all ${total} tools`;
    }
    return `Showing ${filtered} of ${total} tools`;
  }

  // Check if image URL is valid
  hasValidImage(tool: Tool): boolean {
    return !!(tool.image && tool.image.trim() && tool.image.startsWith('http'));
  }

  // Handle image error
  onImageError(event: any) {
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }
}
