import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import ePub from 'epubjs';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NzSelectModule, LoaderComponent],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {
  authorForm: FormGroup;
  bookMediaPreviews: string[] = [];
  selectedCategories: string[] = [];
  pdfPreviewUrl: any;
  selectedPdfName: string | null = null;
  coverImagePreview: string | null = null;
  audioPreviewUrl: any;
  selectedAudioName: string | null = null;
  categories: any[] = [];
  loading: boolean = false
  coverImage: any
  pdf: any
  audio: any
  bookMedia: File[] = []
  bookId: number | undefined;
  bookData!: any;
  epubViewer: any
  authors: any[] = []
  constructor(private fb: FormBuilder, private router: Router, private sanitizer: DomSanitizer, private service: SharedService, private toster: NzMessageService, private route: ActivatedRoute) {
    this.authorForm = this.fb.group({
      title: ['', [Validators.required, NoWhitespaceDirective.validate]],
      type: ['', [Validators.required, NoWhitespaceDirective.validate]],
      categoryIds: [[], [Validators.required, NoWhitespaceDirective.validate]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      costPrice: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      stock: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      coverImage: [''],
      pdfUrl: [''],
      description: ['', [Validators.required, NoWhitespaceDirective.validate]],
      bookMedia: [null],
      audioUrl: [null],
      author: ['', [Validators.required]]
    });

    this.route.queryParams.subscribe(params => {
      this.bookId = params['id'];
    })
  }

  ngOnInit() {
    this.getCategory()
    this.getAuthors()
    if (this.bookId) {
      this.getBookById()
    }
  }

  onTypeChange(event: any) {
    this.pdf = null
    this.pdfPreviewUrl = null
    this.epubViewer = null
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.coverImage = file
    }
  }

  removeCoverImage() {
    this.coverImagePreview = this.coverImage = null
  }

  onPdfUpload(event: any) {
    const file = event.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      this.selectedPdfName = file.name;
      this.pdf = file;

      if (file.type === 'application/epub+zip' || file.name.endsWith('.epub')) {
        this.epubViewer = ePub(url);
        // this.epubViewer.renderTo("epub-container", { width: "100%", height: "500px" });
      } else {
        this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    }
  }

  removePdf() {
    this.pdfPreviewUrl = this.pdf = this.selectedAudioName = null
  }

  onAudioUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.audioPreviewUrl = URL.createObjectURL(file);
      this.selectedAudioName = file.name;
      this.audio = file
    }
  }
  removeAudio() {
    this.audioPreviewUrl = this.selectedAudioName = this.audio = null;
  }

  onBookMediaUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      let mediaArray: File[] = this.authorForm.get('bookMedia')?.value || [];
      Array.from(files).forEach((file: any) => {
        mediaArray.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.bookMediaPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
      this.bookMedia = [...this.bookMedia, ...mediaArray];
    }
  }

  /*************  ✨ Codeium Command 🌟  *************/
  removeBookMedia(index: any) {
    const id = this.bookData.bookMedia?.find((item: any, i: any) => i === index)?.id;
    if (id) {
      this.service.delete(`deleteImages/${id}`).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            this.bookMedia.splice(index, 1);
            this.bookMediaPreviews.splice(index, 1);
            this.bookData.bookMedia?.splice(index, 1);
          } else {
            this.loading = false;
            this.toster.warning(res.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error);
        }
      });
    }
  }

  onSubmit() {
    if (this.authorForm.invalid || !this.coverImage || !this.pdf) {
      this.authorForm.markAllAsTouched()
      return
    }
    this.loading = true;
    let formData = new FormData()
    formData.append('title', this.authorForm.value.title.trim())
    formData.append('categoryIds', this.authorForm.value.categoryIds)
    formData.append('price', this.authorForm.value.price)
    formData.append('costPrice', this.authorForm.value.costPrice)
    formData.append('stock', this.authorForm.value.stock)
    formData.append('description', this.authorForm.value.description.tr)
    formData.append('type', this.authorForm.value.type)
    formData.append('authorId', this.authorForm.value.author)
    if (this.coverImage && this.coverImage instanceof File) {
      formData.append('coverImage', this.coverImage)
    }
    if (this.pdf && this.pdf instanceof File) {
      formData.append('pdfUrl', this.pdf)
    }
    if (this.audio && this.audio instanceof File) {
      formData.append('audioUrl', this.audio)
    }
    if (this.bookMedia.length > 0) {
      for (let i = 0; i < this.bookMedia.length; i++) {
        formData.append('bookMedia', this.bookMedia[i])
      }
    }

    let apiUrl = ''
    if (this.bookId) {
      apiUrl = `editBook`
      formData.append('id', this.bookId.toString())

      this.service.update(apiUrl, formData).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            this.router.navigateByUrl('/home/e-book');
          } else {
            this.loading = false;
            this.toster.warning(res.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error);
        }
      });

    } else {

      apiUrl = 'createBook'
      this.service.postAPI(apiUrl, formData).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            this.router.navigateByUrl('/home/e-book');
          } else {
            this.loading = false;
            this.toster.warning(res.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error);
        }
      });
    }
  }

  getCategory() {
    this.service.getApi('getAllCategory').subscribe({
      next: (resp: any) => {
        this.categories = resp.category;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getAuthors() {
    this.service.getApi('getAllAuthor').subscribe({
      next: (resp: any) => {
        this.authors = resp.authors;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getBookById() {
    this.loading = true
    let apiUrl = `getAllEbook/${this.bookId}`
    this.service.getApi(apiUrl).subscribe({
      next: async (resp: any) => {
        this.bookData = resp.book;
        this.authorForm.patchValue({
          title: this.bookData.title,
          categoryIds: this.bookData.books.map((_e: any) => _e.category.id),
          price: this.bookData.price,
          costPrice: this.bookData.costPrice,
          stock: this.bookData.stock,
          description: this.bookData.description,
          type: this.bookData.type,
          author: this.bookData.authorId
        });

        this.pdf = this.bookData.pdfUrl;
        // if (pdfUrl) {
        //   fetch(pdfUrl)
        //     .then(response => response.blob())
        //     .then(blob => {
        //       const file = new File([blob], pdfUrl.split('/').pop()!, {
        //         lastModified: Date.now(),
        //         type: blob.type,
        //       })
        //       this.pdf = file
        //     })
        // }
        // const response = await fetch(this.bookData.pdfUrl);
        // const blob = await response.blob();
        // const file = new File([blob], item.url, {
        //   type: 'image/jpeg',
        // });
        // if (file) {
        //   this.ImageForUpload.push(file)
        // }
        this.epubViewer = ePub(this.bookData.pdfUrl);
        this.coverImage = this.bookData.coverImage
        this.audio = this.bookData.audioUrl
        this.coverImagePreview = this.bookData.coverImage;
        this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.bookData.pdfUrl);
        this.selectedCategories = this.bookData.books.map((_e: any) => _e.category.id);
        this.bookMediaPreviews = this.bookData.bookMedia!.map((_e: any) => _e.mediaUrl);
        if (this.bookData.audioUrl) {
          this.audioPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.bookData.audioUrl);
        }
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }
}

export class NoWhitespaceDirective {
  static validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { required: true };
    }
    return null;
  }
}
