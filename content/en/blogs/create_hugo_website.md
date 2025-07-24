---
title: "Create your own Hugo-scroll website"
---


1. [Install Hugo](#install-hugo)
   * [Linux](#linux)
   * [Windows](#windows)
     * [Install Git](#install-git)
     * [Install Go](#install-go)
     * [Install Dash](#install-dash)
     * [Install Hugo](#install-hugo)
     * [Test a Hugo repo](#test-a-hugo-repo)
2. [Create a Hugo site with the hugo-scroll theme](#create-a-hugo-site-with-the-hugo-scroll-theme)
3. [Get the zjedi/hugo-scroll website](#get-the-zjedihugo-scroll-website)
4. [Customize](#customize)
   * [Remove git dirs](#remove-git-dirs)
   * [Order of markdowns](#order-of-markdowns)
   * [hugo.toml](#hugotoml)
   * [Favicons, header-logo and cover-image](#favicons-header-logo-and-cover-image)
   * [Edit a mainpage section](#edit-a-mainpage-section)
   * [Edit a not mainpage](#edit-a-not-mainpage)
   * [CSS](#css)
   * [Raw HTML](#raw-html)
5. [Deploy](#deploy)
   * [Create a GitHub repository](#create-a-github-repository)
   * [Host on GitHub](#host-on-github)
   * [Wait for Github pages to be ready](#wait-for-github-pages-to-be-ready)
   * [Rebuild before pushing](#rebuild-before-pushing)
6. [Set up a custom domain](#set-up-a-custom-domain)
   * [Buy a domain](#buy-a-domain)
   * [Manage the DNS records for your domain](#manage-the-dns-records-for-your-domain)
     * [The A records](#the-a-records)
     * [The CNAME records](#the-cname-records)
   * [Set your domain on Github](#set-your-domain-on-github)
     * [Add your domain to GitHub Pages settings](#add-your-domain-to-github-pages-settings)
     * [Add your domain to a CNAME file](#add-your-domain-to-a-cname-file)
     * [Enforce HTTPS](#enforce-https)
7. [Bonus. The More You Know](#bonus-the-more-you-know)
   * [Apex Domains and the www subdomain](#apex-domains-and-the-www-subdomain)
   * [Understanding CNAME Restrictions on Apex Domains](#understanding-cname-restrictions-on-apex-domains)
   * [GitHub Pages sites can be stored in any repository](#github-pages-sites-can-be-stored-in-any-repository)
   * [Hugo is not the only solution](#hugo-is-not-the-only-solution)
     * [Publishing from a branch](#publishing-from-a-branch)
     * [Publishing with a custom GitHub Actions workflow](#publishing-with-a-custom-github-actions-workflow)


## Install Hugo

https://gohugo.io/getting-started/quick-start/#prerequisites

### Linux

https://gohugo.io/installation/linux/

Download the latest `.deb` package from [Hugo's GitHub releases](https://github.com/gohugoio/hugo/releases/latest), then
install it and check version.

Edit `vers` below to the version you want to install.

```sh
vers=0.148.0
package=hugo_extended_"$vers"_linux-amd64.deb
URL="https://github.com/gohugoio/hugo/releases/download/v$vers/$package"
cd ~/Downloads && \
  wget "$URL" && \
  sudo dpkg -i "$package" && \
  rm -v "$package" && \
  hugo version
```

To remove run `sudo apt-get purge hugo`.

### Windows


#### Install Git

https://git-scm.com/downloads/win

```powershell
# Open Powershell as admin, run:
winget install --id Git.Git -e --source winget

# Show installed files
dir "C:\Program Files\Git\cmd"

# Check version
& "C:\Program Files\Git\cmd\git.exe" --version # outputs for example: git version 2.50.1.windows.1

# Check path
echo $env:Path
$env:Path -match "git"

# If False ("git" not in $PATH), add it
$env:Path += ";C:\Program Files\Git\cmd" # temporal
[Environment]::SetEnvironmentVariable("Path", ([Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Program Files\Git\cmd"), "User") # persistent
git --version # outputs for example: git version 2.50.1.windows.1
```

#### Install Go

https://go.dev/dl/

Windows 10 or later, Intel 64-bit processor download for example `go1.24.5.windows-amd64.msi`.

Either 
- Double-click the downloaded `.msi` file and follow the on-screen instructions to complete the installation. The default settings are suitable for most users.
- Or
```powershell
cd $HOME/Downloads
Get-ChildItem | Where-Object { $_.Name -match "msi" } # shows go1.24.5.windows-amd64.msi

# Install
Start-Process 'msiexec.exe' -ArgumentList '/i', 'go1.24.5.windows-amd64.msi', '/qn', '/norestart', '/l*v', 'go_install.log' -Wait
```

```powershell
# Check version
& "C:\Program Files\Go\bin\go.exe" version # outputs for example: go version go1.24.5 windows/amd64

# Check path
echo $env:Path
$env:Path -match "go"

# If False ("go" not in $PATH), add it
$env:Path += ";C:\Program Files\Go\bin" # temporal
[Environment]::SetEnvironmentVariable("Path", ([Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Program Files\Go\bin"), "User") # persistent
go version # outputs for example: go version go1.24.5 windows/amd64
```


#### Install Dash

Download the `dart-sass-1.89.2-windows-x64.zip` or alike of https://github.com/sass/dart-sass/releases

Either 
- Double-click the downloaded `.zip` file and extract it into `C:\dart-ass`
- Or
```powershell
cd $HOME/Downloads
Get-ChildItem | Where-Object { $_.Name -match "zip" } # shows dart-sass-1.89.2-windows-x64.zip

# Unzip
Expand-Archive -LiteralPath .\dart-sass-1.89.2-windows-x64.zip -DestinationPath .\dart-sass

# Move the extracted folder
Move-Item .\dart-sass\* C:\dart-sass
```

```powershell
# Check path
echo $env:Path
$env:Path -match "dart"

# If False ("dart-sass" not in $PATH), add it
$env:Path += ";C:\dart-sass" # temporal
[Environment]::SetEnvironmentVariable("Path", ([Environment]::GetEnvironmentVariable("Path", "User") + ";C:\dart-sass"), "User") # persistent
sass --version # 1.89.2
```


#### Install Hugo

https://gohugo.io/installation/windows/#prebuilt-binaries


Download the **extended** edition, for example `hugo_extended_0.148.1_windows-amd64.zip` from [Hugo's GitHub releases](https://github.com/gohugoio/hugo/releases/latest), then

Either 
- Double-click the downloaded `.zip` file and extract it into `C:\hugo`
- Or
```powershell
cd $HOME/Downloads
Get-ChildItem | Where-Object { $_.Name -match "zip" } # shows hugo_extended_0.148.1_windows-amd64.zip

# Unzip
Expand-Archive -LiteralPath .\hugo_extended_0.148.1_windows-amd64.zip -DestinationPath .\hugo

# Move the extracted folder
Move-Item .\hugo C:\hugo
```

```powershell
# Check path
echo $env:Path
$env:Path -match "hugo"

# If False ("hugo" not in $PATH), add it
$env:Path += ";C:\hugo" # temporal
[Environment]::SetEnvironmentVariable("Path", ([Environment]::GetEnvironmentVariable("Path", "User") + ";C:\hugo"), "User") # persistent
hugo version # hugo v0.148.1-...+extended windows/amd64 BuildDate=2025-07-11T12:56:21Z VendorInfo=gohugoio
# make sure its EXTENDED !
```

#### Test a Hugo repo

```sh
cd $HOME/Downloads
git clone https://github.com/juanMarinero/juanmarinero.github.io
cd juanmarinero.github.io
git submodule update --init --recursive # Important!
hugo server
```

...which outputs:

```
Watching for changes in C:\Users\UserName\Downloads\juanmarinero.github.io\{archetypes,assets,content,layouts,static,themes}
Watching for config changes in C:\Users\UserName\Downloads\juanmarinero.github.io\hugo.toml
Start building sites …
hugo v0.148.1-98ba786f2f5dca0866f47ab79f394370bcb77d2f+extended windows/amd64 BuildDate=2025-07-11T12:56:21Z VendorInfo=gohugoio

                  │ ES
──────────────────┼─────
 Pages            │   7
 Paginator pages  │   0
 Non-page files   │   0
 Static files     │ 110
 Processed images │   8
 Aliases          │   0
 Cleaned          │   0

Built in 23132 ms
Environment: "development"
Serving pages from disk
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
Current date: Monday, July 14, 2025, 11:50 AM CEST
```

Open in browser [http://localhost:1313/](http://localhost:1313/)

In future just run:

```powershell
cd $HOME/Downloads/juanmarinero.github.io
hugo server
```


## Create a Hugo site with the hugo-scroll theme

Follow [quickstart - commands](https://gohugo.io/getting-started/quick-start/#commands)
applaying [hugo-scroll theme](https://github.com/zjedi/hugo-scroll#-installation)

```sh
cd ~/Downloads
hugo new site quickstart
cd quickstart
git init
git submodule add https://github.com/zjedi/hugo-scroll.git themes/hugo-scroll
echo "theme = 'hugo-scroll'" >> hugo.toml
hugo server
```

This should output like

```
> hugo server
Watching for changes in <path>/quickstart/{archetypes,assets,content,data,i18n,layouts,static,themes}
Watching for config changes in <path>/quickstart/hugo.toml
Start building sites … 
hugo v0.148.0-c0d9bebacc6bf42a91a74d8bb0de7bc775c8e573+extended linux/amd64 BuildDate=2025-07-08T13:34:49Z VendorInfo=gohugoio


                  │ EN  
──────────────────┼─────
 Pages            │   6 
 Paginator pages  │   0 
 Non-page files   │   0 
 Static files     │ 108 
 Processed images │   0 
 Aliases          │   0 
 Cleaned          │   0 

Built in 25 ms
Environment: "development"
Serving pages from disk
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1) 
Press Ctrl+C to stop
```

Now, open in browser [http://localhost:1313/](http://localhost:1313/)

Notice the browser tab name *My New Hugo Site* but the site is empty.

Let's stop the server `Ctrl+C` and add some content.


## Get the zjedi/hugo-scroll website

https://github.com/zjedi/hugo-scroll#-installation says:

> If you are starting fresh, simply copy over the contents of the `exampleSite`-directory included in this theme to your source directory. That should give you a good idea about how things work, and then you can go on from there to make the site your own.


```sh
cd ~/Downloads/quickstart
hugo_scroll_dir=$HOME/Downloads/hugo-scroll
git clone --depth 1 https://github.com/zjedi/hugo-scroll.git "$hugo_scroll_dir"
cp -r "$hugo_scroll_dir"/exampleSite/* .
hugo server
```

This should output like

```
Watching for changes in <path>/quickstart/{archetypes,assets,content,data,i18n,layouts,static,themes}
Watching for config changes in <path>/quickstart/hugo.toml
Start building sites … 
hugo v0.148.0-c0d9bebacc6bf42a91a74d8bb0de7bc775c8e573+extended linux/amd64 BuildDate=2025-07-08T13:34:49Z VendorInfo=gohugoio


                  │ EN  │ DE  
──────────────────┼─────┼─────
 Pages            │  15 │  14 
 Paginator pages  │   0 │   0 
 Non-page files   │   1 │   0 
 Static files     │ 114 │ 114 
 Processed images │   8 │   0 
 Aliases          │   1 │   0 
 Cleaned          │   0 │   0 

Built in 4793 ms
Environment: "development"
Serving pages from disk
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1) 
Press Ctrl+C to stop
```

And the local website [http://localhost:1313/](http://localhost:1313/) should be like [this](https://zjedi.github.io/hugo-scroll/).


## Customize

### Remove git dirs

The easiest way is to edit little by little the content of the [zjedi/hugo-scroll](https://github.com/zjedi/hugo-scroll) repo to your needs.
```sh
rm -rf .git .github exampleSite images CHANGELOG.md contributing.md LICENSE package.json package-lock.json README.md .prettierignore .prettierrc.json theme.toml netlify.toml
git init
```

And check that `hugo server` still works.


### Order of markdowns

The website sections are sorted by the `weight` metadata.

- E.g. next has weight 99 to appear last [exampleSite/content/en/homepage/credits.md](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/exampleSite/content/en/homepage/credits.md?plain=1#L3)
- Next weight 3 to appear the 3rd at top [exampleSite/content/en/homepage/about-me.md](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/exampleSite/content/en/homepage/about-me.md?plain=1#L3)

Lets check them all!

1. Create a script like [cat_by_weight.sh](https://github.com/juanMarinero/juanmarinero.github.io/blob/main/cat_by_weight.sh)
2. Run it on the content directory
```sh
chmod +x cat_by_weight.sh
./cat_by_weight.sh content/en/homepage head -n 5
```


Note. You can pass another catter like `cat` or `tail`. The default is `bat --line-range=1:10`

to get:

| weight | file |
| ------ | ---- |
|      1 | content/en/homepage/opener.md |
|      3 | content/en/homepage/about-me.de.md |
|      3 | content/en/homepage/about-me.md |
|      4 | content/en/homepage/contact.md |
|     98 | content/en/homepage/legal-brief.md |
|     99 | content/en/homepage/credits.md |
|     99 | content/en/homepage/external.md |


```
--- content/en/homepage/opener.md (weight: 1) ---
---
title: "Welcome"
weight: 1
---


--- content/en/homepage/about-me.de.md (weight: 3) ---
---
title: "Über mich (shared folder)"
weight: 3
header_menu: true
---

--- content/en/homepage/about-me.md (weight: 3) ---
---
title: "About Me"
weight: 3
header_menu: true
---

--- content/en/homepage/contact.md (weight: 4) ---
---
title: "Contact"
weight: 4
header_menu: true
---

--- content/en/homepage/legal-brief.md (weight: 98) ---
---
title: "Brief Legal Information"
weight: 98
header_menu_title: "Legal"
navigation_menu_title: "Legal stuff"

--- content/en/homepage/credits.md (weight: 99) ---
---
title: "Credits"
weight: 99
header_menu: true
---

--- content/en/homepage/external.md (weight: 99) ---
---
title: "GitHub"
weight: 99
header_menu: true
external: https://github.com/zjedi/hugo-scroll

--- content/en/homepage/index.md (no weight) ---
---
headless: true
---

--- content/en/homepage/license.md (no weight) ---
---
footer_menu_title: License
footer_menu: true
detailed_page_path: /license/
detailed_page_homepage_content: false

--- content/en/homepage/services.md (no weight) ---
---
title: "The Services I Offer"
header_menu_title: "Services"
navigation_menu_title: "My Services"
weight: 2
```

### hugo.toml

Open with your favorit editor `"$EDITOR" hugo.toml` and edit, among other:
- `baseURL` replace with your domain, or with `https://<username>.github.io`, for example `https://juanmarinero.github.io`
- `defaultContentLanguage = "en"` edit if needed, but this requires to, if not `en` nor `de` to
  -  edit end of page `[languages]`
  -  and add a directory like `contentDir = "content/es"` for *español* (Spanish)
- The browser tab name `title = "..."`
- set `title_guard` to `true` if title not legible because color contrast
- set `language_menu` and `show_current_lang` to `false` if just one language website
- `invertSectionColors = false` set to true and check if it likes you more
- set `showContactIcons` to `true` to share email/phone in footnote
- edit `params.meta` and `params.contacts`


### Favicons, header-logo and cover-image

Replace 
- `assets/images/cover-image.jpg` with for example https://www.freepik.com/search?format=search&last_filter=selection&last_value=1&query=Zen+Background&selection=1.
- `assets/images/favicon.png` with for example https://www.flaticon.com/free-icons/zen. Convert it to and `assets/images/apple-touch-icon.png`of 180x180px via:

```sh
cd assets/images/
sudo apt update && sudo apt install imagemagick optipng -y
convert favicon.png -resize 180x180 apple-touch-icon.png
```

- Same for `public/images/favicon-16x16.png` and `public/images/favicon-32x32.png`. Also for `static/images/` and `assets/favicon.ico`

```sh
cd <repo-path>
convert assets/images/favicon.png -resize 16x16 public/images/favicon-16x16.png
convert assets/images/favicon.png -resize 32x32 public/images/favicon-32x32.png
convert assets/images/favicon.png -resize 16x16 static/images/favicon-16x16.png
convert assets/images/favicon.png -resize 32x32 static/images/favicon-32x32.png
convert assets/images/favicon.png -define icon:auto-resize=64,48,32,16 assets/favicon.ico
```


- `assets/images/chef-hat.png` renamed to `header-logo.png` with for example https://www.flaticon.com/search?word=massage. Also rename that file in `content/en/_index.md` with your favorit editor: 
`"$EDITOR" content/en/_index.md`


To change the background image to a video `hugo.toml` says

```
    # These "images" are used for the structured data templates. This will show up, when
    # ...
    # NOT the actual header background image, go to _index.md instead
    images = ["images/cover-image.jpg"]
```

Thus, check if `content/en/_index.md` sets a fixed image:

```
# When set true, uses video from custom_header_video.html partial, instead of header_image
header_use_video: false
```

Toggle it to `true`, add the video (for example from [pexels](https://www.pexels.com/search/videos/)) to `assets/cover/`, and edit the video name in `layouts/partials/custom_header_video.html`.

Tip, set video speed there directly in that `html` file with:

```html
<video id="portfolioVideo" ...
    {{ $videoResource := resources.Get "cover/video_name.mp4" }}
    <source src="{{ $videoResource.RelPermalink }}" type="video/mp4">
</video>

<script>
  // Slow down video to 50% speed
  document.getElementById('portfolioVideo').playbackRate = 0.5;
</script>
```

### Edit a mainpage section

For example edit `content/en/homepage/services.md`

- `title: "The Services I Offer"` is the title of that section of the website.
- `header_menu_title: "Services"` is text of a link to this website section, this link is displayed in the *cover section* or *hero section.*, i.e. [`content/en/_index.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/_index.md?plain=1) section, i.e. in at start of the mainpage.
- `navigation_menu_title: "My Services"` is the text of a link to this website section, this link is displayed at the cover menu (the navigation bar at the top showing links to sections of the main page, it keeps there even while one scrolls)... as long as `header_menu` is `true` in the webseite section.

In contrast `content/en/homepage/opener.md` has no `header_menu_title` nor `navigation_menu_title`. And therefore this website section does not appear in the cover section nor in the cover menu. As its content stated
[here](https://zjedi.github.io/hugo-scroll/#:~:text=By%20the%20way%20this%20welcome%20section%20won%E2%80%99t%20show%20in%20the%20cover%20menu.):
> By the way this welcome section won't show in the cover menu.



### Edit a not mainpage

For example `https://zjedi.github.io/hugo-scroll/services/` has the content of https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/services.md (not to confuse with https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/services.md)


https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/opener.md?plain=1, i.e. the mainpage, links to this not-mainpage via `[dedicated pages](services)` of:
> `You can also delegate lengthier, less important or more sizeable content to [dedicated pages](services).`

In the language directory, for example `public/en/` edit the `sitemap.xml` file.

### CSS

`layouts/partials/custom_head.html` shows how to add CSS code:
- directly in that file, just below comment line `Custom CSS via inline styles` add an `style` tag not commented (not wrapped inside `<!--` - `-->`) for example `<style>fontsize=1.2</style>` to increase every text size a 20%
- and/or via a *css* file, read commentes in the file

Check original CSS style in `themes/hugo-scroll/assets/css/`.
For example to change background colors of odd sections edit `themes/hugo-scroll/assets/css/variables.scss`, its `--section-dark-bg-color`.
Note, I should **not** directly edit `themes/hugo-scroll` since its a submodule not of my property, thus I cannot push it.
Instead in `layouts/partials/custom_head.html` write:

```html
<style>
:root {
    --section-dark-bg-color: #c1cdaa;
}
</style>
```

### Raw HTML


<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  To use raw HTML content wrap the HTML lines inside
  <code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;&#60;div class="html-content"&#62;</code>
  and 
  <code>&#60;/div&#62;&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code>.
  For more info read
  <a href="https://github.com/zjedi/hugo-scroll/blob/master/layouts/shortcodes/rawhtml.html">layouts/shortcodes/rawhtml.html</a>
  from the official Hugo-scroll repo.
  Example usage in the <strong>TL;DR</strong> of my <a href="/blogs/nerd_fonts_and_more/#great-vibes">Nerd Fonts and more</a> blog.
</div>
{{< /rawhtml >}}

Alternative **but NOT** recommended. Add this to your `config.toml` (or equivalent in YAML/JSON)

```toml
[markup.goldmark.renderer]
  unsafe = true
```

Read
- [Do you set `unsafe = true` in `[markup.goldmark.renderer]`?](https://discourse.gohugo.io/t/do-you-set-unsafe-true-in-markup-goldmark-renderer/37555)
- https://gohugo.io/configuration/markup/


## Deploy

References
- https://gohugo.io/host-and-deploy/host-on-github-pages/
- https://www.testingwithmarie.com/posts/20241126-create-a-static-blog-with-hugo/


### Create a GitHub repository


Create a new public repository named `username.github.io`, where `username` is your GitHub username.
But use lowercase letters even if your username has capitals.
For example, for [mdcruz](https://github.com/mdcruz) it is [mdcruz.github.io](https://github.com/mdcruz/mdcruz.github.io).

And push your local repository to GitHub.

Note, content from submodules of third people must not be edited. I.e. do not edit `themes/hugo-scroll/` submodule.


### Host on GitHub

Follow steps of https://gohugo.io/host-and-deploy/host-on-github-pages/

- Under `Settings/Pages/Source` change `Deploy from a branch` to `Github Actions`.

- `$EDITOR hugo.toml` and add

```toml
[caches]
  [caches.images]
    dir = ':cacheDir/images'
```

- Create a file named `hugo.yaml` in a directory named `.github/workflows`

```sh
mkdir -p .github/workflows
touch .github/workflows/hugo.yaml
```

- `$EDITOR .github/workflows/hugo.yaml`  and copy and paste the YAML below into the file you created. Change the branch name and Hugo version as needed.

```yaml
# Sample workflow for building and deploying a Hugo site to GitHub Pages
name: Deploy Hugo site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches:
      - main

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

# Default to bash
defaults:
  run:
    # GitHub-hosted runners automatically enable `set -eo pipefail` for Bash shells.
    shell: bash

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    env:
      DART_SASS_VERSION: 1.89.2
      HUGO_VERSION: 0.148.0
      HUGO_ENVIRONMENT: production
      TZ: America/Los_Angeles
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb
          sudo dpkg -i ${{ runner.temp }}/hugo.deb
      - name: Install Dart Sass
        run: |
          wget -O ${{ runner.temp }}/dart-sass.tar.gz https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz
          tar -xf ${{ runner.temp }}/dart-sass.tar.gz --directory ${{ runner.temp }}
          mv ${{ runner.temp }}/dart-sass/ /usr/local/bin
          echo "/usr/local/bin/dart-sass" >> $GITHUB_PATH
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Install Node.js dependencies
        run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"
      - name: Cache Restore
        id: cache-restore
        uses: actions/cache/restore@v4
        with:
          path: |
            ${{ runner.temp }}/hugo_cache
          key: hugo-${{ github.run_id }}
          restore-keys:
            hugo-
      - name: Configure Git
        run: git config core.quotepath false
      - name: Build with Hugo
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/" \
            --cacheDir "${{ runner.temp }}/hugo_cache"
      - name: Cache Save
        id: cache-save
        uses: actions/cache/save@v4
        with:
          path: |
            ${{ runner.temp }}/hugo_cache
          key: ${{ steps.cache-restore.outputs.cache-primary-key }}
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

For example check and edit if needed:
- `DART_SASS_VERSION: 1.89.2`
- `HUGO_VERSION: 0.148.0`
- `TZ: America/Los_Angeles`

- Commit and push the change to your GitHub repository.
```sh
git add -A
git commit -m "Create hugo.yaml"
git push
```

### Wait for Github pages to be ready

Go to `Actions` tab, for [example](https://github.com/mdcruz/mdcruz.github.io/actions), and check the status of the deployment, wait until `Build and deploy job` is green.

Now click on the link with same content as last commit message, `Create hugo.yaml` for example, this will show the link to your live site, like https://mdcruz.github.io (for this [repo](https://github.com/mdcruz/mdcruz.github.io)).


### Rebuild before pushing

After every change remember to rebuild the site by running the following command: `hugo server --disableFastRender`

For example, if I modify `projects.md` then `git status --short` just shows:

```
M content/en/homepage/projects.md
```

instead of the neccesary:

```
M content/en/homepage/projects.md
M public/index.html
```

Therefore, if I just commit and push it then I will see no changes in the live site, **instead** one must:
1. Rebuild the website (`public/index.html`) with `hugo server --disableFastRender`,
2. Check locally the changes on [http://localhost:1313/](http://localhost:1313/),
3. And if the result is satisfactory proceed to stage, commit and push.


Removing `public` related files is also a good idea. This way Hugo will re-build just the neccesary files, and the no longer needed files can be commited.
For example, for my blogs (`content/en/blogs`) I run:

```sh
rm -rf public/blogs
hugo server --disableFastRender
```

Then I check it in the browser.

Finally I make sure that all needed is rebuilt previous to push:

```sh
tree -L 2 public/blogs
hugo list all
```


## Set up a custom domain

### Buy a domain

- Check if available at https://lookup.icann.org/whois/
- Buy it at https://www.namecheap.com/domains/ for example. Note, you do **not** need *Additional Hosting* since GitHub Pages offers free static hosting.

### Manage the DNS records for your domain

Read
- [testingwithmarie.com post](https://www.testingwithmarie.com/posts/20241126-create-a-static-blog-with-hugo/#set-up-custom-domain).
- [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

Remove both the `ALIAS` and `CNAME` records you currently have set.

#### The A records

For the `A` record, set the following values:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

For example in Porkbun's DNS management add these four `A` records (one for each GitHub IP). Like this:
```
Type: A
Host: @ (or leave empty)
Answer/Value: 185.199.108.153
TTL: 600
```

#### The CNAME records

- The DNS-CNAME-record tells the internet where to find your site.
- The GitHub-CNAME-file tells GitHub which domain(s) are allowed to show your site.

Next steps varies in each domain provider.

- **Flexible Providers** (e.g., Porkbun, Cloudflare):
  - Use **synthetic records** (`ALIAS`, `ANAME`) that mimic `CNAME` behavior at the root but technically resolve to `A` records.
  - These bypass DNS standards, making GitHub verification "work" even though it’s not a true `CNAME`.
- **Strict Providers** (e.g., EuroDNS, AWS Route 53):
  - Enforce pure RFC compliance.
  - Block `CNAME` at the apex entirely → GitHub can’t verify the domain unless you use `A` records.

For example, for [my.euroDNS.com](https://my.eurodns.com/) just remove every `CNAME` and that's it. You can jump to the next step.

For Porkbun's DNS management and alike, add a `CNAME` with the value `<username>.github.io`.

```
Type: CNAME
Host: www
Answer/Value: juanmarinero.github.io
TTL: 600
```

This is because Porkbun-alike domain providers let you set an `ALIAS` (not true `CNAME`) for root, this works like `A` records.
This is confirmed in the [testingwithmarie.com post](https://www.testingwithmarie.com/posts/20241126-create-a-static-blog-with-hugo/#set-up-custom-domain),
where the screenshot shows `CNAME (Aliases)` instead of plain `CNAME`.


### Set your domain on Github

Read https://www.testingwithmarie.com/posts/20241126-create-a-static-blog-with-hugo/#set-up-custom-domain

#### Add your domain to GitHub Pages settings

In the Github repo, go to `Settings > Pages` and add your domain under the `Custom domain` field.
For example add `juan-marinero.info`, or `www.juan-marinero.info`.

Wait for up to 24 hours to see the site to your custom domain.
So, from now on, you can either:
- Visit the `github.io` Gihtub Page, for example https://juanmarinero.github.io
- Visit your custom domain, like https://juan-marinero.info or with the `www` subdomain like https://www.juan-marinero.info

All these URLs will:
- serve the site from your repository, the `<username>.github.io` Github repo, namely https://github.com/juanMarinero/juanmarinero.github.io.
- redirect and serve at the non-`www` domain, like https://juan-marinero.info. To serve at the `www` subdomain, like https://www.juan-marinero.info, read next section.


#### Add your domain to a CNAME file

To serve your site at the `wwww` subdomain (e.g. `http(s)://www.juan-marinero.info`) and redirect the root domain (`juan-marinero.info`) to this `www` address:

- Make sure your **DNS** is **configured** properly, as described earlier.
- Add a **`CNAME` file** to your `<username>.github.io` repo,
as [Marie's page](https://www.testingwithmarie.com/) did [here](https://github.com/mdcruz/mdcruz.github.io/blob/main/CNAME).
You can do this with the following commands:

```
cd <repo-path>
echo "www.juan-marinero.info" > CNAME # edit !!
git add CNAME
git commit -m "add CNAME with www.juan-marinero.info"
git push
```


#### Enforce HTTPS

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  Previous links follow the
  <code>HTTP<strong>S</strong></code>
  protocol because I 
  <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https#enforcing-https-for-your-github-pages-site">
enforced HTTPS for my GitHub Pages site
  </a>.
</div>
{{< /rawhtml >}}

This is not mandatory, but recommended.


## Bonus. The More You Know

### Apex Domains and the www subdomain

[Github Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages#using-an-apex-domain-for-your-github-pages-site) states

- An **apex** domain is a custom domain that does not contain a subdomain, such as example.com.
- Apex domains are also known as base, bare, naked, root apex, or zone apex domains.
- If you are using an apex domain as your custom domain, we recommend also setting up a `www` subdomain.

Notice we followed this advice in previous sections, where the `CNAME` record has `www` as *host*.

### Understanding CNAME Restrictions on Apex Domains

1. **DNS Standards (RFC 1034)**:
   - The **apex/root domain** (e.g., `example.com`) **cannot** have a `CNAME` record if other records (like `MX`, `TXT`, `NS`) exist for the same domain.
   - This is because `CNAME` conflicts with other record types. GitHub Pages requires a `CNAME` for verification, but apex domains need `A`/`AAAA` records instead.
2. **How GitHub Pages Checks Domains**:
   - When you add `example.com` in GitHub Pages settings, GitHub:
     - Looks for a `CNAME` file in your repo (for subdomains like `www.example.com`).
     - For apex domains, it checks for `A` records pointing to GitHub’s IPs.
   - If GitHub finds a `CNAME` at the apex (which violates DNS rules), verification **fails**.

### GitHub Pages sites can be stored in any repository

Read [Types of GitHub Pages sites](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#types-of-github-pages-sites).

In this guide we worked with the `<username>.github.io` repository, which has the apex domain `<username>.github.io` (accesible via `http(s)://<username>.github.io`).

But GitHub Pages also support storing sites in other repositories, like `<project-name>.github.io/<repo-name>`, which have the apex domain `<project-name>.github.io/<repo-name>` (displayed via `http(s)://<project-name>.github.io/<repo-name>`). For these you must have a **project** account. Read next section.

### Hugo is not the only solution

To deploy our local website on GitHub Pages is very recommended to use a static site generator like [Hugo](https://gohugo.io/).

With Hugo we followed its [Host on GitHub Pages docs](https://gohugo.io/host-and-deploy/host-on-github-pages/),
which, in summary, apply [Github actions](https://github.com/features/actions)
adding the config file [.github/workflows/hugo.yaml](https://gohugo.io/host-and-deploy/host-on-github-pages/#step-7).
This workflow install Hugo's dependencies, Hugo itself, node.js, configure git,... and then builds the site using Hugo.
For example, the build step depends on these few lines

```yaml
      - name: Build with Hugo
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/" \
            --cacheDir "${{ runner.temp }}/hugo_cache"
```

[Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
is other static site generator solution with built-in support for GitHub Pages, i.e. an alternative to [Hugo](https://gohugo.io/).

Next I exemplify how to create a Github Pages site **without** any of those static site generators. 
It's exaplained for a *user or organization site*, but it's analogous for a *project site* case.

#### Publishing from a branch

Create a site for your `<username>.github.io` repository, screenshots in https://pages.github.com/ (click on *User or organization site*).
1. Create a new Github repository called `<username>.github.io` (unless you already have one, if you do, you can skip these steps or create a new repo with other name)
2. Push an `index.html` file to it
```bash
cd <repo-path>
echo '<h1>Hello!</h1>' > index.html
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<username>.github.io.git
git push -u origin main
```
3. In a browser go to `http://<user-name>.github.io`.

Note. The [Github Pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
is not limited to `index.html`:
> Create the entry file for your site. GitHub Pages will look for an `index.html`, `index.md`, or `README.md` file as the entry file for your site.

Now let's create another repo, for example `test-publishing-from-a-branch`, with that same `index.html`. Then follow steps of
[Publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch)
(TL;DR *Settings/Pages*, under *Source* select *Deploy from a branch*, select the `main` branch, and click *Save*)

Also check the step-by-step screenshots in https://pages.github.com/ (click on *Project site* and *Start from scratch*).
Though initial steps are meant for a *project site*.

For the repo [juanMarinero/test-publishing-from-a-branch](https://github.com/juanMarinero/test-publishing-from-a-branch)
that configuration triggers next workflow:
[pages build and deployment #1](https://github.com/juanMarinero/test-publishing-from-a-branch/actions/runs/16418527057)

Thus, I can see that [index.html](https://github.com/juanMarinero/test-publishing-from-a-branch/blob/main/index.html) is the entry file for my site.
Any of next links would work:
- https://juanmarinero.github.io/test-publishing-from-a-branch/
- https://juan-marinero.info/test-publishing-from-a-branch/
- https://www.juan-marinero.info/test-publishing-from-a-branch/

Once the `index.html` file is edited the site is auto-updated.
```sh
cd <repo-path>
echo '<h2>Welcome!</h2>' >> index.html
git add index.html
git commit -m "Edit index.html"
git push
```
Check the previous URLs again and the new workflow execution [pages build and deployment #2](https://github.com/juanMarinero/test-publishing-from-a-branch/actions/runs/16418750101)

#### Publishing with a custom GitHub Actions workflow

Alternative to
[Publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch)
is
[Publishing with a custom GitHub Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow).
This way one sets *GitHub Actions*, and then, quoting in cursive the docs:

- *GitHub will suggest several workflow templates. If you already have a workflow to publish your site, you can skip this step.* Actually this is how we already did it before ([here](#host-on-github)) in our Hugo example, via the workflow template `.github/workflows/hugo.yaml`. 
- *Otherwise, choose one of the options to create a GitHub Actions workflow.* This is the challenge! To create a custom workflow for your site's needs.


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
