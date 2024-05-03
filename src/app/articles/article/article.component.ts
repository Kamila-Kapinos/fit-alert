import { Component } from '@angular/core';
import { ArticlesService } from './services/articles.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {
  articles: any;
  article: any;
  src: string = '';
  alt: string = '';
  footer: string = '';
  articleID: string | null | undefined;
  constructor(
    public articleService: ArticlesService,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.articleID = this.activatedRoute.snapshot.paramMap.get('articleID');
    console.log('article id: ', this.articleID);

    this.articleService
      .queryArticle(this.articleID)
      .then((article) => {
        this.articles = article;
        this.article = this.articles[0];
        console.log(this.article);
        this.src = this.article['article-img-url'];
        this.alt = this.article['article-img-alt'];
        this.footer = this.article['article-footer'];
      })
      .catch(() => {
        console.log('failed to get article with id: ', this.articleID);
      });
  }
}
