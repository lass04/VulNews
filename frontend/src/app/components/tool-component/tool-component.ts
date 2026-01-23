import { VisitorNav } from './../visitor-nav/visitor-nav';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolService } from '../../core/services/tool/tool-svc';
import { Tool } from '../../interfaces/Tool';

@Component({
  selector: 'app-tool-component',
  imports: [VisitorNav,CommonModule],
  templateUrl: './tool-component.html',
  styleUrl: './tool-component.css',
})
export class ToolComponent {
    
  tool!: Tool;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private toolSvc: ToolService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.toolSvc.getToolById(id).subscribe(res => {
        this.tool = res.data;
        this.loading = false;
      });
    }
  }
}

