---
title: "Hugo Plugins"
description: "Step-by-step guide to add gallery slider functionality to Hugo for local and online images."
keywords: ["Hugo Scroll theme", "gallery slider", "gethugothemes", "Hugo modules", "image slider", "Swiper.js", "GLightbox", "Hugo shortcodes", "static site", "web development", "theme customization", "image galleries", "Hugo plugins", "Hugo add-ons", "frontend assets", "responsive design", "Hugo tutorials", "Jamstack", "content management", "web design", "developer tools", "step-by-step guide", "blogging", "open source"]
---

Hugo Scroll theme has no gallery shortcode.
Some alternatives are discussed in [#70](https://github.com/zjedi/hugo-scroll/issues/70).
We will pick the **gallery-slider** from [gethugothemes/hugo-modules](https://github.com/gethugothemes/hugo-modules/blob/master/gallery-slider/README.md).

This post is quite short. Index:

* [Installation](#installation)
  * [Modules](#modules)
  * [Plugins](#plugins)
* [Usage](#usage)
* [Online images](#online-images)

## Installation

Follow the steps of [gethugothemes/hugo-modules](https://github.com/gethugothemes/hugo-modules/blob/master/gallery-slider/README.md).

### Modules

`$EDITOR hugo.toml`. Add the gallery-slider module:

```toml
[[module.imports]]
  path = "github.com/gethugothemes/hugo-modules/gallery-slider"
  disable = false
```

For example, a Hugo Scroll theme user needs:

```toml
[module]
  proxy = "direct"
  [module.hugoVersion]
    extended = true
    min = "0.132.0"
  [[module.imports]]
    path = "github.com/zjedi/hugo-scroll"
    disable = false
  [[module.imports]]
    path = "github.com/gethugothemes/hugo-modules/gallery-slider"
    disable = false
```

Note. The Hugo Scroll theme installation via Hugo modules was explained [here](/blogs/create_hugo_website/#from-git-submodule-to-hugo-module).

Then run:

```sh
hugo mod get github.com/gethugothemes/hugo-modules/gallery-slider@latest
```

Check it with `hugo mod graph`.

```text
> hugo mod graph
project github.com/zjedi/hugo-scroll@v0.0.0-20250604223730-54f7b8543f18+vendor
project github.com/gethugothemes/hugo-modules/gallery-slider@v0.0.0-20250702070945-cd8319c6b26e+vendor
```

**Optionally** run `hugo mod vendor` to create a local copy:

```text
> tree _vendor/github.com/gethugothemes/hugo-modules/gallery-slider/
_vendor/github.com/gethugothemes/hugo-modules/gallery-slider/
├── assets
│   ├── css
│   │   └── gallery-slider.css
│   ├── js
│   │   └── gallery-slider.js
│   ├── plugins
│   │   ├── glightbox
│   │   │   ├── glightbox.css
│   │   │   └── glightbox.js
│   │   └── swiper
│   │       ├── swiper-bundle.css
│   │       └── swiper-bundle.js
│   └── scss
│       └── gallery-slider.scss
└── layouts
    ├── partials
    │   ├── gallery.html
    │   ├── image-pipe.html
    │   └── slider.html
    └── shortcodes
        ├── gallery.html
        └── slider.html
```


### Plugins

`$EDITOR hugo.toml` and add

```toml
[[params.plugins.css]]
link = "plugins/swiper/swiper-bundle.min.css"
[[params.plugins.css]]
link = "plugins/glightbox/glightbox.min.css"
[[params.plugins.js]]
link = "plugins/swiper/swiper-bundle.min.js"
[[params.plugins.js]]
link = "plugins/glightbox/glightbox.min.js"
[[params.plugins.js]]
link = "js/gallery-slider.js"
```

As [#16](https://github.com/gethugothemes/hugo-modules/issues/16) points out, just previous steps are not enough:

>  I didn't get `glightbox.js` or `glightbox.css` files in `static` folder of my project

The guide misses next step:
> I managed to figure out how to implement. All resources should be processed with a hugo pipeline.

Lets do it.
`$EDITOR layouts/partials/custom_head.html` to append:

```go
{{ $swiperCSS := resources.Get "plugins/swiper/swiper-bundle.css" }}
{{ $glightboxCSS := resources.Get "plugins/glightbox/glightbox.css" }}
{{ $gallerySliderCSS := resources.Get "css/gallery-slider.css" }}
{{ $swiperJS := resources.Get "plugins/swiper/swiper-bundle.js" }}
{{ $glightboxJS := resources.Get "plugins/glightbox/glightbox.js" }}
{{ $gallerySliderJS := resources.Get "js/gallery-slider.js" }}

{{ if $swiperCSS }}<link rel="stylesheet" href="{{ $swiperCSS.RelPermalink }}">{{ end }}
{{ if $glightboxCSS }}<link rel="stylesheet" href="{{ $glightboxCSS.RelPermalink }}">{{ end }}
{{ if $gallerySliderCSS }}<link rel="stylesheet" href="{{ $gallerySliderCSS.RelPermalink }}">{{ end }}

{{ if $swiperJS }}<script src="{{ $swiperJS.RelPermalink }}"></script>{{ end }}
{{ if $glightboxJS }}<script src="{{ $glightboxJS.RelPermalink }}"></script>{{ end }}
{{ if $gallerySliderJS }}<script src="{{ $gallerySliderJS.RelPermalink }}"></script>{{ end }}
```

Actually also enable a initializer:

```go
{{ $gallerySliderInitJS := resources.Get "js/gallery-slider-init.js" | minify | fingerprint }}
<script src="{{ $gallerySliderInitJS.RelPermalink }}" defer></script>
```

`$EDITOR assets/js/gallery-slider-init.js`:

```js
// Wait for the page to fully load and content to be rendered
function initializeSliders() {
  const sliders = document.querySelectorAll('.gallery-slider');
  console.log('Found sliders to initialize:', sliders.length);
  
  sliders.forEach(slider => {
    // Skip if already initialized
    if (slider.swiper) {
      console.log('Slider already initialized');
      return;
    }
    
    // Initialize Swiper
    try {
      const swiper = new Swiper(slider, {
        slidesPerView: 1,
        loop: true,
        spaceBetween: 30,
        navigation: {
          nextEl: slider.querySelector('.swiper-button-next'),
          prevEl: slider.querySelector('.swiper-button-prev'),
        },
        on: {
          init: function() {
            console.log('Swiper initialized successfully!');
          }
        }
      });
    } catch (error) {
      console.error('Swiper initialization error:', error);
    }
  });
}

// Initialize after a short delay to ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure shortcodes are rendered
    setTimeout(initializeSliders, 100);
  });
} else {
  // DOM already loaded, but wait for shortcodes
  setTimeout(initializeSliders, 100);
}

// Also try after all resources are loaded
window.addEventListener('load', function() {
  setTimeout(initializeSliders, 200);
});

// MutationObserver as fallback for dynamically added content
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        // Check if any new nodes contain sliders
        const hasNewSliders = Array.from(mutation.addedNodes).some(node => {
          return node.nodeType === 1 && (
            node.classList?.contains('gallery-slider') || 
            node.querySelector?.('.gallery-slider')
          );
        });
        if (hasNewSliders) {
          setTimeout(initializeSliders, 50);
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
```


## Usage

In a markdown file use the `slider` shortcode via `{{</* slider dir="images/...." */>}}`:

For example my [Instagram mosaic generator](/blogs/instagram_mosaic) post has next images.
Move your cursor inside the picture to see the right arrow, then click it.

{{< slider dir="images/blogs/instagram_mosaic">}}

More parameters can be passed. Check:
- The slider shortcode parameters at [gethugothemes/hugo-modules](https://github.com/gethugothemes/hugo-modules/blob/master/gallery-slider/README.md#slider-1)
- My post about [Hugo shortcodes](/blogs/hugo_shortcodes)

The arrows to slide might need customization. The white color can be confused with the background of the picture.

In `layouts/partials/custom_head.html` we could edit the style, since the arrow color is defined via a SCSS variable:
```css
:root {
  [...]
  --swiper-navigation-color: #246B9F;
}
```

Though this has no effect.
Inspecting in the browser we check that the 
~~`color: var(--swiper-navigation-color, var(--swiper-theme-color))`~~ field-value of `.swiper-button-next` is striked.
I.e. this SCSS is overridden by a more specific rule.

In that same HTML file add in `<style>`:

```css
.gallery-slider .swiper-button-next::after,
.gallery-slider .swiper-button-prev::after {
  color: #ffffff;
  background-color: #246B9F;
  border-radius: 100%;
}
```


## Online images

To use non-local images create a new shortcode.

`$EDITOR layouts/shortcodes/slider-external.html` with code:

```go
{{ $loading := .Get "loading" | default "lazy" }}
{{ $zoomable := .Get "zoomable" | default "true" }}

<div class="swiper gallery-slider">
  <div class="swiper-wrapper">
    {{ range $index := seq 1 20 }}
      {{ $imageParam := printf "image%d" $index }}
      {{ $imageUrl := $.Get $imageParam }}
      {{ if $imageUrl }}
        {{ $altParam := printf "alt%d" $index }}
        {{ $imageAlt := $.Get $altParam | default (printf "Image %d" $index) }}
        
        <div class="swiper-slide {{ if eq $zoomable `true` }}zoomable{{ end }}">
          {{ if eq $zoomable `true` }}
            <a href="{{ $imageUrl }}" class="glightbox" style="display: block;">
              <img
                loading="{{ $loading }}"
                src="{{ $imageUrl }}"
                class="img"
                style="margin: 0; width: 100%; height: auto;"
                alt="{{ $imageAlt }}" />
            </a>
          {{ else }}
            <img
              loading="{{ $loading }}"
              src="{{ $imageUrl }}"
              class="img"
              style="margin: 0; width: 100%; height: auto;"
              alt="{{ $imageAlt }}" />
          {{ end }}
        </div>
      {{ end }}
    {{ end }}
  </div>
  <span class="swiper-button-prev"></span>
  <span class="swiper-button-next"></span>
</div
```

Example usage:

```go
{{</* slider-external 
    image1="https://hugocodex.org/uploads/slider/image1.jpg"
    image2="https://hugocodex.org/uploads/slider/image2.jpg"
    */>}}
```

Which renders to:

{{< slider-external 
    image1="https://hugocodex.org/uploads/slider/image1.jpg"
    image2="https://hugocodex.org/uploads/slider/image2.jpg"
    >}}


Btw. This images are courtesy of https://hugocodex.org/add-ons/slider-carousel/,
another alternative suggested in [#70](https://github.com/zjedi/hugo-scroll/issues/70).

{{< rawhtml >}}
<div class="html-content">
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
</div>
{{< /rawhtml >}}
