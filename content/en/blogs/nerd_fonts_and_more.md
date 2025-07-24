---
title: "😎 Fonts globally & for Hugo"
---

Next **fonts** look **great**. Follow this guide to install them **global**ly and even in your **Hugo** website.

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <img
    src="https://www.nerdfonts.com/assets/img/nerd-fonts-patched-fonts.svg"
    style="width:50%;"
    class="circular-bg"
    alt="Preview of Patched Fonts"
    >
</div>
{{< /rawhtml >}}


## Global Nerd Fonts

**Install** steps:

- Install *Nerd Fonts* **dependencies**: `sudo apt-get install -y ruby-dev gcc make`
- Add the **code below** to your `~/.bashrc`
- Preview fonts [here](https://www.nerdfonts.com/font-downloads)
- **Install** the selected, e.g. `nerd_fonts_install "Iosevka"` for the [Iosevka](https://github.com/be5invis/Iosevka/releases/latest) font
- **Use** the picked font in **programs** like [LibreOffice](https://www.libreoffice.org/)!

```sh
nerd_fonts_install() {
  # Install Nerd Fonts from release archives
  # Example usage: nerd_fonts_install "Iosevka"
  # Default font: JetBrainsMono
  
  # Check if any argument was supplied or use default font
  local font_to_install="${1:-JetBrainsMono}"

  # Download files/dirs and fonts directory
  local DOWNLOAD_DIR=$HOME/Downloads
  local FONT_FILE="$DOWNLOAD_DIR/$font_to_install.tar.xz"
  local TEMP_EXTRACT_DIR="$DOWNLOAD_DIR/${font_to_install}_nerd_fonts_temp"
  local FONT_DIR=$HOME/.local/share/fonts

  # Check if the font files already exist in the font directory
  if [ -d "$FONT_DIR" ] && [ -n "$(find "$FONT_DIR" -name "*$font_to_install*" -print -quit)" ]; then
    echo "$font_to_install fonts are already installed."
    return 0
  fi

  # Download if needed
  if [ ! -f "$FONT_FILE" ]; then
      echo "Downloading $font_to_install fonts..."
      if ! curl -L "https://github.com/ryanoasis/nerd-fonts/releases/latest/download/$font_to_install.tar.xz" -o "$FONT_FILE"; then
          echo "Error: Failed to download font" >&2
          return 1
      fi
  else
    echo "$FONT_FILE already exists."
  fi

  # Create and extract to temp directory
  mkdir -p "$TEMP_EXTRACT_DIR"
  echo "Extracting fonts to temporary directory..."
  if ! tar -xvf "$FONT_FILE" -C "$TEMP_EXTRACT_DIR"; then
    echo "Error: Failed to extract archive" >&2
    rm -rf "$TEMP_EXTRACT_DIR"
    return 1
  fi

  # Install
  mkdir -p "$FONT_DIR"
  find "$TEMP_EXTRACT_DIR" -type f \
    \( -iname "*$font_to_install*.ttf" -o -iname "*$font_to_install*.otf" \) \
    -exec mv -n {} "$FONT_DIR/" \;

  # Cleanup
  rm -f "$FONT_FILE"
  rm -rf "$TEMP_EXTRACT_DIR"

  # Update the font cache
  echo "Updating font cache..."
  fc-cache -f -v

  # Verify installation
  echo "Verifying installation..."
  fc-list | grep "$font_to_install"

  echo -e "\nSuccessfully installed $font_to_install Nerd Font"
}
```

The function structure is:
  1. **Download** the compressed archive as in [official install option 1 - Release Archive Download](https://github.com/ryanoasis/nerd-fonts#option-1-release-archive-download)
  2. **Extract** it into `~/.local/share/fonts` as in [official install option 6 - Ad Hoc Curl Download](https://github.com/ryanoasis/nerd-fonts#option-6-ad-hoc-curl-download), but without patches
  3. **Update** the **font cache**

*Nerd Fonts* references
  - [Web](https://www.nerdfonts.com/)
  - [Github](https://github.com/ryanoasis/nerd-fonts)
  - [Wiki](https://github.com/ryanoasis/nerd-fonts/wiki)

### More fonts

*Nerd Fonts* offers a broad variety of fonts. Check the [list](https://www.nerdfonts.com/font-downloads)! It features lots of glyphs (icons) too.
Though **propetary** fonts are **not** included.

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
 <span>Let's install </span>
 <span class="great-vibes">Great Vibes</span> 
 <span>  font from </span>
 <a href="https://fonts.google.com/specimen/Great+Vibes">Google Fonts</a>
 <span>.</span>
</div>
{{< /rawhtml >}}

Just **download** it and **run**:

```sh
unzip ~/Downloads/Great_Vibes.zip -d ~/.local/share/fonts/
fc-cache -fv  # Refresh font cache
```


## Hugo-scroll

First of all take a look at my guide about how to deploy your own *Hugo Scroll* site [here](/blogs/create_hugo_website/).
The *CSS* section is the one you need read, [this](https://github.com/juanMarinero/juanmarinero.github.io#css).

Let's first apply the font to a HTML-class, then multiple times inline, and finally to a HTML-tag, like `<h1>`.
Though this is not about CSS code, but about different approachs to add fonts to your Hugo website.


### Great Vibes

Append to `layouts/partials/custom_head.html` next

```
<!-- Great Vibes Font (Hugo-friendly version) -->
{{ $fontCSS := resources.GetRemote "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" }}
{{ with $fontCSS }}
  <style>{{ .Content | safeCSS }}</style>
{{ end }}
```

In that same file, in-between `<style>` tags, add a new CSS class selector with the desired font, e.g.:
```html
<style>
/* ... */

/* Fonts */
.great-vibes {
  font-family: "Great Vibes", cursive;
}
</style>
```

And finally apply it in a *mardown* script of your project, e.g. `content/en/blogs/nerd_fonts_and_more.md`.

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  Wrap next <code>div</code> inside 
  <code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;</code>
  and 
  <code>&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code>
  because it is raw HTML. 
  For more info read
  <a href="https://github.com/zjedi/hugo-scroll/blob/master/layouts/shortcodes/rawhtml.html">layouts/shortcodes/rawhtml.html</a>
  from the official Hugo-scroll repo.
</div>
{{< /rawhtml >}}


```html
<div class="html-content">
 <span>Let's try it: </span>
 <span class="great-vibes" style="font-size: 1.5em;">This line is written with Great Vibes font! It looks awesome, doesn't it? 0123456789 qwertyuiopasdfghjklzxcvbnm</span> 
</div>
```

...which will render like this:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
 <span>Let's try it: </span>
 <span class="great-vibes" style="font-size: 1.5em;">This line is written with Great Vibes font! It looks awesome, doesn't it? 0123456789 qwertyuiopasdfghjklzxcvbnm</span>
</div>
{{< /rawhtml >}}

**TL;DR**:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
<!-- Replace <,>,{ and } to avoid auto-render -->
{{< rawhtml >}}
<div class="html-content">
  <pre><code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;
&#60;div class="html-content"&#62;
 &#60;span&#62;Let's try it: &#60;/span&#62;
 &#60;span class="great-vibes" style="font-size: 1.5em;"&#62;This line is written with Great Vibes font! It looks awesome, doesn't it? 0123456789 qwertyuiopasdfghjklzxcvbnm&#60;/span&#62;
&#60;/div&#62;
&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code></pre>
</div>
{{< /rawhtml >}}

Furthermore,
- Visit [Google Web Fonts Helper](https://gwfh.mranftl.com/fonts/) to preview Google Web Fonts
- ...and even to download the fonts you need. This approach is explained later in section [Iosevka local installed](#iosevka-local-installed)


<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <img
    src="/images/blogs/nerd_fonts_and_more/google_web_fonts_helper__great_vibes.png"
    style="width:90%;"
    alt="color_picker_and_pastel_with_notes.png"
    >
</div>
{{< /rawhtml >}}

Rememeber to
- Pick `Legacy Support`
- Set under `Customize folder prefix` the dir `../webfonts/`


### Oswald

Actually there was no need to install any font if a pre-installed was enough, check [static/webfonts](https://github.com/zjedi/hugo-scroll/tree/master/static/webfonts).
Example use of the *Oswald* font directly via **CSS inline**, instead of defining a *CSS class selector*, is:


<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
 <span>Let's try it: </span>
 <span style="font-size: 1.5em; font-family: 'Oswald';">This line is written with the Oswald font!</span>
</div>
{{< /rawhtml >}}

Hugo code:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
<!-- Replace <,>,{ and } to avoid auto-render -->
{{< rawhtml >}}
<div class="html-content">
  <pre><code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;
&#60;div class="html-content"&#62;
 &#60;span&#62;Let's try it: &#60;/span&#62;
 &#60;span style="font-size: 1.5em; font-family: 'Oswald';"&#62;This line is written with the Oswald font!&#60;/span&#62;
&#60;/div&#62;
&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code></pre>
</div>
{{< /rawhtml >}}


### Awesome Font

You can also use any font from the *Awesome Font* family (not to confuse with the *Nerd Font* collection which includes these and much more),
which is provided [here](https://github.com/zjedi/hugo-scroll/tree/master/assets/css/fontawesome).
E.g.

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
 <span>Let's try it: </span>
 <span style="font-size: 1.5em; font-family: 'Font Awesome 6 Free'">This line is written with the Font Awesome 6 Free font!</span>
</div>
{{< /rawhtml >}}

Hugo code:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
<!-- Replace <,>,{ and } to avoid auto-render -->
{{< rawhtml >}}
<div class="html-content">
  <pre><code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;
&#60;div class="html-content"&#62;
 &#60;span&#62;Let's try it: &#60;/span&#62;
 &#60;span style="font-size: 1.5em; font-family: 'Font Awesome 6 Free';"&#62;This line is written with the Font Awesome 6 Free font!&#60;/span&#62;
&#60;/div&#62;
&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code></pre>
</div>
{{< /rawhtml >}}

### Global installed fail

And what about a **global installed** font? What happens if I use *Iosevka* font? Well, it will **fall to** the *Roboto Slab* font, which is provided by Hugo-scroll.

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
 <span>Let's try it: </span>
 <span style="font-size: 1.5em; font-family: 'Iosevka', 'Roboto Slab', serif">This line FAILs to be displayed with the Iosevka font!</span>
</div>
{{< /rawhtml >}}

If you don't trust me, I like your scepticism btw., then inspect it with your favority web-dev tool to check the font used.


### Iosevka local installed

Now we will **install** the font **local**ly, instead of providing a link as done with [Great Vibes](#great-vibes). Steps:
1. Go to [Iosevka releases](https://github.com/be5invis/Iosevka/releases/latest) and download for example [PkgWebFont-Iosevka-33.2.7.zip](https://github.com/be5invis/Iosevka/releases/download/v33.2.7/PkgWebFont-Iosevka-33.2.7.zip)
2. Unzip the `.zip` file
3. Pick the desired `.ttf` and `.woff2` files, e.g. `Iosevka-BoldItalic.ttf/.woff2`
4. Move them to the `static/webfonts` (of your Hugo repo)
5. Append to `assets/css/fonts.css` next:

```css
/* Iosevka-BoldItalic - latin */
@font-face {
  font-family: 'Iosevka BoldItalic';
  src: local(''),
       url('../webfonts/Iosevka-BoldItalic.woff2') format('woff2'), /* Super Modern Browsers */
       url('../webfonts/Iosevka-BoldItalic.ttf') format('truetype'); /* Safari, Android, iOS */
  font-weight: bold;
  font-style: italic;
}
```

6. Use it:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
 <span>Let's try it: </span>
 <span style="font-size: 1.5em; font-family: 'Iosevka BoldItalic', 'Roboto Slab', serif">This line is displayed with the Iosevka-BoldItalic font!</span>
 <br>
 <br>
</div>
{{< /rawhtml >}}

### Summary

- Global installed does **not** mean available for your Hugo website
- *Awesome Font*-s are provided by *Hugo-scroll*, but not the whole *Nerd Font* collection
- Always provide fall-back fonts, like `<p style="font-family: 'Iosevka', 'Roboto Slab', serif">Texxxxt</p>`
- If you trust the font provider then use `$fontCSS := resources.GetRemote` like in the [Great Vibes](#great-vibes) section. Otherwise, or if speed is a must, then download it locally like in the [Iosevka](#iosevka-local-installed).


### HTML-tag `<h1>`

`themes/hugo-scroll/assets/css/content.scss` content is like:

```scss
body {
  ...
  font-family: "Roboto Slab", serif;
}
h1,h2,h3,h4,h5,h6 {
  ...
  font-family: "Open Sans", sans-serif;
}
/* ... */
```

Thus, to change globally the font, just change the `font-family` in `layouts/partials/custom_head.html`. For example:

```html
<style>
/* ... */

/* Fonts */
h1 {
  font-family: "Great Vibes", "Open Sans", sans-serif;
}
</style>
```

Notice the fall-back to `Open Sans` font if `Great Vibes` is not available, and to `san-serif` if `Open Sans` is not available.



<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
</div>
{{< /rawhtml >}}
