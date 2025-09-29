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
  * [List of links to pictures](#list-of-links-to-pictures)
  * [JSON format](#json-format)

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

### List of links to pictures

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
                style="[...]"
                alt="{{ $imageAlt }}" />
            </a>
          {{ else }}
            <img
              loading="{{ $loading }}"
              src="{{ $imageUrl }}"
              class="img"
              style="[...]"
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


### JSON format

Previous shortcode did not accept the link to redirect to, nor the `alt`-ernative text if the picture is not found.

With `layouts/shortcodes/slider-external-json.html` we add those features.

```go
{{ $loading := .Get "loading" | default "lazy" }}
{{ $zoomable := .Get "zoomable" | default "true" }}

{{ $jsonData := .Inner | transform.Unmarshal }}
{{ if $jsonData }}
<div class="swiper gallery-slider">
  <div class="swiper-wrapper">
    {{ range $index, $item := $jsonData }}
      {{ if $item.src }}
        {{ $href := $item.href | default $item.src }}
        {{ $alt := $item.alt | default $item.src }}
        
        <div class="swiper-slide {{ if eq $zoomable `true` }}zoomable{{ end }}">
          {{ if eq $zoomable `true` }}
            <a href="{{ $href }}" class="glightbox" style="display: block;">
              <img
                loading="{{ $loading }}"
                src="{{ $item.src }}"
                class="img"
                style="[...]"
                alt="{{ $alt }}" />
            </a>
          {{ else }}
            <img
              loading="{{ $loading }}"
              src="{{ $item.src }}"
              class="img"
              style="[...]"
              alt="{{ $alt }}" />
          {{ end }}
        </div>
      {{ else }}
        {{ errorf "Swiper gallery item %d is missing 'src' field" $index }}
      {{ end }}
    {{ end }}
  </div>
  <span class="swiper-button-prev"></span>
  <span class="swiper-button-next"></span>
</div>
{{ else }}
  {{ errorf "Invalid JSON in swiper_gallery shortcode: %s" .Inner }}
{{ end }}
```

Example usage:
- First and second image with all three fields explicitly set.
- Third image lacks `alt` field. Thus, it defaults to `src` field-value.
- Forth JSON object is missing `href` field. Therefore, it falls to `src`.
- Fifth picture contains only `src`. So rest of fields are default to the `src` value.
- The last image is called still with a valid JSON, it's like the previous picture but with a `src` not to be found (invalid URL) to test the `alt` display render directly (no need to inspect the HTML code rendered).

```go
{{</* slider-external-json loading="lazy" */>}}
[
  {
    "src": "https://hugocodex.org/uploads/slider/image1.jpg",
    "href": "https://hugocodex.org/add-ons/slider-carousel/",
    "alt": "Hugo Codex Slider/Carousel image 1"
  },
  {
    "src": "https://hugocodex.org/uploads/slider/image2.jpg",
    "href": "https://hugocodex.org/add-ons/slider-carousel/",
    "alt": "Hugo Codex Slider/Carousel image 2"
  },
  {
    "src": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
    "href": "https://www.pexels.com/photo/two-yellow-labrador-retriever-puppies-1108099/"
  },
  {
    "src": "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg",
    "alt": "Closeup Photo of Brown and Black Dog Face"
  },
  {
    "src": "https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg"
  },
  {
    "src": "URL_no_valid_for_testing"
  }
]
{{</* /slider-external-json */>}}
```

Which renders to next HTML.
Note the `data-swiper-slide-index` starts in 5, then 0 to 5, and ends in 0; do not overthink it, somehow this is how the slider JavaScript works.

{{< highlight html "lineNos=inline" >}}
<div class="swiper gallery-slider swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden">
  <div class="swiper-wrapper" [...]>
    <div class="swiper-slide zoomable swiper-slide-duplicate swiper-slide-prev"
         data-swiper-slide-index="5" [...]>
      <a href="URL_no_valid_for_testing" [...]>
        <img loading="lazy"
             class="img" style="[...]"
             src="URL_no_valid_for_testing"
             alt="URL_no_valid_for_testing">
      </a>
    </div>
    <div class="swiper-slide zoomable swiper-slide-active"
         data-swiper-slide-index="0" [...]>
      <a href="https://hugocodex.org/add-ons/slider-carousel/" [...]>
        <img loading="lazy"
             class="img" style="[...]"
             src="https://hugocodex.org/uploads/slider/image1.jpg"
             alt="Hugo Codex Slider/Carousel image 1">
      </a>
    </div>
    <div class="swiper-slide zoomable swiper-slide-next"
         data-swiper-slide-index="1" [...]>
      <a href="https://hugocodex.org/add-ons/slider-carousel/" [...]>
        <img loading="lazy"
             class="img" style="[...]"
             src="https://hugocodex.org/uploads/slider/image2.jpg"
             alt="Hugo Codex Slider/Carousel image 2">
      </a>
    </div>
    <div class="swiper-slide zoomable"
         data-swiper-slide-index="2" [...]>
      <a href="https://www.pexels.com/photo/two-yellow-labrador-retriever-puppies-1108099/" [...]>
        <img loading="lazy"
             class="img" style="[...]"
             src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
             alt="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg">
      </a>
    </div>
    <div class="swiper-slide zoomable"
         data-swiper-slide-index="3" [...]>
      <a href="https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg" [...]>
        <img loading="lazy"
             class="img" style="[...]"
             src="https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg"
             alt="Closeup Photo of Brown and Black Dog Face">
      </a>
    </div>
    <div class="swiper-slide zoomable"
         data-swiper-slide-index="4" [...]>
      <a href="https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg" [...]>
        <img loading="lazy"
             class="img" style="[...]"
             src="https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg"
             alt="https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg">
      </a>
    </div>
    <div class="swiper-slide zoomable swiper-slide-duplicate-prev"
         data-swiper-slide-index="5" [...]>
      <a href="URL_no_valid_for_testing" [...]>
        <img loading="lazy"
             class="img" style="[...]"
             src="URL_no_valid_for_testing"
             alt="URL_no_valid_for_testing">
      </a>
    </div>
    <div class="swiper-slide zoomable swiper-slide-duplicate swiper-slide-duplicate-active"
         data-swiper-slide-index="0"[...]>
      <a href="https://hugocodex.org/add-ons/slider-carousel/" [...]>
        <img loading="lazy"
             class="img" style="[...]"
             src="https://hugocodex.org/uploads/slider/image1.jpg"
             alt="Hugo Codex Slider/Carousel image 1">
      </a>
    </div>
  </div>
  <span class="swiper-button-prev" [...]></span>
  <span class="swiper-button-next" [...]></span>
  <span class="swiper-notification" [...]></span>
</div>
{{< /highlight >}}


Test the `href`s and `alt`s directly in:

{{< slider-external-json loading="lazy" >}}
[
  {
    "src": "https://hugocodex.org/uploads/slider/image1.jpg",
    "href": "https://hugocodex.org/add-ons/slider-carousel/",
    "alt": "Hugo Codex Slider/Carousel image 1"
  },
  {
    "src": "https://hugocodex.org/uploads/slider/image2.jpg",
    "href": "https://hugocodex.org/add-ons/slider-carousel/",
    "alt": "Hugo Codex Slider/Carousel image 2"
  },
  {
    "src": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
    "href": "https://www.pexels.com/photo/two-yellow-labrador-retriever-puppies-1108099/"
  },
  {
    "src": "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg",
    "alt": "Closeup Photo of Brown and Black Dog Face"
  },
  {
    "src": "https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg"
  },
  {
    "src": "URL_no_valid_for_testing"
  }
]
{{< /slider-external-json >}}

{{< rawhtml >}}
<div class="html-content">
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
</div>
{{< /rawhtml >}}
