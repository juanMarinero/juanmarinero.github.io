<!-- vim: set ts=2 sts=2 sw=2 expandtab tw=0 foldmethod=expr foldcolumn=5 : -->



1. [Install Hugo](#install-hugo)
2. [Create a Hugo site with the hugo-scroll theme](#create-a-hugo-site-with-the-hugo-scroll-theme)
3. [Get the zjedi/hugo-scroll website](#get-the-zjedi/hugo-scroll-website)
4. [Customize](#customize)
   * [hugo.toml](#hugo.toml)
   * [Favicons, header-logo and cover-image](#favicons,-header-logo-and-cover-image)
   * [Edit a mainpage section. For example `content/en/homepage/services.md`](#edit-a-mainpage-section.-for-example-`content/en/homepage/services.md`)
   * [Edit a not mainpage.](#edit-a-not-mainpage.)
   * [CSS](#css)
5. [Deploy](#deploy)
   * [Create a GitHub repository](#create-a-github-repository)
   * [Host on GitHub](#host-on-github)
   * [Wait for Github pages to be ready](#wait-for-github-pages-to-be-ready)
6. [Set up custom domain](#set-up-custom-domain)
   * [Buy a domain](#buy-a-domain)
   * [Manage the DNS records for your domain](#manage-the-dns-records-for-your-domain)
   * [Set domain on Github](#set-domain-on-github)

## Install Hugo

https://gohugo.io/getting-started/quick-start/#prerequisites

https://gohugo.io/installation/linux/

https://github.com/gohugoio/hugo/releases/

Download the latest .deb package from Hugo's GitHub releases, then
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

Now, open in terminal http://localhost:1313/

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

And the local website http://localhost:1313/ should be like this: https://zjedi.github.io/hugo-scroll/


## Customize

Note. Order of markdowns is set by the `weight` metadata.

- E.g. next has weight 99 to appear last [exampleSite/content/en/homepage/credits.md](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/exampleSite/content/en/homepage/credits.md?plain=1#L3)
- Next weight 3 to appear the 3rd at top [exampleSite/content/en/homepage/about-me.md](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/exampleSite/content/en/homepage/about-me.md?plain=1#L3)

Lets check them all!

1. Create a script like `cat_by_weight.sh` in this repo
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

- Same for `public/images/favicon-16x16.png` and `public/images/favicon-32x32.png`. Also for`static/images/`

```sh
cd <repo-path>
convert assets/images/favicon.png -resize 16x16 public/images/favicon-16x16.png
convert assets/images/favicon.png -resize 32x32 public/images/favicon-32x32.png
convert assets/images/favicon.png -resize 16x16 static/images/favicon-16x16.png
convert assets/images/favicon.png -resize 32x32 static/images/favicon-32x32.png
```

- `assets/images/chef-hat.png` renamed to `header-logo.png` with for example https://www.flaticon.com/search?word=massage. Also rename that file in `content/en/_index.md` with your favorit editor: 
`"$EDITOR" content/en/_index.md`



### Edit a mainpage section. For example `content/en/homepage/services.md`

- `title: "The Services I Offer"` is the title of that section of the website.
- `header_menu_title: "Services"` is text of a link to this website section, this link is displayed in the *cover section* or *hero section.*, i.e. [`content/en/_index.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/_index.md?plain=1) section, i.e. in at start of the mainpage.
- `navigation_menu_title: "My Services"` is the text of a link to this website section, this link is displayed at the cover menu (the navigation bar at the top showing links to sections of the main page, it keeps there even while one scrolls)... as long as `header_menu` is `true` in the webseite section.

In contrast `content/en/homepage/opener.md` has no `header_menu_title` nor `navigation_menu_title`. And therefore this website section does not appear in the cover section nor in the cover menu. As its content stated
[here](https://zjedi.github.io/hugo-scroll/#:~:text=By%20the%20way%20this%20welcome%20section%20won%E2%80%99t%20show%20in%20the%20cover%20menu.):
> By the way this welcome section won't show in the cover menu.


### Edit a not mainpage. 

For example `https://zjedi.github.io/hugo-scroll/services/` has the content of https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/services.md (not to confuse with https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/services.md)


https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/opener.md?plain=1, i.e. the mainpage, links to this not-mainpage via `[dedicated pages](services)` of:
> `You can also delegate lengthier, less important or more sizeable content to [dedicated pages](services).`

In the language directory, for example `public/en/` edit the `sitemap.xml` file.

### CSS

`layouts/partials/custom_head.html` shows how to add CSS code:
- directly in that file, just below comment line `Custom CSS via inline styles` add an `style` tag not commented (not wrapped inside `<!--` - `-->`) for example `<style>fontsize=1.2</style>` tonincrease every text size a 20%
- and/or via a *css* file, read commentes in the file

Check original CSS style in `themes/hugo-scroll/assets/css/style.css`.
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

Now click on the link with same content as last commit message, `Create hugo.yaml` for example, this will show the link to your live site, like [https://github.com/mdcruz/mdcruz.github.io](https://github.com/mdcruz/mdcruz.github.io).


## Set up custom domain

### Buy a domain

- Check if available at https://lookup.icann.org/whois/
- Buy it at https://www.namecheap.com/domains/ for example. Note, you do **not** need *Additional Hosting* since GitHub Pages offers free static hosting.

### Manage the DNS records for your domain

Read https://www.testingwithmarie.com/posts/20241126-create-a-static-blog-with-hugo/#set-up-custom-domain

This step varies in each domain provider.

Remove both the `ALIAS` and `CNAME` records you currently have set.

Set the `A` and `CNAME` records for your domain.

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

For the `CNAME`, set the value to `<username>.github.io.`.

For example in Porkbun's DNS management add next:
```
Type: CNAME
Host: www
Answer/Value: juanmarinero.github.io
TTL: 600
```


### Set domain on Github

Read https://www.testingwithmarie.com/posts/20241126-create-a-static-blog-with-hugo/#set-up-custom-domain

In the Github repo, go to `Settings > Pages` and add your domain under the `Custom domain` field.

Wait for up to 24 hours to see the site to your custom domain.
