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
* [List pages not rendered](#list-pages-not-rendered)
* [The `hugo list all` command](#the-hugo-list-all-command)
* [Further recommended content](#further-recommended-content)


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

- A [**branch bundle**](https://gohugo.io/content-management/page-bundles/#branch-bundles):
  - It's a directory that contains an `_index.md` file and zero or more resources.
  - Analogous to a physical branch, a branch bundle may have descendants including *leaf bundles* and other *branch bundles*.
  - Top-level directories with or without `_index.md` files are also *branch bundles*. This includes the home page.

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
6. Remove the rendered files `rm -rf public/leaf_bundle_to_branch_bundle/`.
Or use the [`cleanDestinationDir`](https://gohugo.io/commands/hugo/#:~:text=%2D%2D-,cleanDestinationDir,-remove%20files%20from) in next step:
`hugo server --disableFastRender --gc --cleanDestinationDir --ignoreCache`
7. Run `hugo server --disableFastRender`

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

But `content/en/leaf_bundle_to_branch_bundle/_index.md` is not rendered (to `public/leaf_bundle_to_branch_bundle/index.html`)
because [`hugo.toml`](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/exampleSite/hugo.toml#L4)
disable `section` pages:

```toml
# This is a "one page"-website, so we do not need these kinds of pages...
disableKinds = ["section", "taxonomy", "term", "RSS", "robotsTXT"]
```

We deal with this sceneario in the unit [List pages not rendered](#list-pages-not-rendered).


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

Thus, run `cd en/content/en/leaf_bundle_to_branch_bundle && mv index.md post_2.md`.

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

So, in summary, `index.md` scripts are rendered if they are located where they should, that means in a singlepage *leaf bundle*.


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
This leaf bundle contains:

  - An index file
  - content-1, content-2.
    These are resources of [resource type](https://gohugo.io/quick-reference/glossary/#resource-type) `page`, accessible via the [`Resources`] method on the `Page` object. Hugo will not render these as individual pages.
  - image-1 and image-2 are resources of resource type `image`, accessible via the `Resources` method on the `Page` object


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

A *headless bundle* directory structure contains, as any *leaf bundle*:
- `index.md`, here called *headless page*
- Resource files (other Markdown files, images, etc.)

A *leaf bundle* is made *headless* by adding in the `index.md`'s front matter `headless = true`.
[#4311](https://github.com/gohugoio/hugo/issues/4311) proposed this feature.

A specific combination of settings within the
[cascade](https://gohugo.io/content-management/front-matter/#cascade-1).[build](https://gohugo.io/content-management/front-matter/#build)
front matter map is functionally equivalent to `headless = true`.
This approach offers more granular control and is the modern method for achieving the headless behavior.
Read:
- [Example – headless section](https://gohugo.io/content-management/build-options/#example--headless-section) from the docs
- And [this](https://discourse.gohugo.io/t/list-of-content-on-homepage-with-resources-headless/38133/2) a little bit more specific scenario
- [#6412](https://github.com/gohugoio/hugo/issues/6412#issuecomment-573446730)

A [headless bundle](https://gohugo.io/content-management/page-bundles/#headless-bundles) has two main effects:
1. The `index.md` is **not rendered on its own**.
It will **not** go through the standard template **lookup order** to find a template (like `single.html`) to render itself into an HTML file.
This is the "headless" part.
2. Its page resources (here `opener.md`, `about-me.md`, etc.) are of course as in any leaf bundle **not** published individually (`publishResources = false` build option).
Their sole purpose is to exist as `Page` objects in Hugo's internal memory, to be available to be fetched by a layout template via `.GetPage` or `.Resources`.

Wrapping up, no markdown in `content/en/homepage` is directly rendered,
for e.g. `public/homepage/index.html` is not created, nor `public/homepage/about-me/index.html`, etc.
Instead of a *directly* render, what's rendered is `public/index.html` thanks both the `content/en/_index.md`
and a clever layout code that get the page resources of the pagesless bundle `content/en/homepage/`.
Details in next sections.


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
is programmed to **fetch** the **resources** from the `content/en/homepage/` **headless bundle**.
It uses:
- `{{ $headless := .GetPage "./homepage" }}` to access the bundle
- The [`ByType`](https://gohugo.io/methods/page/resources/#bytype)
in `{{ $sections := $headless.Resources.ByType "page" }}` returns a collection of [page resources](https://gohugo.io/methods/page/resources/)
of the given media type
(which content might be later fetched as sections of the unique rendered page).
- Finally `{{ $content := where (where $sections "Params.external" "==" nil) "Params.detailed_page_homepage_content" "ne" false }}`
has a [`where`](https://gohugo.io/functions/collections/where/)
that filters the collection based on conditions (e.g., removing drafts, excluding external links)

The final single-page site is assembled by this layout based on:
- The **content** of each resource file.
- The **order** of the page resource in the `$content` collection.
`{{ range $index_val, $elem_val := $content }}` line of
[`index.html`](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/layouts/_default/index.html#L144).


Note the `$content` collection page have a **default order**:
1. The [default sort order](https://gohugo.io/quick-reference/glossary/#default-sort-order)
for page collections, used when no other criteria are set, follows this priority: weight, date, [...].
This order criteria is fixed, [link](https://discourse.gohugo.io/t/custom-sort-order-of-pages/31260/2).
2. Where, a [page collection](https://gohugo.io/quick-reference/glossary/#page-collection)
is a slice of Page objects.
3. Since 
`{{ $sections := $headless.Resources.ByType "page" }}` returns a collection of [page resources](https://gohugo.io/methods/page/resources/)
that later is filtered into `$content`.
4. And a [page resource](https://gohugo.io/quick-reference/glossary/#page-resource)
is a file within a page bundle.
5. Then, `$sections`, and consequently `$content`, is a slice of Pages objects, precisely of Pages of objects of subtype "page resources"
6. The documentation does not specify that a "page resource" cannot be part of a Page object.

The observation ratifies the pre-sorting, since:
- [`layouts/_default/index.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/index.html)
has no `.ByWeight()` to sort by a different criteria than the default sorting.
Read the [Hugo’s page collections explicit sorting](https://gohugo.io/quick-reference/page-collections/#sort).
- And at the same time we observe services, contact,... appear sorted, by their `weight` front matter,
into their respective sections of the Hugo Scroll [demo mainsite](https://zjedi.github.io/hugo-scroll/).

An important note. If the returned list of resource were not pages but for example images,
like `{{ $sections := $headless.Resources.ByType`**`"image"`**`}}` then this slice would not be pre-sorted.

If `$section` was not default sorted, then the `range` loop would not sort it.
Hugo's `render` only pre-sorts maps, [link](https://gohugo.io/functions/go-template/range/#maps) 
> Unlike ranging over an array or slice, Hugo **sorts by key** when **rang**ing over **a map**.

Thus, the Go's [`range`](https://go.dev/wiki/Range)-loop mechanism is enhanced in Hugo's `range` to first sort maps by key.
Since `$content` is a [page resources](https://gohugo.io/methods/page/resources/) **array**,
and not a [**map**](https://gohugo.io/quick-reference/glossary/#map),
then `render` will not pre-sort it.
`{{ range $index_val, $elem_val := $content }}` would be equivalent in Python to an `enumerate`-loop: `for index_val, elem_val in enumerate(content): pass`.



A deeper analysis of code lines of layouts templates is to come in next sections.

> [!warning] Previous layout locations might change in future because recent [changes to the `layouts` folder](https://gohugo.io/templates/new-templatesystem-overview/#changes-to-the-layouts-folder):
> Move all files in `layouts/_default` up to the `layouts/` root.


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

Next video tutorial explains this more visually.

{{< youtube id=Vj5zy2q7O9U start=771 loading="lazy" >}}


The footer integration is later explained in this [section](#hugo-template-inheritance-how-baseofhtml-integrates-footerhtml-content).

If you need to consolidate the Hugo's content knowledges we have introduced, just follow this 5 minutes tutorial building
[The **most basic** possible **Hugo site**](https://til.simonwillison.net/hugo/basic).
It's based on this [Gist](https://gist.github.com/simonw/6f7b6a40713b36749da845065985bb28).

I recommend the following 40+ minutes video by [Berkay Çubuk](https://www.youtube.com/@berkaycubuk) too.

{{< youtube id=aSd_Ha5nDkM loading="lazy" >}}

Giraffe Academy [Block Templates](https://www.giraffeacademy.com/static-site-generators/hugo/block-templates/) 7 minutes video and post is good too.
Complete it with his [Partial Templates](https://www.giraffeacademy.com/static-site-generators/hugo/partial-templates/) post.


Finally, if you mastered everything till now, then try to understand further
[headless page](https://gohugo.io/content-management/build-options/#example--headless-page) examples,
not just the Hugo Scroll mainsite. For example:
- A simple [headless page](https://discourse.gohugo.io/t/using-headless-pages-in-section-lists-in-hugo/15275/4)
- Another simple [headless page](https://discourse.gohugo.io/t/list-of-content-on-homepage-with-resources-headless/38133/2)
- Headless bundles and content structure, [link](https://discourse.gohugo.io/t/headless-bundles-and-content-structure/16234/4)

In other scenarios a headless bundle it's not the right or simpler approach:
- *Listing headless bundles (as opposed to just retrieving a single one) is a right pain*. Links
[1](https://greenash.net.au/thoughts/2021/02/on-hugo/#:~:text=listing%20headless%20bundles%20(as%20opposed%20to%20just%20retrieving%20a%20single%20one)%20is%20a%20right%20pain),
[2](https://discourse.gohugo.io/t/how-to-iterate-over-headless-pages/12536/21),
[3](https://discourse.gohugo.io/t/how-to-iterate-over-headless-pages/12536/24),
[4](https://greenash.net.au/thoughts/topics/hugo/)
.


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

https://gohugo.io/templates/types/
> A *section* template renders a list of pages within a [*section*](https://gohugo.io/quick-reference/glossary/#section).

The idea is basically apply next 3 minutes video proccess in *leaf bundle*s.

{{< youtube id=jrMClsB3VsY loading="lazy" >}}

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
- Then the content of its sibling `content-1.md`, rendering its `title` front matter as `<h2>`. I emphasize, this is **not** rendered as an **individual page**.

To apply the new layout we must start creating a new *leaf bundle* directory.
`content/en/leaf_bundle_to_layout/` shall have the same tree file structure as `content/en/leaf_bundle_wrong/`:

```
leaf_bundle_to_layout/
├── index.md
└── content-1.md
```


1. In `content/en/leaf_bundle_to_layout/index.md` override the [type](https://gohugo.io/content-management/front-matter/#type) front matter with: `type: "leaf_bundle_to_layout"`.
2. Run `mkdir -p layouts/leaf_bundle_to_layout`
3. Edit `layouts/leaf_bundle_to_layout/single.html` as next.
[This template](https://github.com/juanMarinero/juanmarinero.github.io/blob/main/layouts/leaf_bundle_to_layout/single.html)
enlarges [`layouts/_default/single.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/single.html).
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
    {{ $subpage := .Resources.Get "content-1.md" }}
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
      <p>Debug: Resource 'content-1.md' not found.</p>
    {{ end }}

  </main>
{{ end }}
```

4. Build with `hugo server --disableFastRender` and check the result in [`public/leaf_bundle_to_layout/index.html`](/leaf_bundle_to_layout).
Observe how the sibling's `content-1.md` title and content is rendered as a section after the `index.md` content.

These steps are a quick example of how to **target a specific template** by leveraging Hugo's
[template lookup rules](https://gohugo.io/templates/lookup-order/).
Read the docs for deeper understanding and customizations.

Challenge: edit the layout code to make it render all `page` resources inside the bundle, not just `index.md` and `content-1.md`,
but also `content-2.md`, `content-3.md`, etc.


#### `type` front matter on `index.md`

The first step we did was
1. In `content/en/leaf_bundle_to_layout/index.md` override the front matter [type](https://gohugo.io/content-management/front-matter/#type) with: `type: "leaf_bundle_to_layout"`.

One could think that the quoted statmenet could be adapted for our case scenario as:
These `content-1.md`, `content-2.md`[, etc.] are resources of type ~~`page`~~ `leaf_bundle_to_layout`,
accessible via the [`Resources`] method on the `Page` object.

This would be **wrong** because 
the `type` front matter in `index.md` does **not change** the fundamental **nature** of the **resources inside the bundle**.


##### What `type: "leaf_bundle_to_layout"` in `index.md` actually does

1.  It **forces the *Page's* type**.
The `Page` object returned by the `index.md` file (the leaf bundle page) contains a mandatory `.Type` method, the `"leaf_bundle_to_layout"`
instead of its default value.
But anyhow the `PAGE.Type` is the same as the default value it would have had,
which is derived (as stayed in the [type front matter doc](https://gohugo.io/content-management/front-matter/#type))
from the top-level section name (the directory `leaf_bundle_to_layout`).
The type front matter simply provides explicit control over this value.

2.  It **changes the [template lookup](https://gohugo.io/templates/lookup-order/#target-a-template) for the bundle**, which is the powerful feature we successfully leveraged.
It forces Hugo to look for rendering templates in `layouts/leaf_bundle_to_layout/` instead of the default location (`layouts/_default/`).
In the [`type` front matter bypassing](#the-type-front-matter-bypassing) section we cited this legitime technique already.
The [PAGE.Type documentation](https://gohugo.io/methods/page/type/) briefly points this out too:
> The **`type`** field in front matter is also useful for **targeting a template**. See [details](https://gohugo.io/templates/lookup-order/#target-a-template).


##### What it does **NOT** do

- It does **not** change the `.ResourceType` (see [resource type](https://gohugo.io/quick-reference/glossary/#resource-type) glossary)
of the files inside the bundle (like `content-1.md`).

The next chunks of the previously shown `layouts/leaf_bundle_to_layout/single.html` demonstrate it.
- The first block outputs `page` as the resource type of `index.md`.
- The second displays the same for the `content-1.md` resource type.
- The `Page.Type` displayed for the bundle's index page is `leaf_bundle_to_layout`.
The resource `content-1.md` is also associated with this type within the context of the bundle.

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

Check the results in the rendered [`public/leaf_bundle_to_layout/index.html`](/leaf_bundle_to_layout) website.

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

**`content-1.md` is a resource of resource type `page`**,
accessible via the [`Resources`] method on the `Page` object.
The `Page` object for the bundle has its `Type` set to `"leaf_bundle_to_layout"` via front matter,
which dictates the template used to render the entire bundle.
Hugo will not render `content-1.md` as an individual page because it is located inside a leaf bundle folder.


## Hugo Scroll: header menus to any page

We add items to the header menu in the Hugo Scroll theme.
In the process, we will also learn how the footer menu links are edited.

### External links

[`layouts/_default/index.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/index.html) code starts
declaring `$sections`, a [pre-sorted by `weight` front matter] collection of page resources.
This was explained in the headless bundle section 
[above](#how-the-layout-template-operates).

```go
{{ $headless := .GetPage "./homepage" }} {{/* Fetch the headless bundle */}}
{{ $sections := $headless.Resources.ByType "page" }}  {{/* Get pre-sorted all its Markdown page resources */}}
```

`.Site.BuildDrafts` checks if Hugo is building with drafts enabled:
- If true then keep all sections (including drafts)
- Otherwise, remove any pages that have `draft: true` in their front matter

```go
{{ $sections := cond .Site.BuildDrafts $sections (where $sections "Draft" "==" false) }}
```

And eventually the interesting block that loops the `$sections` pages:

```go {hl_lines="1 5"}
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


Finally, what about the **order** of these header menu **buttons**?
In the headless bundle section [above](#how-the-layout-template-operates)
we demonstrated that
the page resources contained in the `$sections` slice are **pre-sorted** by the `weight` front matter (of each of the page resources).
Therefore, `{{ range where $sections ".Params.header_menu" "eq" true }}`
iterates a `$sections`-list already sorted by `weight`.
Example:
- On the far left is the button pointing to the
[`content/en/homepage/services.md`](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/exampleSite/content/en/homepage/services.md?plain=1#L5)
section content.
This is because its `weight` front matter value of `5` is the lowest among the `$sections`.
- The button furthest to the right belongs to the external Github because
[`content/en/homepage/external.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/external.md)
has the highest `weight` front matter value of `99`.
- We can infer that the remaining buttons correspond to Markdown files with weights ranging from 5 to 99.


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

The scenario is analogous. The layout skips previous page content (no section in the homepage for its content), but it does create the header menu link in the homepage.

Here the `detailed_path` front matter exists in a resource page. I.e. focus on next code lines of the `index.html` layout:

```go
{{ else if isset .Params "detailed_page_path" }}
     <a class='btn site-menu' href='{{ .Params.detailed_page_path | relLangURL }}'>{{ $button_title }}</a>
```


#### Hugo Template Inheritance: How baseof.html integrates footer.html content

The footer menu link rendering code is easy to understand as it's nearly identical to the header menu button explained in previous
[paragraph](#external-links).

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


## List pages not rendered

### Render lists vs SAP

The rendering of next branch bundle `content/posts/` (left side of next tree file representations) is:
- The next **left** image if the Hugo's `hugo.toml`-`disableKinds` does **not** include `"section"`. This is the standard.
- The next **right** image if the Hugo's `hugo.toml`-`disableKinds` does **yes** include `"section"`.
For example in the Hugo Scroll [demo](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/exampleSite/hugo.toml#L4).

{{< rawhtml >}}
  <table class="data-table">
    <tr>
      <td class="data-cell">
        <img
          src="/images/blogs/hugo_page_bundles/hugo_branch_standar_render.png"
          alt="SAP. _index.md and branch bundles if layouts/_default/index.html if hugo.toml disableKinds does not include 'section'-s"
          class="table-image">
      </td>
      <td class="data-cell">
        <img
          src="/images/blogs/hugo_page_bundles/hugo_branch_SAP.png"
          alt="_index.md and branch bundles if layouts/_default/index.html hugo.toml disableKinds does yes include 'section'-s"
          class="table-image">
      </td>
    </tr>
  </table>
{{< /rawhtml >}}

### Hugo Scroll is a SAP

The Hugo Scroll theme is coded to be a Single-Page Application (SPA)
because [`exampleSite/hugo.toml`](https://github.com/zjedi/hugo-scroll/blob/54f7b8543f18d6ae54490f5bb11ea1905bfeffd7/exampleSite/hugo.toml#L4)
sets `disableKinds = ["section", [...]]`.

In summary, it's meant to:
- Render the homepage from the homepage *headless bundle*.
Explained in the [Hugo Scroll mainsite](#hugo-scroll-mainsite) section.
Here the `_index` scripts is yes **rendered**.
We already show this in the CSV output above for `content/en/_index.md`.
- Render everything else using the `single.html` template.
Read [Hugo Scroll dedicated pages](#hugo-scroll-dedicated-pages) paragraph.

Then, no surprise that Hugo Scroll
[`layouts/_default/list.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/_default/list.html)
is empty.


#### How to reverse this

1. Edit your `hugo.toml`-`disableKinds` line: remove the chars `"section" `.
2. Edit your `layouts/_default/list.html` to next.

```go
{{ define "main" }}
<div class="container">
  <h1>{{ .Title }}</h1>
  
  <ul>
    {{ range .Pages }}
      <li>
        <a href="{{ .RelPermalink }}">{{ .Title }}</a>
      </li>
    {{ end }}
  </ul>
  
  {{ .Content }}
</div>
{{ end }}
```

3. Build. Run `hugo server --disableFastRender`.
4. Check `public/posts/_index.html` is rendered, view it in the browser via [http://localhost:1313/posts/](http://localhost:1313/posts/).

The previous `list.html` is basic. Read other template alternatives, for example next ones are sorted by complexity.
- [Hugo XMin](https://github.com/yihui/hugo-xmin)'s
[`list.html`](https://github.com/yihui/hugo-xmin/blob/master/layouts/list.html)
- [Hugo Coder](https://github.com/luizdepra/hugo-coder)'s
[`list.html`](https://github.com/luizdepra/hugo-coder/blob/main/layouts/list.html).
- [Hugo PaperMod](https://github.com/adityatelange/hugo-PaperMod)'s
[`list.html`](https://github.com/adityatelange/hugo-PaperMod/blob/master/layouts/_default/list.html),

#### Workaround in SAP projects

This very website you are reading is thanks to the branch bundle [`content/en/blogs/`](https://github.com/juanMarinero/juanmarinero.github.io/tree/main/content/en/blogs).

In this Hugo project
`hugo.toml`-`disableKinds` contains `"section"`.
Thus, each `_index.md` **branch page**, for example the one in the `content/en/blogs/` branch bundle, is **not rendered**.
I.e. `public/blogs/index.html` is not generated, and therefore https://juanmarinero.github.io/blogs/ should show 404 (which is not the case because it's aliased as I clarify below).

This could be easily fixed following the steps of previous section, but:
- I am not sure what `list.html` layout would suit me. Or the one I need is too complex as I explain below.
- I want to manually edit the markdown that lists my posts.
These posts are the markdowns contained in the folder `content/en/blogs/`.
Sidenote, it's `blogs/` and not `posts/` because I write about different thematics like coding, books and travel;
I consider every topic a blog (which contains posts). 

To manually edit my list of posts I just use the dedicated page
[`content/en/blogs_index.md`](https://github.com/juanMarinero/juanmarinero.github.io/blob/main/content/en/blogs_index.md),
whose layout renderer is `single.html`.

The proccess is, as I said, manual. I write the blogs—topic— headers and their respectives links to the proper posts.
For example, for my blog about books the header and first post link are coded in my list of posts (`blogs_index.md`) with:

```texts
### 📚 Books

{{</* rawhtml */>}}
<div class="blogs_index">
  <a href="/blogs/tolkien/" class="no-underline-except-hover">
  <span style="font-family: 'MiddleEarth JoannaVu', cursive; font-size: 2.3rem;">Tolkien</span>:
  books, podcasts and much more!
  </a>
</div>
{{</* /rawhtml */>}}
```

Finally in `content/en/blogs_index.md` front matter, one can either:
- Add next array of [`aliases`](https://gohugo.io/content-management/front-matter/#aliases)
```toml
aliases: 
- blogs
```
- Or set the [`url`](https://gohugo.io/content-management/front-matter/#url) front matter to `"blogs/"`.

The later approach just enables https://juanmarinero.github.io/blogs/ (https://juanmarinero.github.io/blogs_index/ would show a 404).

The first option is the one I used.
It redirects https://juanmarinero.github.io/blogs/ (which is no longer a 404) to https://juanmarinero.github.io/blogs_index/.
So, both links are accesibles.
And consequently, not only the
[`public/blogs_index/index.html`](https://github.com/juanMarinero/juanmarinero.github.io/blob/main/public/blogs_index/index.html) is still generated,
but also 
[`public/blogs/index.html`](https://github.com/juanMarinero/juanmarinero.github.io/blob/main/public/blogs/index.html)
is created as a client-side redirection to the `blogs_index` website:


```html {hl_lines="8"}
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>http://localhost:1313/blogs_index/</title>
    <link rel="canonical" href="http://localhost:1313/blogs_index/">
    <meta name="robots" content="noindex">
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=http://localhost:1313/blogs_index/">
  </head>
</html>
```

Note. `<link rel="canonical" href="http://localhost:1313/blogs_index/">`
does **not redirects**.
Instead, it is a signal to search engines saying: *This URL is the preferred (canonical) version of this page.*
It helps avoid duplicate content issues by telling search engines which URL to index and display in search results.

I choose the first option. Because the *shock* that produces me that:
- A post's URL ends in `/blogs/<post-name>`
- Meanwhile, the URL shown in the browser for the list of posts ends in `/blogs_index/` (for both links because of the alias redirection).
This *surprises* me because the natural URL of the list, in a non SAP website, would simply end in `/blogs/` —and I must have a minor obsession with order, hehe.

I kind of like this *shock* because it servers as an efficient reminder that the list of posts
is not generated automatically via a `list.html` layout.
It's my duty to keep it up to date,
which I happily do because so I customize the order of these links as I write more posts.

To give you an idea, suppose I have just three posts in the "books" blog.
I wrote a post about Tolkien,
then another about a different author (e.g. Shakespeare),
and then again other concering Middle Earth.
Now I want the first link followed by the third (boths of same sub-topic) in the list of posts,
and not chronologically sorted obtained if
these posts had same `weight` front matter and my `list.html` layout just uses the collection of pages pre-sort
(more about this default pre-sort [here](#how-the-layout-template-operates)).

Of course,
I could code a `list.html` layout that checks a non-official `topic` front matter (set it in previous three posts to "books"),
then add another `sub-topic` front matter (e.g. previous posts would have here "Tolkien", "Shakespeare" and "Tokien" respectively).
And finally, if same topic and same sub-topic, then sort by the `weigth` front matter (and/or by `date`).
Though the `topic` can be skipped if I reorder every post markdown into a folder of its topic, which is not the case since I am not sure,
e.g. the blog about web-dev might in future be splitted into NodeJS and Deno and I don't want (for now) to have to reorder the script locations,
nor the links to these posts coded in other pages (like when a post invites to read another post).
To group content together even if that content isn't in the same directory in the content folder,
one can use [taxonomies](https://www.giraffeacademy.com/static-site-generators/hugo/taxonomies/) (`hugo.toml`-`disableKinds` must not hindern us).
In conclusion, this proposed layout would be quite complex, and for now my manual strategy is enough.

Notice, though, that this whole proccess —manual updating of a list of posts— would be too tedious if I had hundreds of posts or if I wrote many every day.
I could even lose track of a no-[draft](https://gohugo.io/methods/page/draft/) post and fortget to add it to the list.
It can also happen that I forget to comment out links to posts that shouldn't be visible in the list, for example the drafts.
Thus, in this high production of posts scenario, copying/populating the `list.html` layout that automatically lists the posts would be more convenient and efficient.
Work smart, not hard.


### Understanding list pages and its template hierarchy

In the [introduction](#introduction) we studied that:

- A [**section**](https://gohugo.io/content-management/sections/)
is a top-level content directory or any content directory containing an `_index.md` file.

- A [**list page**](https://gohugo.io/quick-reference/glossary/#list-page)
is a type of page (a `Page` object) that is defined by its purpose: it receives and is designed to display a collection of other pages.
Its [context](https://gohugo.io/templates/introduction/#context) includes a collection of pages (e.g., `.Pages`, `.RegularPages`) that it is meant to list.

The [docs](https://gohugo.io/templates/types/#list) also specify that a *list* template is a **fallback** for
[home](https://gohugo.io/templates/types/#home),
[section](https://gohugo.io/templates/types/#section),
[taxonomy](https://gohugo.io/templates/types/#taxonomy), and
[term](https://gohugo.io/templates/types/#term) templates.
If one of these template types does not exist, Hugo will look for a *list* template [`list.html`] instead.
The *list* template precedence hierarchy can be summarized as follows: `home > section > taxonomy > term > list`.

Why? Read [template lookup order](https://gohugo.io/templates/lookup-order/).

So, a *list template* is a layout template (`list.html`, `section.html`,...) used to render index pages for collections of content.
While these collections are often **sections**, a *list template* also renders other types of index pages that are *not* sections.

A collection of content can be a *branch bundle*.
Remember from the [introduction](#introduction) that a [**branch bundle**](https://gohugo.io/content-management/page-bundles/#branch-bundles)
might be a top-level directories with or without `_index.md` files. This includes the home page.

Therefore, if without a `_index.md` file, this mentioned top-level folder is **not a section**.

Sidenote. The *home page* is a special *list page* that's rendered, if possible, by `layouts/index.html` or `layouts/_default/index.html`,
following the same principle of template specificity (`home > section > ...`).


#### Practical demonstration: template lookup order in action

Let's code a Minimal Working Example continuing the previous one that populated the `list.html` layout.
Thus, we'll have both `list.html` and a `section.html` layout templates.

For any content directory (branch bundle) that generates a list page,
Hugo will use the most specific available template according to its lookup order.
Since we have a `section.html` template and no more specific templates, it will be used for both:
1. True sections (directories with `_index.md`)
2. Branch bundles that are not sections (directories without `_index.md`)

First edit your `hugo.toml`-`disableKinds` line: remove the chars `"section" `.

Then, if not already done, populate the `list.html` layout as explained in this [previous paragraph](#how-to-reverse-this).

We can just use a copy of `list.html` and rename it to `section.html`.
Then modify it to display a new `<h1>` so we know which layout rendered each list page.
This's coded in the second line because `{{ define "main" }}` (first line of layout) and its `{{ end }}` (at EOF) must wrap all.


```sh
cd layouts/_default \
  && cp list.html section.html \
  && sed -i '1a <h1>Rendered by section.html</h1>' section.html \
  && head section.html \
  && cd -
```

Create the `articles/` directory and scripts:

```sh
# content/en/ not needed in path
hugo new articles/article-one.md
hugo new articles/article-two.md
```

Note that `content/en/articles/` is a *branch bundle* it's a top-level directories [with or] without `_index.md` file and it also lacks `index.md` (to be a *leaf bundle*).
But not a *section* because it doesn't have an `_index.md` file.

Let's inspect the markdowns with `cat` or [`bat`](https://github.com/sharkdp/bat):
```sh
bat content/en/articles/*
```

```texts
───────┬─────────────────────────────────────────
       │ File: content/en/articles/article-one.md
───────┼─────────────────────────────────────────
   1   │ ---
   2   │ title: 'Article One'
   3   │ ---
   4   │ 
   5   │ This is a page about »Article One«.
───────┴─────────────────────────────────────────
───────┬─────────────────────────────────────────
       │ File: content/en/articles/article-two.md
───────┼─────────────────────────────────────────
   1   │ ---
   2   │ title: 'Article Two'
   3   │ ---
   4   │ 
   5   │ This is a page about »Article Two«.
───────┴────────────────────────────────────────
```

The `archetypes/default.md` layout is responsible for the front matter and content.
It's:


```texts
---
title: '{{ replace .Name "-" " " | title }}'
---

This is a page about »{{ replace .Name "-" " " | title }}«.
```

Create the `projects/` directory and scripts:

```sh
hugo new projects/project-alpha.md
hugo new projects/project-beta.md
hugo new projects/_index.md
bat content/en/projects/* # inspect
```

This is obviously a *branch bundle*.

We are ready to build the site with `hugo server --disableFastRender`.

Verify that:
- `public/articles/_index.html` is rendered by `section.html`, view it in the browser via [http://localhost:1313/articles/](http://localhost:1313/articles/).
- `public/projects/_index.html` is rendered by `section.html` too, browse it with [http://localhost:1313/projects/](http://localhost:1313/projects/).

Let's summarize our findings.

`layouts/_default/` holds both `section.html` and `list.html`. The first has priority over the second to render a *list* page.

Our testing project has:
- A `projects/` section with `_index.md` (a branch bundle and section)
- And `articles/` as a ~~section~~ content folder without `_index.md` (a branch bundle and **no** section).

Although `articles/` is not a section (no `_index.md`),
it is still rendered by `section.html` because Hugo treats any content directory as a potential list page,
and since we have `section.html`, it is used for such directories due to the template lookup order.
However, strictly speaking, only directories with `_index.md` are *sections*.
Without `_index.md`, it is a branch bundle but not a section, but it still generates a list page that uses the section template if available.

Run `tree public/articles public/projects`:

```text
content/en/
├── _index.md            # 🏠 Homepage
│
├── projects/            # 🌿 A section directory
│   ├── _index.md        # Projects section page
│   ├── project-alpha.md # ...uses section.html
│   └── project-beta.md
│
└── articles/            # 🌿 Branch bundle but no section
    │                    # Projects section page
    ├── article-one.md   # ...uses section.html
    └── article-two.md
```

Hugo builds:

```text
public/
├── index.html         # 🏠 Homepage by index.html
│
├── projects/          # 🌿
│   ├── index.html     # Rendered by section.html ❗
│   ├── project-alpha/
│   │   └── index.html # Single page by single.html
│   └── project-beta/
│       └── index.html # Single page by single.html
│
└── articles/          # 🌿
    ├── index.html     # Rendered by section.html ❗
    ├── article-one/
    │   └── index.html # Single page by single.html
    └── article-two/
        └── index.html # Single page by single.html
```



#### Overriding template selection with front matter

We already saw how to use a [Custom layouts for a leaf bundle](#custom-layouts-for-a-leaf-bundle).

Now the scenario is not quite the same:
- It's a branch bundle.
- And we solve the requirement with an standard template (located in `layouts/_default/`).

For our case it's enough to add `layout: "list"` to the front matter of `content/en/projects/_index.md`:

```sh
sed -i '2a layout: "list"' content/en/projects/_index.md
```

`cat content/en/projects/_index.md` prints the script:

```text
---
title: 'Projects'
layout: "list"
---

This is a page about »Projects«.
```


Re-build the site with `hugo server --disableFastRender`. Audit that:
- `public/articles/_index.html` is still rendered by `section.html`, [http://localhost:1313/articles/](http://localhost:1313/articles/).
- `public/projects/_index.html` is now rendered by `list.html`, [http://localhost:1313/projects/](http://localhost:1313/projects/).

Therefore, the same file structure is rendered differently.

```text
content/
├── _index.md            # 🏠 
│
├── projects/            # 🌿
│   ├── _index.md        # layout front matter
│   ├── project-alpha.md # ...set to "list"
│   └── project-beta.md
│
└── articles/            # 🌿
    │
    ├── article-one.md
    └── article-two.md
```

Notice the exclamation marks emojis.
```text
public/
├── index.html         # 🏠 Homepage by index.html
│
├── projects/          # 🌿
│   ├── index.html     # Rendered by list.html ‼️
│   ├── project-alpha/
│   │   └── index.html # Single page by single.html
│   └── project-beta/
│       └── index.html # Single page by single.html
│
└── articles/          # 🌿
    ├── index.html     # Rendered by section.html ❗
    ├── article-one/
    │   └── index.html # Single page by single.html
    └── article-two/
        └── index.html # Single page by single.html
```

Challenge! Without removing `section.html` generate `public/articles/_index.html` with `list.html`.


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


## Further recommended content

- [Better together with page bundles](https://hugo-in-action.foofun.cn/docs/part1/chapter4/3/)
from the ebook [Hugo in Action](https://hugo-in-action.foofun.cn/)
by [Atishay Jain](https://atishay.me/)
- [Introduction to Hugo Bundles](https://www.ii.com/hugo-bundles/) by [Infinite Ink](https://www.ii.com/)
- [Hugo: Leaf and Branch Bundles](https://scripter.co/hugo-leaf-and-branch-bundles/)
by [Kaushal Modi](https://github.com/kaushalmodi/).
- [Hugo's video tutorials](https://www.youtube.com/watch?v=qtIqKaDlqXo&list=PLLAZ4kZ9dFpOnyRlyS-liKL5ReHDcj4G3&index=1) by Giraffe Academy
- [Hugo's video tutorials](https://www.youtube.com/watch?v=l7PHRA8t4Bw&list=PLE92IfveVXuXTOjdPM_nleN6Cga_d3uJ-&index=1) by Future Web Design


{{< rawhtml >}}
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
{{< /rawhtml >}}
