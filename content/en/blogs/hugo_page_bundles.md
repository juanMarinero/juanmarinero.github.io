---
title: "Hugo's page bundles: the basics"
description: "Learn how to structure content in Hugo using page and branch bundles. A guide to creating, managing, and troubleshooting your site architecture."
keywords: ["Hugo", "page bundles", "branch bundles", "headless bundle", "hugo list command", "content organization", "Hugo templates", "template lookup order", "leaf bundle", "hugo debug", "gohugo", "static site generator"]
---

Table of contents:

* [Introduction](#introduction)
* [Branch bundles](#branch-bundles)
  * [Practical example](#practical-example)
  * [Hugo Scroll dedicated pages](#hugo-scroll-dedicated-pages)
* [Leaf bundles](#leaf-bundles)
  * [Hugo Scroll mainsite](#hugo-scroll-mainsite)
  * [An undesired leaf bundle example](#an-undesired-leaf-bundle-example)
  * [The `type` front matter bypassing](#the-type-front-matter-bypassing)
  * [Custom layouts for a leaf bundle](#custom-layouts-for-a-leaf-bundle)
* [Hugo Scroll: header menus to any page](#hugo-scroll-header-menus-to-any-page)


In this post, we'll take a closer look at how Hugo really works and explore the ins and outs of page bundles.

We cover:
- Directories were just the main markdown should be rendered, [an undesired leaf bundle example](#an-undesired-leaf-bundle-example)
- Dirs with layouts that concatenate the markdowns contents into a single page, like:
  - The Hugo Scroll [mainsite](#hugo-scroll-mainsite) demo
  - And via a very simple [custom layout](#custom-layouts-for-a-leaf-bundle)
- Folders where each markdown should be rendered on its own individual page:
  - The Hugo Scroll [dedicated pages](#hugo-scroll-dedicated-pages)
  - A branch bundle [practical example](#practical-example)


## Introduction

Although the terminology is narrow, understanding it is essential to follow this guide.
As we advance, few more new concepts will be introduced.

For now, let's focus on the following distinctions:

- A [**leaf bundle**](https://gohugo.io/content-management/page-bundles/#leaf-bundles)
is a directory that contains an `index.md` file and zero or more resources. It has no descendants.

- A [**branch bundle**](https://gohugo.io/content-management/page-bundles/#branch-bundles)
is a directory that contains an `_index.md` file and zero or more resources.

- A [**section**](https://gohugo.io/content-management/sections/)
is a top-level content directory or any content directory containing an `_index.md` file.

- A [**list page**](https://gohugo.io/quick-reference/glossary/#list-page)
is a type of page (a `Page` object) that is defined by its purpose: it receives and is designed to display a collection of other pages.
Its [context](https://gohugo.io/templates/introduction/#context) includes a collection of pages (e.g., `.Pages`, `.RegularPages`) that it is meant to list.

- An [**index-page**](https://gohugo.io/content-management/organization/#index-pages-_indexmd)(`_index.md`)
is a content file that serves as the source content for certain types of **list pages**, namely sections and the home page.

- [**Single pages**](https://gohugo.io/content-management/organization/#single-pages-in-sections)
are single content files in each of your sections.

Next 15+ minutes video is a bit old, but it'll help you get more familiar with the last three terms.

{{< youtube id=0GZxidrlaRM loading="lazy" >}}

If 15 minutes feels too long, this 2-minute read is for you:
[A Hugo Survival Guide – Hugo's Processing Model](https://gist.github.com/janert/4e22671044ffb06ee970b04709dd7d81#hugos-processing-model).

We conclude this preamble with a 
5-minute hands-on tutorial building
[The **most basic** possible **Hugo site**](https://til.simonwillison.net/hugo/basic).
If it doesn't work for you or you don't fully understand every step, that's OK.
Once you've finished reading the current article, this little project will be easy as pie.


## Branch bundles

### Practical example

Steps:
1. Run
```bash
mkfile() { mkdir -p "$(dirname "$1")" && touch "$1"; }
mkfile content/en/leaf_bundle_to_branch_bundle/index.md
```

Or more academic way via [`hugo new content [path] [flags]`](https://gohugo.io/commands/hugo_new_content/):

```bash
hugo new content leaf_bundle_to_branch_bundle/index.md
# Content "[...]/content/en/leaf_bundle_to_branch_bundle/index.md" created
```

Note: the URL (permalink) for an `index` page is `<baseURL>/leaf_bundle_to_branch_bundle/`, for example, `https://example.org/leaf_bundle_to_branch_bundle/`.
Read [Organization of Content Source](https://gohugo.io/content-management/organization/#organization-of-content-source) docs.

2. Create a new `post_1.md` in `content/en/leaf_bundle_to_branch_bundle/`
with [`hugo new`](https://gohugo.io/commands/hugo_new/)` leaf_bundle_to_branch_bundle/post_1.md`
3. In `index.md` content add a link (`<a>`) to it siblings page `post_1.md`
4. Build the site with `hugo server --disableFastRender`

If you just did previous steps, then `[post_1](/leaf_bundle_to_branch_bundle/post_1)` will link to a **404** page.
This happends because Hugo doesn't recognize the directory as a *branch bundle* capable of having child pages, i.e. the `index.md` is treated as a standalone page.

Stop (Ctrl + C) the Hugo server
and check `hugo list all`.
In our scenerio it outputs:

```csv
path,slug,title,date,expiryDate,publishDate,draft,permalink,kind,section
content/en/_index.md,,,0001-01-01T00:00:00Z,0001-01-01T00:00:00Z,0001-01-01T00:00:00Z,false,https://juanmarinero.github.io/,home,
[...]
content/en/leaf_bundle_to_branch_bundle/index.md,,leaf_bundle_to_branch_bundle,0001-01-01T00:00:00Z,0001-01-01T00:00:00Z,0001-01-01T00:00:00Z,false,https://juanmarinero.github.io/leaf_bundle_to_branch_bundle/,page,
[...]
```

This CSV is hard to read, lets convert it to JSON and read with `jq`:

```sh
hugo list all \
  | python3 -c "import csv, json, sys; print(json.dumps([dict(r) for r in csv.DictReader(sys.stdin)]))" \
  | jq .
``` 

Filter by `path` with `[...]  | jq '.[] | select(.path | startswith("content/en/leaf_bundle_to_branch_bundle"))'` to get next.
Notice that `post_1.md` is not found.


```json
{
  "path": "content/en/leaf_bundle_to_branch_bundle/index.md",
  "slug": "",
  "title": "leaf_bundle_to_branch_bundle",
  "date": "0001-01-01T00:00:00Z",
  "expiryDate": "0001-01-01T00:00:00Z",
  "publishDate": "0001-01-01T00:00:00Z",
  "draft": "false",
  "permalink": "https://juanmarinero.github.io/leaf_bundle_to_branch_bundle/",
  "kind": "page",
  "section": ""
}
```


Create `_index.md` converting the `leaf_bundle_to_branch_bundle` directory, a *leaf bundle*, into a *branch bundle*.

5. Run `touch content/en/leaf_bundle_to_branch_bundle/_index.md`
6. Remove the rendered files `rm -rf public/leaf_bundle_to_branch_bundle/`
6. Run `hugo server --disableFastRender`

The [`post_1.md`](/leaf_bundle_to_branch_bundle/post_1) link will work.

{{< rawhtml >}}
  But now
  <a href="/leaf_bundle_to_branch_bundle/">
  <code>/content/en/leaf_bundle_to_branch_bundle/index.md</code>
  </a>
  is inaccessible! We explain this shortly.
{{< /rawhtml >}}

Run the previous `hugo list all` command again (the one with `jq`).

```json
{
  "path": "content/en/leaf_bundle_to_branch_bundle/post_1.md",
  "slug": "",
  "title": "Post 1 of `leaf_bundle_to_branch_bundle`",
  "date": "0001-01-01T00:00:00Z",
  "expiryDate": "0001-01-01T00:00:00Z",
  "publishDate": "0001-01-01T00:00:00Z",
  "draft": "false",
  "permalink": "https://juanmarinero.github.io/leaf_bundle_to_branch_bundle/post_1/",
  "kind": "page",
  "section": "leaf_bundle_to_branch_bundle"
}
```

The `post_1` now does yes appear in the JSON because it's become a regular page (`kind` field is `page`) within the branch bundle.
It's rendered to `public/leaf_bundle_to_branch_bundle/post_1/index.html`.

An image is worth a thousand words, this [post](https://tangenttechnologies.ca/blog/hugo-indexmd-vs-_indexmd/) gives a quick visual explanation.

![_index.md and branch bundles](https://tangenttechnologies.ca/media/1420/hugo-branch-bundle.png)
{style="width:50%;"}

The same [post](https://tangenttechnologies.ca/blog/hugo-indexmd-vs-_indexmd/) states that
> An `index.html` file is also generated in the *posts* folder, but it's html content is generated using the `list.html` template in the theme.

This statement does not apply to the Hugo Scroll theme, which is a Single-Page Application (SPA) theme.
`_index.md` is **not rendered** in **Hugo Scroll**.
This theme is not designed to render traditional Hugo sections or pages in the standard way,
it's meant to:
- Render the homepage from the homepage *headless bundle*.
Explained later in [Hugo Scroll mainsite](#hugo-scroll-mainsite).
Here the `_index` scripts is yes **rendered**.
We already show this in the CSV output above for `content/en/_index.md`.
- Render everything else using the `single.html` template.
Read [Hugo Scroll dedicated pages](#hugo-scroll-dedicated-pages) section.

Then, no surprise that Hugo Scroll
[`layouts/_default/list.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/list.html)
is empty.


And what about the `index` page?
Well, in the first place, 
can you have both `index.md` and `_index.md` **in the same directory?** Long story short, **no**
([link](https://discourse.gohugo.io/t/can-you-have-both-index-md-and-index-md-in-the-same-directory/46539)).
In a *branch bundle* the `index.md` role is superseded by `_index.md`.

Execute [`hugo --printPathWarnings`](https://gohugo.io/commands/hugo_build/#options)
to print warnings on duplicate target paths, etc.
For us it echoes:

```
WARN  Duplicate content path: "/leaf_bundle_to_branch_bundle"
file: "[...]/content/en/leaf_bundle_to_branch_bundle/_index.md"
file: "[...]/content/en/leaf_bundle_to_branch_bundle/index.md"
```

Thus,
1. Create another individual page, e.g. `content/en/leaf_bundle_to_branch_bundle/post_2.md`.
2. Copy the content of `index.md` into `post_2.md`.

Why not simply rename `index.md` to `_index.md`? Because as I mentioned before this script is not rendered for our Hugo theme.
Though you are right, normally this would be the recommended approach.

Now there is another disadvantage.
Bring to mind that in the original *leaf bundle* the `index`'s permalink was `<baseURL>/leaf_bundle_to_branch_bundle/`.
How can we now browse this link?
- Add next [aliases](https://gohugo.io/content-management/urls/#aliases) front matter (an array of strings) to `post_2.md`.
Now `<baseURL>/leaf_bundle_to_branch_bundle/`.
will redirect to `<baseURL>/leaf_bundle_to_branch_bundle/post_2/`.

```yaml
aliases: 
- /leaf_bundle_to_branch_bundle
```
- Alternative set the [url](https://gohugo.io/content-management/urls/#url) front matter `url: leaf_bundle_to_branch_bundle`.
But now `<baseURL>/leaf_bundle_to_branch_bundle/post_2/` will be inaccessible.

So, in summary, `index` scripts are rendered if they are located where they should, that means in a *leaf bundle*.


Note. For a deep dive of the `hugo list all` command check the [bonus section](#the-hugo-list-all-command).


### Hugo Scroll dedicated pages

The existence of [`content/en/_index.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/_index.md?plain=1)
creates the `en`-**branch bundle** in the Hugo Scroll demo.
Non-`/homepage` English pages
(file path [`content/en/`](https://github.com/zjedi/hugo-scroll/tree/master/exampleSite/content/en/) but not inside the `homepage/` folder)
belong to this bundle.
Therefore, Hugo will render them preventing 404 errors.

The Hugo Scroll repo calls these sites **dedicated pages**, to contrast with the [mayority] `en/homepage` pages that build the main scroll website
(discussed later in the [Hugo Scroll mainsite](#hugo-scroll-mainsite) segment).

An analogous *branch bundle* is created for German content by the `content/de/_index.md` file.

Due to the
[template lookup order](https://gohugo.io/templates/lookup-order/),
these dedicated pages are rendered via
[`layouts/_default/single.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/single.html),
as they are regular pages and no more specific template exists in this theme.

Later, in the [custom layouts for a leaf bundle](#custom-layouts-for-a-leaf-bundle) section, we'll see how to take advantage of this template hierarchy, the lookup order.

For example, the markdown [`content/en/services.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/services.md?plain=1),
once rendered with previous layout, produces next [dedicated page](https://zjedi.github.io/hugo-scroll/services/).


## Leaf bundles

The [references](https://gohugo.io/content-management/page-bundles/#leaf-bundles) exemplify various leaf bundles.

In summary,
- A leaf bundle can contain no page resources, like `content/about` below. `content/about/index.md` is a standalone page.
- Or, like `content/posts/my-post` below, it can contain one or more page resources.
This leaf bundle contains an index file, two resources of [resource type](https://gohugo.io/quick-reference/glossary/#resource-type) `page`
(mardown files),
and two resources of resource type `image`.

  - content-1, content-2

    These are resources of resource type `page`, accessible via the [`Resources`] method on the `Page` object. Hugo will not render these as individual pages.

  - image-1, image-2

    These are resources of resource type `image`, accessible via the `Resources` method on the `Page` object


```
content/
├── about
│   └── index.md
└── posts
    └── my-post
        ├── content-1.md
        ├── content-2.md
        ├── image-1.jpg
        ├── image-2.png
        └── index.md
```

I underline: Hugo will **not render** `content-1.md` nor `content-2.md` as **individual pages**.
The resulting HTML files are under the `public` directory:

```
public/
├── about
│   └── index.html
└── posts
    └── my-post
        └── index.html
```


### Hugo Scroll mainsite

A practical example of a rendered leaf bundle is the Hugo Scroll [demo](https://zjedi.github.io/hugo-scroll/) mainsite.

##### The leaf bundle creation

[`content/en/homepage/index.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/index.md?plain=1)
creates the *leaf bundle* [`content/en/homepage/`](https://github.com/zjedi/hugo-scroll/tree/master/exampleSite/content/en/homepage).

##### The headless bundle creation

The key to this setup is the `headless: true` front matter in
[`content/en/homepage/index.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/index.md?plain=1).
This makes it a **headless bundle**. A [headless bundle](https://gohugo.io/content-management/page-bundles/#headless-bundles) has two main effects:
1. The `index.md` is **not rendered on its own**, same applies to rest of the bundle pages.
It will **not** go through the standard template **lookup order** to find a template (like `single.html`) to render itself into an HTML file.
This is the "headless" part.
2. Its page resources (here `opener.md`, `about-me.md`, etc.) are of course as in any leaf bundle **not** published individually.
Their sole purpose is to exist as `Page` objects in Hugo's internal memory, to be available to be fetched by a layout template via `.GetPage` or `.Resources`.

##### Lookup order, the template hierarchy

The file that defines the homepage for a language is `content/<language>/_index.md` since
[`hugo.toml`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/hugo.toml) sets:

```toml
[languages]
  [languages.en]
    weight = 10
    languageName = "English"
    contentDir = "content/en"
```

This file, for us `content/en/_index.md`, automatically gets the [`PAGE.Kind`](https://gohugo.io/methods/page/kind/) of **`home`**.
`hugo list all` confirms this:
 
```sh
hugo list all \
  | python3 -c "import csv, json, sys; print(json.dumps([dict(r) for r in csv.DictReader(sys.stdin)]))" \
  | jq '.[] | select(.kind=="home")'
```

Notice the penultimate JSON field:

```json {hl_lines="10"}
{
  "path": "content/en/_index.md",
  "slug": "",
  "title": "",
  "date": "0001-01-01T00:00:00Z",
  "expiryDate": "0001-01-01T00:00:00Z",
  "publishDate": "0001-01-01T00:00:00Z",
  "draft": "false",
  "permalink": "https://juanmarinero.github.io/",
  "kind": "home",
  "section": ""
}
```

The lookup order for `PAGE.Kind` is complex. After checking for more specific templates, the theme ultimately uses
`layouts/_default/index.html` to render the home page.

Challenge! Investigate the complete layout hierarchy followed, not just the final results.


##### How the layout template operates

The theme's **homepage layout**
[`layouts/_default/index.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/index.html)
is programmed to fetch the resources from this specific headless bundle.
It uses:
- `{{ $headless := .GetPage "./homepage" }}` to access the bundle
- Then `{{ $sections := $headless.Resources.ByType "page" }}` to get its sections.
- Finally `{{ $content := where (where $sections "Params.external" "==" nil) "Params.detailed_page_homepage_content" "ne" false }}`
has a `where` that filters the collection based on conditions (e.g., removing drafts, excluding external links)

The final single-page site is assembled by this layout based on:
- The **order** of the page resources can be set by `weigtht`, `date`, etc.
Check the [default sort order](https://gohugo.io/quick-reference/glossary/#default-sort-order) documentation.
In this theme it's sorted by the `weight` metadata.
Details in my post [How to **create** a **Hugo-scroll web**site](/blogs/create_hugo_website/#order-of-markdowns).
`{{ range $index_val, $elem_val := $content }}` line of
[`index.html`](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/layouts/_default/index.html#L144)
is the key,
when Hugo encounters a `range` loop over a page collection (like `$content`), it automatically applies the **default sort order** to that collection before iterating.
- The **content** of each resource file.

A deeper analysis of code lines of layouts templates is to come in next sections.

> [!warning] Previous layout locations might change in future because recent [changes to the `layouts` folder](https://gohugo.io/templates/new-templatesystem-overview/#changes-to-the-layouts-folder):
> Move all files in `layouts/_default` up to the layouts/ root.


##### Hugo Template Inheritance: How baseof.html integrates index.html 'main' block

This is a basic guide, therefore for us is enough to understand the next lines of
[`layouts/_default/baseof.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/baseof.html),
the final HTML renderer (*base template* using a Hugo-sh terminology).

```html
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
  <head>
    {{- partial "head.html" . -}}
  </head>
  <body>
    {{- partial "header.html" . -}}
    {{- block "main" . }}{{- end }}
    {{- partial "footer.html" . -}}

    [...]
  </body>
</html>
```

Note the `{{- block "main" . }}{{- end }}` line, there it's inserted the `main` block.
This is defined in [`layouts/_default/index.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/index.html),
since its first line `{{ define "main" }}` is closed by a `{{- end }}` line at EOF.

The footer integration is later explained in this [section](#hugo-template-inheritance-how-baseofhtml-integrates-footerhtml-content).

If you need to consolidate the Hugo's content knowledges we have introduced, just follow this 5 minutes tutorial building
[The **most basic** possible **Hugo site**](https://til.simonwillison.net/hugo/basic).
It's based on this [Gist](https://gist.github.com/simonw/6f7b6a40713b36749da845065985bb28).


### An undesired leaf bundle example

`content/en/leaf_bundle_wrong` file tree is:

```
leaf_bundle_wrong/
├── index.md
└── post_1.md
```

Navigate [there](/leaf_bundle_wrong) and check how a link to its sibling [`/leaf_bundle_wrong/post_1`](/leaf_bundle_wrong/post_1) does **not** work.

In next sections we study how to fix this. In summary:
- Use a *leaf bundle* as intended
  - Requiring just **one** `page` resource, a standalone page, e.g. `index.md`. Rest of page resources (`post_1.md`) are not needed
  - Or create a proper **layout** that concatenates the *leaf bundle* resources, as we show that [Hugo Scroll mainsite](#hugo-scroll-mainsite) does
- Alternative, of course, you can evolve it to a *branch bundle*.
You might remember that the current file structure is identical as seen in the first steps of the *branch bundle* [practical example](#practical-example),
when it was just a *leaf bundle*.


### The `type` front matter bypassing

The [docs](https://gohugo.io/content-management/front-matter/#type) define this front matter field as:

(`string`) The [content type](https://gohugo.io/quick-reference/glossary/#content-type),
overriding the value derived from the top-level section [read [theory](#theory)] in which the page resides.
Access this value from a template using the [`Type`](https://gohugo.io/methods/page/type/) method on a `Page` object.

Which is vague without the *content types* definition:

A _content type_ is a classification of content inferred from the top-level directory name or the `type` set in
[front matter](https://gohugo.io/quick-reference/glossary/#front-matter).
Pages in the root of the `content` directory, including the home page, are of type "page".
The content type is a contributing factor in the template lookup order and determines which [archetype](https://gohugo.io/content-management/archetypes/)
template to use when creating new content.

In the branch bundle [practical example](#practical-example), instead of generating a `_index.md`, and therefore a *branch bundle*, as we did before,
one can simply add the `type: section` *front matter* to `index.md`.
Now the [`post_1.md`](/leaf_bundle_to_branch_bundle/post_1) link will **appear** to work because the directory has changed:
- From a *leaf bundle* with markdowns of type "page"
- To a ~~branch bundle~~ *God knows what* with markdowns of type "section". The underlying file structure is still a *leaf bundle*.

Though using `type: section` on a regular page is a hack or an **unintended** use of the `type` field.
It violates the intended encapsulation methods for accessing a page's internal data, bypassing the intended mechanisms for setting a `section` *content type*.
The Hugo documentation is very clear about the structural difference between leaf and branch bundles.
The prescribed method for creating a "section" is to use an `_index.md` file. Not via `type: section` front matter.

Since this is not the standard (correct) approach to create a *branch bundle*, it can have totally unexpected results.
For example the respective `hugo list all` is equal as in original *leaf bundle*: still not including `post_1.md`.

So, what is the legitimate use of the `type` front matter?
The *content types* definition already pointed a frequent use of the `type` field:
change the **template lookup order** for a page.
This is what we apply next.


### Custom layouts for a leaf bundle

Remember next case scenario:
> These [`content-1.md`, `content-2`] are resources of resource type `page`, accessible via the [`Resources`] method on the `Page` object.
> Hugo will not render these as individual pages.

For the Hugo Scroll theme we already covered [here](#hugo-scroll-mainsite) how the `en/homepage/` leaf bundle is rendered with
[`layouts/_default/index.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/index.html).
But this layout is too complex for our learning purposes; we want a simpler example.
Thus, we will just expand the [`layouts/_default/single.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/single.html)
used for the [dedicated pages](#hugo-scroll-dedicated-pages) of this Hugo theme.

We want a new custom layout for our *leaf bundle*.
This layout should render in the `index.md` file...
- First its content exactly as constructed till now.
- Then the content of its sibling `post_1.md`, rendering its `title` front matter as `<h2>`. I emphasize, this is **not** rendered as an **individual page**.

To apply the new layout we must start creating a new *leaf bundle* directory.
`content/en/leaf_bundle_to_layout/` shall have the same tree file structure as `content/en/leaf_bundle_wrong/`:

```
leaf_bundle_to_layout/
├── index.md
└── post_1.md
```


1. In `content/en/leaf_bundle_to_layout/index.md` override the front matter [type](https://gohugo.io/content-management/front-matter/#type) with: `type: "leaf_bundle_to_layout"`.
2. Run `mkdir -p layouts/leaf_bundle_to_layout`
3. Edit `layouts/leaf_bundle_to_layout/single.html` as next. This template enlarges [`layouts/_default/single.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/single.html).
Pay particular attention to the highlighted lines.

```go {lineNos=inline hl_lines="28-33 42-45" style=monokai}
{{ define "main" }}
  <main class="content page-template page-{{ .Slug }}">
    <article class="post page">
      <header class="post-header">
        {{ with .Parent }}
          {{ if hugo.IsMultihost }}
          <a id="back-to-main-page" href="{{ .RelPermalink | relLangURL }}"><i class="fa fa-chevron-left" aria-hidden="true"></i> {{ or .Title .Site.Title }}</a>
          {{ else }}
        <a id="back-to-main-page" href="{{ .RelPermalink | relLangURL }}"><i class="fa fa-chevron-left" aria-hidden="true"></i> {{ or .Title .Site.Title }}</a>
          {{ end }}
        {{ end }}
      </header>
      <h1 class="post-title">{{ .Title }}</h1>
      <section class="post-content">
        {{ .Content }}
      </section>

      {{/* Check if `type` front matter changed the resource type */}}
      {{ with .ResourceType }}
        <div>Resource type: {{ . }} </div>
      {{ end }}
      {{/* And the Page.Type */}}
      {{ with .Page.Type }}
        <div>Page type: {{ . }} </div>
      {{ end }}
    </article>

    {{/* Render the resource's content directly */}}
    {{ $subpage := .Resources.Get "post_1.md" }}
    {{ if $subpage }}
      <article class="post page">
         <h2>{{ $subpage.Title }}</h2>
         <div>{{ $subpage.Content }}</div>
         {{/* Check if `type` front matter changed the resource type */}}
         {{ with $subpage.ResourceType }}
           <div>Resource type: {{ . }} </div>
         {{ end }}
         {{/* And the Page.Type */}}
         {{ with $subpage.Page.Type }}
           <div>Page type: {{ . }} </div>
         {{ end }}
      </article>
    {{ else }}
      <p>Debug: Resource 'post_1.md' not found.</p>
    {{ end }}

  </main>
{{ end }}
```

4. Build with `hugo server --disableFastRender` and check the result in [`content/en/leaf_bundle_to_layout/`](/leaf_bundle_to_layout).
Observe how the sibling `post_1.md` is rendered just after the `index.md` content.

These steps are a quick example of how to **target a specific template** by leveraging Hugo's
applying [template lookup rules](https://gohugo.io/templates/lookup-order/).
Read the docs for deeper understanding and customizations.

As challenge find out how to make the layout render all `page` resources inside the bundle, not just `index.md` and `post_1.md`,
but also `post_2.md`, `post_3.md`, `post_4.md`, etc.


#### `type` front matter on `index.md`

The first step we did was
1. In `content/en/leaf_bundle_to_layout/index.md` override the front matter [type](https://gohugo.io/content-management/front-matter/#type) with: `type: "leaf_bundle_to_layout"`.

One could think that the quoted statmenet could be adapted for our case scenario as:
These ~~[`content-1.md`, `content-2`]~~ `post_1.md` [, `post_2.md`, `post_3.md`, `post_4.md`, etc.] are resources of type ~~`page`~~ `leaf_bundle_to_layout`,
accessible via the [`Resources`] method on the `Page` object.

This would be **wrong** because 
the `type` front matter in `index.md` does **not change** the fundamental **nature** of the **resources inside the bundle**.


##### What `type: "leaf_bundle_to_layout"` in `index.md` actually does

1.  It **forces the *Page's* type**.
The `Page` object returned by the `index.md` file (the leaf bundle itself) contains a mandatory `.Type` method, the `"leaf_bundle_to_layout"`
instead of its default value.
But anyhow the `PAGE.Type` is the same as the default value it would have had,
which is derived (as stayed in the [type front matter doc](https://gohugo.io/content-management/front-matter/#type))
from the top-level section name (the directory `leaf_bundle_to_layout`).
The type front matter simply provides explicit control over this value.

2.  It **changes the [template lookup](https://gohugo.io/templates/lookup-order/#target-a-template) for the bundle**, which is the powerful feature we successfully leveraged.
It forces Hugo to look for rendering templates in `layouts/leaf_bundle_to_layout/` instead of the default location (`layouts/_default/`).
In the [`type` front matter bypassing](#the-type-front-matter-bypassing) section we insisted on this already.
The [PAGE.Type documentation](https://gohugo.io/methods/page/type/) briefly points this out too:
> The **`type`** field in front matter is also useful for **targeting a template**. See [details](https://gohugo.io/templates/lookup-order/#target-a-template).


##### What it does **NOT** do

- It does **not** change the `.ResourceType` (see [resource type](https://gohugo.io/quick-reference/glossary/#resource-type) glossary)
of the files inside the bundle (like `post_1.md`).

The next chunks of the previously shown `layouts/leaf_bundle_to_layout/single.html` demonstrate it.
- The first block outputs `page` as the resource type of `index.md`.
- The second displays the same for the `post_1.md` resource type.

On the other hand, the `Page.Type` is `leaf_bundle_to_layout` for the bundle's index page,
and the resource `post_1.md` is also associated with this type within the context of the bundle.

```html {lineNos=inline style=monokai linenostart=18}
{{/* Check if `type` front matter changed the resource type */}}
{{ with .ResourceType }}
  <div>Resource type: {{ . }} </div> <!-- page -->
{{ end }}
{{/* And the Page.Type */}}
{{ with .Page.Type }}
  <div>Page type: {{ . }} </div> <!-- leaf_bundle_to_layout -->
{{ end }}
```

```html {lineNos=inline style=monokai linenostart=34}
{{/* Check if `type` front matter changed the resource type */}}
{{ with $subpage.ResourceType }}
  <div>Resource type: {{ . }} </div> <!-- page -->
{{ end }}
{{/* And the Page.Type */}}
{{ with $subpage.Page.Type }}
  <div>Page type: {{ . }} </div> <!-- leaf_bundle_to_layout -->
{{ end }}
```

Check the results in the rendered [`content/en/leaf_bundle_to_layout/`](/leaf_bundle_to_layout) website.

This demonstrates that the `type` front matter affects template selection and page metadata (`Page.Type`)
but does not alter the fundamental **resource type** of the files within the bundle.


##### The key distinction: `Page.Type` vs. `Resource.ResourceType`

This is the heart of the confusion. Hugo has two related but different concepts:

**`Page.Type`** is the `Page` object representing a content file.
It's a high-level classification used for **template lookup**. Set by:
  - The section name, like `content/en/homepage` for the [Hugo Scroll mainsite](#hugo-scroll-mainsite)
  - Or by the `type` front matter as just exemplified.

**`Resource.ResourceType`** is an individual `Resource` object (a file inside a bundle).
This property is a low-level technical classification of the file's format and purpose.
This can be a `page`, `image`, `video`, etc.


##### The accurate description of our scenario

Therefore, the most precise description is:

**`post_1.md` is a resource of resource type `page`**,
accessible via the [`Resources`] method on the `Page` object.
The `Page` object for the bundle has its `Type` set to `"leaf_bundle_to_layout"` via front matter,
which dictates the template used to render the entire bundle.
Hugo will not render `post_1.md` as an individual page because it is located inside a leaf bundle folder.


## Hugo Scroll: header menus to any page

We will explore two techniques for adding items to the header menu in the Hugo Scroll theme.
In the process, we will also learn how the footer menu links are edited.

### Hard code

[`layouts/_default/index.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/index.html) code starts
creating the `$sections` collection with all the `page` resources from the `homepage` bundle.
This was explained in the headless bundle section 
[above](#how-the-layout-template-operates).

```go
{{ $headless := .GetPage "./homepage" }} {{/* Fetch the headless bundle */}}
{{ $sections := $headless.Resources.ByType "page" }}  {{/* Get all its Markdown page resources */}}
```

`.Site.BuildDrafts` checks if Hugo is building with drafts enabled:
- If true then keep all sections (including drafts)
- Otherwise, remove any pages that have `draft: true` in their front matter

```go
{{ $sections := cond .Site.BuildDrafts $sections (where $sections "Draft" "==" false) }}
```

And eventually the interesting block that loops the `$sections` pages:

```go
{{ range where $sections ".Params.header_menu" "eq" true }}
  {{ $button_title := .Title }}
  {{ with .Params.header_menu_title }}{{ $button_title = . }}{{ end }}

  {{ if isset .Params "external" }}
     <a class='btn site-menu' href='{{ .Params.external | absURL }}'>{{ $button_title }}&nbsp;<i class="fa fa-external-link"></i></a>
  {{ else if isset .Params "detailed_page_path" }}
     <a class='btn site-menu' href='{{ .Params.detailed_page_path | relLangURL }}'>{{ $button_title }}</a>
  {{ else }}
    {{ $fnav_title := .Title }}{{ with .Params.navigation_menu_title }}{{ $fnav_title = . }}{{ end }}
     <a class='btn site-menu' data-title-anchor='{{ anchorize $fnav_title }}' href='#{{ anchorize $fnav_title }}'>{{ $button_title }}</a>
  {{ end }}
{{ end }}
```

The condition `{{ range where $sections ".Params.header_menu" "eq" true }}` evaluates to `true` when the current page in the `range`-loop
has a `header_menu` front matter set to `true`.
For this same page, the nested condition `{{ if isset .Params "external" }}` evaluates to `true` when the page
has an `external` front matter.
[`content/en/homepage/external.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/external.md)
has both of these front matter fields set accordingly:

```yaml
---
title: "GitHub"
weight: 99
header_menu: true
external: https://github.com/zjedi/hugo-scroll
---
```

The resulting header menu button is

```html
<a
  class="btn site-menu"
  href="https://github.com/zjedi/hugo-scroll">
  GitHub&nbsp;
  <i class="fa fa-external-link"></i>
</a>
```

It's the one on the far right:

![Hugo_Scroll_demo_header_menu.png](/images/blogs/hugo_page_bundles/Hugo_Scroll_demo_header_menu.png)
{style="width:95%;"}


Just copy this markdown script and adapt the `title`, `weight` and `external` front matter values to your needs to
create a new header menu link in your Hugo Scroll mainsite.
Repeat as needed.


### `detailed_page_homepage_content: false`

The [`en/homepage/license.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/license.md?plain=1) is

```yaml
---
footer_menu_title: License
footer_menu: true
detailed_page_path: /license/
detailed_page_homepage_content: false
weight: 91
---
```

The `detailed_page_homepage_content` is set to `false` to
**exclude** the `content/en/homepage/license.md` page from the homepage **content**.
I.e. the layout described in the [Hugo Scroll mainsite](#hugo-scroll-mainsite) unit skips the rendering of the section `license.md`.
Since its `{{ .Content }}` will not be rendered, it has no *content*; it just contains the front matter lines.

The `detailed_page_path` front matter in `content/en/homepage/license.md` is set to `/license/`,
i.e. to `/content/en/license.md` (this file no longer resides in the `homepage` folder).
Therefore, the footer menu link points to this later page (and not to a external link as happened with the Github header menu link).

In summary, the cited layout skips this page content but it does render the footer menu link in the homepage.

Edit it to render a **header menu** button instead, and point to a `index.md` of a *branch bundle*: 

```yaml
---
header_menu_title: "Dedicated Section"
header_menu: true
detailed_page_path: /leaf_bundle_to_branch_bundle/
detailed_page_homepage_content: false
weight: 91
---
```

The scenario is analogous. The layout skips previous page content (no section for it), but it does create the header menu link in the homepage.


#### Hugo Template Inheritance: How baseof.html integrates footer.html content

The footer menu link rendering code is easy to understand as it's nearly identical to the header menu button explained in previous
[paragraph](#hard-code).

Just focus on next lines of [`layouts/partials/footer.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/partials/footer.html):

```go
{{ $headless := .Site.GetPage "/homepage" }}
{{ $sections := $headless.Resources.ByType "page" }}
[...]
 {{ range where $sections ".Params.footer_menu" "eq" true }}
        <li>
          <a href="{{ relLangURL .Params.detailed_page_path }}">{{ .Params.footer_menu_title }}</a>
        </li>
      {{ end }}
[...]
```

Finally, the `{{- partial "footer.html" . -}}` call in
[`layouts/_default/baseof.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/baseof.html)
(shown [here](#hugo-template-inheritance-how-baseofhtml-integrates-indexhtml-main-block))
executes this code and injects the resulting footer menu into the page.


## The `hugo list all` command

[`hugo list all`](https://gohugo.io/commands/hugo_list_all/) displays, in CSV format, values related to Hugo's internal [`Page`](https://gohugo.io/methods/page/) object:
- [`PAGE.Path`](https://gohugo.io/methods/page/path).
Do not confuse with the URL [path](https://gohugo.io/content-management/organization/#paths-explained),
- [`PAGE.Slug`](https://gohugo.io/methods/page/slug)
- [`PAGE.Title`](https://gohugo.io/methods/page/title)
- Etc.

The values for some of these attributes (like `title`, `slug`, `date`) can be populated or overridden by front matter,
while others (like `path`, `kind`, and `section`) are derived from the page's structure and location.

The following section explains the command's source code.
Feel free to skip this deep dive if you are only interested in using the command.


###### The `all` subcommand implementation

The core function that runs, defined in [`hugo/commands/list.go`](https://github.com/gohugoio/hugo/blob/70d62993eef4124873d339ded8fe612cc69f0238/commands/list.go#L151), is next.
This aims to pass which pages must be later inspected, i.e. `all` content pages.

```go
run: func(ctx context.Context, cd *simplecobra.Commandeer, r *rootCommand, args []string) error {
    shouldInclude := func(p page.Page) bool {
        return p.File() != nil
    }
    return list(cd, r, shouldInclude, "buildDrafts", true, "buildFuture", true, "buildExpired", true)
},
```


1. The `shouldInclude` is a filter function. It defines which pages should be included in the list.
- `func(p page.Page) bool`: It takes a Hugo Page object as input and returns `true` if it should be included.
- `return p.File() != nil`: This is the condition. It includes a page **only if it has an associated source file** (i.e., `p.File()` is not `nil`).
This is a crucial filter because it excludes auto-generated pages
like Hugo's taxonomy list pages (e.g., "Categories" or "Tags" pages)
which don't have a direct `index.md` or `_index.md` file.
This explains why `hugo list all` only shows your regular pages and section index files.

2. The `run` function then calls the generic `list(...)` where,
- `shouldInclude` is the filter function defined above.
- `"buildDrafts", true` instructs the command to include draft pages.
- `"buildFuture", true` instructs the command to include pages with a future publication date.
- `"buildExpired", true` instructs the command to include pages that have expired.


###### Collect the `PAGE` data

Once the pages are filtered, the `createRecord` function defines what data is collected for each page and how it's formatted for the CSV output.

```go
func newListCommand() *listCommand {
	createRecord := func(workingDir string, p page.Page) []string {
		return []string{
			filepath.ToSlash(strings.TrimPrefix(p.File().Filename(), workingDir+string(os.PathSeparator))),
			p.Slug(),
			p.Title(),
			p.Date().Format(time.RFC3339),
			p.ExpiryDate().Format(time.RFC3339),
			p.PublishDate().Format(time.RFC3339),
			strconv.FormatBool(p.Draft()),
			p.Permalink(),
			p.Kind(),
			p.Section(),
		}
	}
```


{{< rawhtml >}}
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
{{< /rawhtml >}}
