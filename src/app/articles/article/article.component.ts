import { Component } from '@angular/core';
import { ArticlesService } from './services/articles.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {
  articles:any;
  article:any;
  src:string='';
  alt:string='';
  footer:string='';
  constructor (public articleService:ArticlesService){

  }

  ngOnInit():void{
    this.articleService.getArticles()
      .then((ar)=>{
        this.articles = ar;console.log("success getting articles!");
        this.article = this.articles[0]
        console.log(this.article)
        this.src = this.article['article-img-url'];
        this.alt = this.article['article-img-alt'];
        this.footer = this.article['article-footer'];
      })
      .catch(()=>{console.log("error getting articles")})
  }
}
