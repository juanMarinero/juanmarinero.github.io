---
title: "Hugo shortcodes: step by step"
---

Hugo brings pre-defined [shortcodes](https://gohugo.io/shortcodes/) to **expand** your content beyond the basic **markdown syntax**.
The [official **docs**](https://gohugo.io/shortcodes/) explain them quite well.
The goal of this post is to distill the essential information into concise, ready-to-use Minimal Working Examples (**MWE**) for easy **copy-past**ing.
As well as really understanding the code behind so you can create **your own shortcodes**.



{{< rawhtml >}}
<div class="html-content">
<div id="index"> </div>
</div>
{{< /rawhtml >}}


{{< details summary="**Index** - Click to expand 📜">}}

* [Go and Hugo code basics](#details)
  * [Shortcode templates vs call](#shortcode-templates-vs-call)
  * [Go basics](#go-basics)
  * [.Get](#get)
    * [Positional arguments](#positional-arguments)
    * [Named arguments](#named-arguments)
    * [Both named and positional args](#both-named-and-positional-args)
  * [if-else-end](#if-else-end)
* [Details](#details)
  * [MWE](#details-mwe)
  * [Practical usage](#details-practical)
  * [Declaration ](#details-declaration)
    * [Parameters declaration](#parameters-declaration)
    * [Get values](#get-values)
    * [Render](#render)
  * [Docs](#details-docs)
* [Figure](#figure)
  * [MWE](#fig-mwe)
  * [Docs](#fig-docs)
  * [Declaration](#fig-declaration)
* [Gist shortcode](#gist-shortcode)
* [Highlight](#highlight)
  * [MWE](#highlight-mwe)
  * [Syntax highlighting](#syntax-highlighting)
  * [Declaration](#highlight-declaration)
* [Instagram](#instagram)
  * [MWE](#instagram-mwe)
  * [Declaration](#instagram-declaration)
* [Param](#param)
  * [MWE](#param-mwe)
  * [Declaration](#param-declaration)
* [QR](#qr)
  * [MWE](#qr-mwe)
  * [Declaration](#qr-declaration)
* [Ref](#ref)
* [Relref](#relref)
* [Vimeo](#vimeo)
  * [MWE](#vimeo-mwe)
  * [Declaration](#vimeo-declaration)
* [X - Twitter](#x---twitter)
  * [MWE](#x-mwe)
  * [Declaration](#x-declaration)
* [YouTube](#youtube)
  * [MWE](#youtube-mwe)
  * [Declaration](#youtube-declaration)
* [Override a default shortcode](#override-a-default-shortcode)
* [Hugo Scroll](#hugo-scroll)
  * [Raw HTML](#raw-html)
  * [contact_list](#contact_list)
  * [email and phone](#email-and-phone)
  * [extlink](#extlink)
  * [icon](#icon)

{{< /details >}}


{{< rawhtml >}}
<div class="html-content">
<br>
</div>
{{< /rawhtml >}}


## Go and Hugo code basics

Basic **coding skills** are indispensable to understand later shortcode templates.

This guide constanstly links **official doc**umention for reference.
Though a **basic** knowledge of **Go's syntax** is expected, this is extremily **summarized** in the ongoing section.

Semi-extensive HTML proficiency is a must too.


### Shortcode templates vs call

Before we go any deeper, let's make sure we're on the same page. In this post:
- A ***shortcode call*** refers to Markdown snippets that use a shortcode, e.g., `{{</* qr text="https://gohugo.io" */>}}`.
- A ***shortcode declaration*** is the HTML (or template) code that defines these Markdown snippets,
such as the [qr.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/qr.html) script.
In the Hugo documentation this is referred to as a **shortcode template** or sometimes simply a **shortcode** or **template**.


### Go basics


**Actions** -data evaluations or control structures- are delimited by `{{` and `}}`.

`{{-` and `-}}` **trim whitespace** to the left and right respectively.
MWE:
```go
{{- "  foo  " }}  // "foo  "
{{ "  foo  " -}}  // "  foo"
{{- "  foo  " -}} // "foo"
```

`{{/*` and `*/}}` wrap a **comment**. Read [docs](https://gohugo.io/templates/introduction/#comments) and [this](https://manski.net/articles/hugo/comments) brief article.

`{{ . }}` and `with`. Within a template, the dot (`.`) represents the current [context](https://gohugo.io/quick-reference/glossary/#context).
We rebind the context to another value or object within [`range`](https://gohugo.io/functions/go-template/range/) or [`with`](https://gohugo.io/functions/go-template/with/) blocks.
Read [Current context](https://gohugo.io/templates/introduction/#current-context).
Becoming **familiar with** the **dot** is **essential** for understanding shortcode templates.

Further reading:
- [Go's Table of Contents](https://golang.org/ref/spec)
- Specially the [text/template](https://pkg.go.dev/text/template) documentation.


### if-else-end

The [`with`](https://gohugo.io/functions/go-template/with/) statement is an important feature to master.
We have already explained its usage with the *dot* context.
Don't worry if for now it sounds all very abstract, when we focus on each shortcode template we'll see how it's used.

The [`if`](https://gohugo.io/functions/go-template/if/) statement is equally essential.
It is widely used for validations and other conditional logic.

Recommended reviewing the documentation linked above before proceeding.

Other actions (like `define` or `errorf`) may appear in certain templates.
However, their behavior can usually be inferred from the surrounding code.


### .Get

[`SHORTCODE.Get ARG`](https://gohugo.io/methods/shortcode/get/)

#### Positional arguments

1. Create a shortcode template [script] via
  - `printf` and `Get`: `echo '{{ printf "%s %s." (.Get 0) (.Get 1) }}' > layouts/shortcodes/myshortcode.html`
  - Just `Get`: `echo '{{ .Get 0 }} {{ .Get 1 }}.' > layouts/shortcodes/myshortcode.html`
  - Use the [Params](https://gohugo.io/methods/shortcode/params/) method to access the arguments as a collection.
Read [Argument collection](https://gohugo.io/templates/shortcode/#argument-collection).
`echo '{{ .Params 0 }} {{ .Params 1 }}.' > layouts/shortcodes/myshortcode.html`
2. Insert the respective shortcode call (usage) in a markdown file
`echo '---\ntitle: "Test Shortcode"\n---\n\n{{</* myshortcode "Hello" "world" */>}}' > content/en/myshortcode.md`
3. Build `hugo server --disableFastRender`
4. Check in the browser ([http://localhost:1313/myshortcode/](http://localhost:1313/myshortcode/)) that it's rendered to `Hello world.`
(actually to `<section class="post-content">Hello world.</section>` since Hugo renders plain line in sections elements).

This time create a `<p>` HTML element with bold text: 
- `echo '<p style="font-weight: bold">{{ .Get 0 }} {{ .Get 1 }}.</p>' > layouts/shortcodes/myshortcode.html`
- or `echo '{{ printf "<p style=\"font-weight: bold\">%s %s.</p>" (.Get 0) (.Get 1) | safeHTML }}' > layouts/shortcodes/myshortcode.html`

Which renders to
```html
<section class="post-content">
  <p style="font-weight: bold">Hello world.</p>
</section>
```

#### Named arguments

1. Choose one among
  - `echo '{{ printf "%s %s." (.Get "greeting") (.Get "firstName") }}' > layouts/shortcodes/myshortcode.html`
  - `echo '{{ .Get "greeting" }} {{ .Get "firstName" }}.' > layouts/shortcodes/myshortcode.html`
  - `echo '{{ .Params.greeting }} {{ .Params.firstName }}.' > layouts/shortcodes/myshortcode.html`
2. `echo '---\ntitle: "Test Shortcode"\n---\n\n{{</* myshortcode greeting="Hello" firstName="world" */>}}' > content/en/myshortcode.md`
3. `hugo server --disableFastRender`
4. [http://localhost:1313/myshortcode/](http://localhost:1313/myshortcode/)


#### Both named and positional args

Accept **both** named and positional arguments, but not at the same time.
Read [IsNamedParams](https://gohugo.io/templates/shortcode/#named-and-positional-arguments).

[Vimeo shortcode](#vimeo-declaration) is a good example of this.
There the `id` in the shortcode call can be either the first (and only) positional parameter or a named parameter (as rest of the arguments, though these others are optional).

TL;DR. All next are equivalent shortcode calls (with optional parameters assigned to default values [of future respective arguments]):
```texts
{{</* vimeo    55073825 */>}}
{{</* vimeo id=55073825 */>}}
{{</* vimeo    55073825 loading=eager */>}}
{{</* vimeo id=55073825 loading=eager */>}}
{{</* vimeo    55073825 loading=eager allowFullScreen=true */>}}
{{</* vimeo id=55073825 loading=eager allowFullScreen=true */>}}
```

Note. Whitespaces added for readability. They will be trimmed anyway.

> but not at the same time

Therefore, next calls are invalid:

```texts
{{</* vimeo    55073825 id=55073825 */>}} // id was already assigned by the first positional arg
{{</* vimeo id=55073825    55073825 */>}} // id was already assigned by the first named arg
{{</* vimeo    55073825 id=55073825 loading=eager */>}} // as 1st call
{{</* vimeo id=55073825    55073825 loading=eager */>}} // as 2nd call
{{</* vimeo    55073825    eager */>}} // Max one positional arg (the id if any) in this template
```

## Details

Create a HTML [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)

> A disclosure widget in which information is visible only when the widget is toggled into an open state.

### MWE  {#details-mwe}

```texts
{{</* details summary="See the details" */>}}
This is a **bold** word.
{{</* /details */>}}
```


Hugo **render**s previous **shortcode** call to next **HTML** chunk:

```html
<details>
  <summary>See the details</summary>
  <p>This is a <strong>bold</strong> word.</p>
</details>
```


Which looks like this in your browser (click to toggle un-/fold):

{{< details summary="See the details" >}}
This is a **bold** word.
{{< /details >}}

Next is pre-expanded (`open` attribute with boolean `true` is passed):

```texts
{{</* details summary="See the details" open=true */>}}
This is a **bold** word.
{{</* /details */>}}
```

{{< details summary="See the details" open=true >}}
This is a **bold** word.
{{< /details >}}


### Practical usage  {#details-practical}

Fold your headers index (table of contents):

```texts
{{</* details summary="**Index** - Click to expand 📜" */>}}
  * [header-1](#header-1)
    * [header-1-1](#header-1-1)
      * [header-1-1-1](#header-1-1-1)
      * [header-1-1-2](#header-1-1-2)
  * [header-2](#header-2)
  ...
{{</* /details */>}}
```

This is applied in current post, jump to [index](#index).


Tip. With Vim's plugin [vim-markdown](https://github.com/preservim/vim-markdown)
one can directly run `:InsertToc` to get the markdown's table of contents.
Or `:InsertNToc` for the `N`umbered version.
This plugin and many others are showcasted in my [vim-plugins-screenshots](https://github.com/juanMarinero/vim-plugins-screenshots?tab=readme-ov-file#vim-markdown) repo.


### Declaration {#details-declaration}

In Hugo's repo, script [`details.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/details.html) contains:

```go
{{- /*
Renders an HTML details element.

@param {string} [class] The value of the element's class attribute.
@param {string} [name] The value of the element's name attribute.
@param {string} [summary] The content of the child summary element.
@param {string} [title] The value of the element's title attribute.
@param {bool} [open=false] Whether to initially display the content of the details element.

@reference...

@examples...

*/}}

{{- /* Get arguments. */}}
{{- $class := or (.Get "class") "" }}
{{- $name := or (.Get "name") "" }}
{{- $summary := or (.Get "summary") "Details" }}
{{- $title := or (.Get "title") "" }}
{{- $open := false }}
{{- if in (slice "false" false 0) (.Get "open") }}
  {{- $open = false }}
{{- else if in (slice "true" true 1) (.Get "open") }}
  {{- $open = true }}
{{- end }}

{{- /* Render. */}}
<details
  {{- with $class }} class="{{ . }}" {{- end }}
  {{- with $name }} name="{{ . }}" {{- end }}
  {{- with $open }} open {{- end }}
  {{- with $title }} title="{{ . }}" {{- end -}}
>
  <summary>{{ $summary | .Page.RenderString }}</summary>
  {{ .Inner | .Page.RenderString (dict "display" "block") -}}
</details>
```


This template generates a [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
HTML element with dynamic attributes and content.

#### Parameters declaration

These `param`s are usually called arguments in functions of other prog-languages, or attributes in HTML.
But `arguments` is later used to refer those objects accesed via `$VAR`, like `$class`,
which value of course will depend (here match) the param `class` value or be empty string if this param is not present in the shortcode call (`{{- $class := or (.Get "class") "" }}`);
but we will cover this in the [Get values](#get-values) section.

Btw. this is the reason why in the `param`-s declaration, that we cover now, there is **no default value** to assign.
For example `false` is not the default value for the param `open`, this param just values what it's passed in the shortcode call (here by positional arguments) or nil if not passed.
Positional vs named parameters is coverd in the [.Get](#get) section.

In this shortcode we have [comments](https://manski.net/articles/hugo/comments) for each `@param` (`class`, `name`, `summary`, `title` and `open`) with the following info:
- A **name**: `class`, `name`, `summary`, `title` or `open`
- A **type**: `string` or `bool`
- A **description**, e.g. `Whether to initially display the content of the details element`
- **Optional/required** status. **All** these **parameter**s are **optional**,
because their names are wrapped **in square brackets** (`[]`).
For example, the param `class` is described as (making the `[]` bold) as `@param {string}`**`[`**`class`**`]`**` The value of...` instead of `@param {string} class The value of...`
Later, in the [QR-declaration](#qr-declaration), we will explore another shortcode template which needs an **obligatory** parameter.

Let this sink in: these parameter's descriptions are in comments (inbetween `{{- /*` and `*/}}` comment delimiters),
which could be removed,
while the real **logic** of the template, that will make a parameter **optional or obligatory**, appears in **code lines** that actually **run**
(the `Get arguments.` and `Render.` blocks for the ongoing template).



#### Get values

`Get arguments.` chunk extracts the non empty **parameter**s values and assigns them to the respective **argument**.
If the parameter was not in the shortcode call (or was an empty string), the argument is set a **default** value (`""` for every arg except `$summary` and `$open`). 
Lets understand how it works:

- The variable `$class` is assigned to **either** (`:= or`):
  - The classes passed in the shortcode call (e.g. `{{</* details class="m-0 w-75" */>}}`) thanks to `(.Get "class")`,
  - **or** an empty string (`""`) if no class was passed in the shortcode call (or passed an empty string like `{{</* details class="" */>}}`).
- Analogous for `$name` and `$title`.
- `$summary` setting is alike previous ones, but if no `summary` param is passed in the shortcode call, then its arguments is set to `"Details"`.
- The variable `$open` is pre-set to `false` and then assigned to **either**:
  - `false` if `(.Get "open")` is in the list of values `("false", false, 0)`. I.e. next three shortcode calls are equivalent:
    - `{{</* details open="false" */>}}`
    - `{{</* details open=false */>}}`
    - `{{</* details open=0 */>}}`
  - **or** to `true` if `(.Get "open")` is one of next values: `"true"`, `true` or `1`.

Finally we need to know how it's handled the content of the children of the `<details>` (siblings of the `<summary>` element).
I.e. the actual content folded of the `<details>` element.
It's used **`.Inner`**, [docs](https://gohugo.io/methods/shortcode/inner/):
> Returns the content between opening and closing shortcode tags, applicable when the shortcode call includes a closing tag.

Thus, in the details shortcode call, we have:
- An opening shortcode tag, .e.g `{{</* details summary="See the details" */>}}`
- The closing shortcode tag `{{</* /details */>}}`
- And the content in between, .e.g. `This is a **bold** word.`

The **`.Inner`** appears in the penultimate line of [details.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/details.html):

{{< highlight HTML "linenos=inline, hl_lines=2, linenostart=73">}}
  <summary>{{ $summary | .Page.RenderString }}</summary>
  {{ .Inner | .Page.RenderString (dict "display" "block") -}}
</details>
{{< /highlight >}}

Where the `| .Page.RenderString (dict "display" "block")` ensures `block`-level rendering (for paragraphs, lists, etc.).
The `.Page.RenderString` [method](https://gohugo.io/methods/page/renderstring) provides next excellent example:

```go
{{ $s := "An *emphasized* word" }}
{{ $opts := dict "display" "block" }}
{{ $s | .RenderString $opts }} → <p>An <em>emphasized</em> word</p>
```

The documentation also explains the `block` **`display`** effect. Without it we will no longer get a `<p>`aragraph:

```go
{{ $s := "An *emphasized* word" }}
{{ $s | .RenderString }} → An <em>emphasized</em> word

{{/* Alternative with explicit display. */ }}
{{ $opts := dict "display" "inline" }}
{{ $s | .RenderString $opts }} → An <em>emphasized</em> word
```




#### Render


Let's overview the template:
- Intially there are some comments describing the `@param`eters (see the [Parameters declaration](#parameters-declaration)),
the docs `@reference` and `@example`-s of shortcode calls.
- `Get arguments.` chunk uses the non empty **parameter**s to populate the respective [positional] **argument**s.
If the parameter was not in the shortcode call (or was an empty string), the argument is set a **default** value. 
Details in previous [Get values](#get-values) pararagraph.
- Finally the `Render.` code lines **construct** the **HTML element**
[`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) thanks to the **arguments**.
We focus on this.

Basic HTML knowledge:
- Attributes like `open` are considered *true* simply by being present. They are called **boolean attributes** in HTML.
- Attributes like `class` require an explicit value (e.g., `class="c1 c2"`). These are known as **normal** attributes or **valued attributes**.

Let's start with the boolean attribute `open`. 
An HTML `<details>` might:
- Contain it like `<details open><summary>Expand</summary><p>...</p></details>`
- Or not `<details><summary>Expand</summary><p>...</p></details>`

Also, we expect
- When `$open=true` this renders to `<details open>`
- When `$open=false` this renders to `<details>`

Above is rendered via `{{- with $open }} open {{- end }}`.
Where,
- The syntax `{{- with $VAR }} CONTENT {{- end }}` just prints `CONTENT` (here the string `open`) if `$VAR` (`$open` here) is `true`.
Remember that the `if-else-end` in `Get arguments` replaces
falsy values (string `"false"` and number `0`) with boolean `false` and viceversa (`"true"` and `1` to `true`).
- Check Hugo's [`with-else-end`](https://gohugo.io/functions/go-template/with/).

To not confuse the string to add (`open`)
with the boolean argument that enables this (`$open`)
we could define a new variable `$openAttribute`:
```go
{{- $openAttribute := "open" }}
...
{{- with $open }} $openAttribute {{- end }}
```
Do **not** apply this alternative! It's just for learning purposes.
The original code, with the literal string `open`, is clearer in this simple case.


Let's now study how it's rendered the normal  attribute `class`.
An HTML `<details>` can:
- Contain a list of `class`-es like `<details class="c1 c2"><summary>Expand</summary><p>...</p></details>`
- Or it can skip the `class` attribute like `<details><summary>Expand</summary><p>...</p></details>`

Previously we did `.Get` the `$class`: the given string value (positional parameter `class` passed), except if what was passed was falsy
(empty string or shortcode call without this param at all),
then `$class` would fall back to an empty string (`""`).
Now we will render it via `{{- with $class }} class="{{ . }}" {{- end }}`
- The **syntax** is `{{- with $VAR }} ATTRIBUTE="{{ . }}" {{- end }}`.
Which means next. If the variable `$VAR` (`$class` here) is true-ish (i.e. not empty since its a `string` var) then it adds the string `ATTRIBUTE=""` (here `class=""`),
and inbetween the double quotes puts the value of the variable `$VAR` (string `$class` here) via `{{ . }}`.
Otherwise, if `$VAR` is falsy, no content is added at all, not even `class=""`. 
- `{{-` and `-}}` trim whitespaces

To not confuse the string to add inside the double quotes (string variable `$class`)
with the string that indicates the HTML attribute (`class` followed by `=`)
we could define a new variable `$classAttribute`:
```go
{{- $classAttribute := "class" }}
...
{{- with $class }} $classAttribute="{{ . }}" {{- end }}
```



### Docs  {#details-docs}


Visit https://gohugo.io/shortcodes/details/
- To learn how to override Hugo's embedded `details` shortcode.
Or just read the [Override a default shortcode](#override-a-default-shortcode) section in the ongoing post.
- Find out more about the [parameters](https://gohugo.io/shortcodes/details/#arguments)
(though here `@`-`params` and `$`-arguments are somehow mixed an just called `Arguments`).
E.g. it explains that `open (bool)` serves to initially display (unscroll) the content and that its default value is `false`.
- CSS styling



## Figure

Create a HTML [`<figure>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure)

> Represents self-contained content, potentially with an optional caption.

### MWE {#fig-MWE}

```html
{{</* figure
  src="https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg"
  alt="Unrecognizable woman walking dogs on leashes in countryside"
  link="https://www.pexels.com/photo/unrecognizable-woman-walking-dogs-on-leashes-in-countryside-7210754/"
  caption="Unrecognizable *woman* walking **dogs** on leashes in ***countryside***. Class `bg-black`. Check [this **link**\!](/blogs/instagram_mosaic/)"
  class="m-0 w-75 bg-black p-4"
  loading="lazy"
*/>}}
```


Hugo renders previous shortcode call to next HTML:

```html
<figure class="m-0 w-75 bg-black p-4">
  <a href="https://www.pexels.com/...">
    <img 
      src="https://images.pexels.com/..." 
      alt="Unrecognizable woman walking..."
      loading="lazy"
    >
  </a>
  <figcaption>
    <p>Unrecognizable <em>woman</em> walking <strong>dogs</strong> on leashes in <strong><em>countryside</em></strong>. Class <code>bg-black</code>. Check <a href="/blogs/instagram_mosaic/">this <strong>link</strong>!</a></p>
  </figcaption>
</figure>
```


Which looks like this:

{{< figure
  src="https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg"
  alt="Unrecognizable woman walking dogs on leashes in countryside"
  link="https://www.pexels.com/photo/unrecognizable-woman-walking-dogs-on-leashes-in-countryside-7210754/"
  caption="Unrecognizable *woman* walking **dogs** on leashes in ***countryside***. Class `bg-black`. Check [this **link**\!](/blogs/instagram_mosaic/)"
  class="m-0 w-75 bg-black p-4"
  loading="lazy"
>}}

The caption applied many [Markdown elements](https://www.markdownguide.org/basic-syntax/) to highlight that one can use them there.

Note. `class="m-0 w-75 bg-black p-4"` requires [Tachyons](https://tachyons.io/).
Enable it adding next to `layouts/partials/custom_head.html`

```html
<!-- Tachyons for CSS -->
<!-- https://tachyons.io/ -->
<link rel="stylesheet" href="https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css"/>
```

Btw. This photo is used in my post 
[How to create an **Instagram mosaic** on the terminal](/blogs/instagram_mosaic/).
Which may interest you if you are active on Instagram.

Off-topic. `loading` attribute is [supported](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading#loading_attribute) in HTML5.

> To instruct the browser to defer loading of images/iframes that are off-screen until the user scrolls near them

Check it out:
1. Refresh current website removing the cache - try a private tab
2. Run next JS code in the browser's console.
It will print `https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg Not loaded yet`
```js
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  console.log(img.src, img.complete ? 'Loaded' : 'Not loaded yet');
});
```
3. Then scroll till that `<figure>` (previous dogs picture).
4. And run it again. Now it echoes `https://images.pexels... Loaded`



### Docs {#fig-docs}

Visit https://gohugo.io/shortcodes/figure/ to learn more about this shortcode.
- Arguments - `src`, `alt`, `link`, `caption`, etc.
- Image location

### Declaration {#fig-declaration}

In Hugo's repo read [`figure.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/figure.html).

Most of next shortcode template is easy to understand if you read 
the comprensive explanation of the `display` shortcode in previous [section](#display-declaration).

Just few chunks are a little tricky, like

```go
{{- if .Get "link" -}}
  <a href="{{ .Get "link" }}"{{ with .Get "target" }} target="{{ . }}"{{ end }}{{ with .Get "rel" }} rel="{{ . }}"{{ end }}>
{{- end -}}
```

Read the [if-else-end](#if-else-end) section.
Then indent these three lines for clarity:

```go
{{- if .Get "link" -}}
  <a href="{{ .Get "link" }}"
    {{- with .Get "target" }} target="{{ . }}"{{ end }}
    {{- with .Get "rel" }} rel="{{ . }}"{{ end }}
  >
{{- end -}}
```

This code chunk is reading the positional parameters `link`, `target` and `rel` passed via a shortcode call like next

```texts
{{</* figure link="https://www.nps.gov/zion/index.htm" target="_blank" rel="noopener noreferrer" */>}}
```

And directly rendering the `<a>` children of the `<figure>` (see next code block),
without populating intermediate argumentes `$link`, `$target` and `$rel`.
On the other hand, for more complex HTML attributes this intermediate step is needed [or deeply recommended], e.g. in the [details](#details-declaration) template.

```html
<a href="https://www.nps.gov/zion/index.htm"
   target="_blank"
   rel="noopener noreferrer">
```

Notice that a [non empty] positional parameter `link` is mandatory to construct the `<a>`, while `target` and `rel` are optional.
I.e. if the condition `{{- if .Get "link" -}}` isn't true then no code till `{{- end -}}` is executed.

We end this shortcode with a little challenge.
Can you rewrite the previous three lines (six if indented) using `with` instead of `if`?


{{< details summary="**Solution** - Click to expand" >}}
```go
{{- with .Get "link" -}}
  <a href="{{ . }}"
    {{- with $.Get "target" }} target="{{ . }}"{{ end }}
    {{- with $.Get "rel" }} rel="{{ . }}"{{ end }}
  >
{{- end -}}
```
{{< /details >}}

And can we actually apply this replacement in the [`figure.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/figure.html) template?

{{< details summary="**Solution** - Click to expand" >}}
**Yes**, the replacement is valid.
There is **no dot conflict**.
We verified that no surrounding `with` was employing its dot (`.`) within the `if` block being replaced.

Actually there is no parent `with` at all. The one in the first line is an inline `with` (it starts and ends in the same line),
thus it cannot interfere with our context.

```go
<figure{{ with .Get "class" }} class="{{ . }}"{{ end }}>
```
{{< /details >}}


## Gist shortcode

Deprecated in v0.143.0. Check the [docs](https://gohugo.io/shortcodes/gist/) for workarounds.


## Highlight

Visit https://gohugo.io/shortcodes/highlight/ for reference.


Insert syntax-highlighted code.

### MWE  {#highlight-mwe}

```texts
{{</* highlight go "linenos=inline, hl_lines=3 6-8, style=monokai" */>}}
package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        fmt.Println("Value of i:", i)
    }
}
{{</* /highlight */>}}
```


Hugo renders this to:

{{< highlight go "linenos=inline, hl_lines=3 6-8, style=monokai" >}}
package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        fmt.Println("Value of i:", i)
    }
}
{{< /highlight >}}


### Syntax highlighting

Few more to point out. The [docs](https://gohugo.io/shortcodes/highlight/) are self-explanatory.
And the MWE above is easy to follow.

You might just need the link for the [Syntax highlighting styles](https://gohugo.io/quick-reference/syntax-highlighting-styles/).
The default can be set in `config.toml`.

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
⚠️ <a href="https://www.markdownguide.org/extended-syntax/#fenced-code-blocks">Fenced code blocks</a>,
markdown lines surrounded by triple backticks (<code>&#96;&#96;&#96;</code>), depend on that config too.
Observe next code chunk for Hugo:
</div>
{{< /rawhtml >}}


<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
<!-- Replace <,>,{ and } to avoid auto-render -->
{{< rawhtml >}}
<div class="html-content">
  <pre><code>&#96;&#96;&#96;python
  import numpy as np

  np.random.seed(42)
&#96;&#96;&#96;</code></pre>
</div>
{{< /rawhtml >}}

Hugo renders this to:

```python
import numpy as np

np.random.seed(42)
```

Since my [`config.toml`](https://github.com/juanMarinero/juanmarinero.github.io/blob/main/hugo.toml) has

```toml
[markup]
  [markup.highlight]
    style = 'solarized-dark'
```



Check it:
```js
fetch('https://raw.githubusercontent.com/juanMarinero/juanmarinero.github.io/refs/heads/main/hugo.toml')
  .then(r => r.text())
  .then(t => console.log(t.split('\n').filter(l => l.includes('style'))));
```

Finally some practical **examples**.
View the highlighted code lines in the post [The Math Is Haunted](https://overreacted.io/the-math-is-haunted/#the-math-is-haunted) by [Overreacted](https://overreacted.io/).
These help guide the reader's attention to specific parts of code chunks.

### Declaration {#highlight-declaration}

First understand the comprensive explanation of the `display` shortcode in previous [section](#display-declaration).
Specially the [if-else-end](#if-else-end) section.

Hugo's repo [`hightlight.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/highlight.html) content is, once indented:

```go
{{ if len .Params | eq 2 }}
  {{ highlight (trim .InnerDeindent "\n\r") (.Get 0) (.Get 1) }}
{{ else }}
  {{ highlight (trim .InnerDeindent "\n\r") (.Get 0) "" }}
{{ end }}
```

For `.Params` take a quick look at:
- The [param method](https://gohugo.io/methods/shortcode/params/)
- The basics shortcode templates created in [Positional arguments](#positional-arguments) and [Named arguments](#named-arguments) sections
that apply the syntax `{{ Params POSITION }}` or `{{ Params.NAME }}`

[`SHORTCODE.Inner`](https://gohugo.io/methods/shortcode/inner/)
and its indented version
[`SHORTCODE.InnerDeindent`](https://gohugo.io/methods/shortcode/innerdeindent/)
return the content between opening and closing shortcode tags.
E.g. the content in between `{{</* highlight go "linenos=inline, hl_lines=3 6-8, style=monokai" */>}}` and `{{</* /highlight */>}}`, i.e. the Go code.

Previous shortcode call had two ~~arguments~~ parameters:
- `go`
- and `"linenos=inline, hl_lines=3 6-8, style=monokai"`

In summary,
- `trim .InnerDeindent "\n\r"` cleans the code content
- `(.Get 0)` gets the language (e.g. `go`)
- `(.Get 1)` prints the options string (e.g. `"linenos=inline, hl_lines=3"`)

Therefore, in previous shortcode call the `{{ if len .Params | eq 2 }}` will trigger true, and the `highlight` function is called with cleaned code, language and options.

Wrapping up:
- Template Function [`hightlight.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/highlight.html) makes all previous described.
I.e., this shortcode template pass code lines, code language and some attributes (or it can pass none of any/all) from the shortcode call to the `highlight` function,
which is bolded next:
`{{`**`highlight`**`(trim .InnerDeindent "\n\r") (.Get 0) (.Get 1) }}`

- This `highlight` of the shortcode template resolves to `func (ns *Namespace) Highlight(s any, lang string, opts ...any) (template.HTML, error)`
in [`transform.go`](https://github.com/gohugoio/hugo/blob/2216028620fd68d5d8fc18511096eeb5216ed2ba/tpl/transform/transform.go#L94)
- Which then calls the Go Function [highlight.go](https://github.com/gohugoio/hugo/blob/2216028620fd68d5d8fc18511096eeb5216ed2ba/markup/highlight/highlight.go#L72).
- And the previous uses Chroma to generate HTML5-compliant syntax highlighting

{{< rawhtml >}}
<div class="html-content tikzjax">
  <script type="text/tikz">
  \begin{tikzpicture}[
    node distance=1in,
    box/.style={rectangle, draw, rounded corners, align=center, fill=blue!10},
    >={Latex[length=.2in]}
    ]

    \node[box] (A) {Shortcode};
    \node[box, below=of A] (B) {transform.Highlight};
    \node[box, below=of B] (C) {markup/highlight.Highlight};
    \node[box, below=of C] (D) {Chroma};

    \draw[->] (A) -- (B);
    \draw[->] (B) -- (C);
    \draw[->] (C) -- (D);

  \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<div class="html-content">
  <div style="height: 0.5em;"></div> <!-- Half line break -->
  Btw. If you fancy this $\text{Ti}\textit{k}\text{Z}$ flowchart then check my post 
  <a href="/blogs/latex_for_webdev/">
  $\LaTeX$ and $\text{Ti}\textit{k}\text{Z}$ for <strong>web dev</strong>
  </a>
  <div style="height: 0.5em;"></div> <!-- Half line break -->
</div>
{{< /rawhtml >}}


## Instagram

Visit https://gohugo.io/shortcodes/instagram/ for reference.

### MWE  {#instagram-mwe}

A video from [Instagram](https://www.instagram.com/p/CxOWiQNP2MO/)

```texts
{{</* instagram CxOWiQNP2MO */>}}
```

Renders to next. Press to play.

{{< instagram CxOWiQNP2MO >}}

Post of photos from [Instagram](https://www.instagram.com/p/CxOWiQNP2MO/) are supported too:

```texts
{{</* instagram CxOWiQNP2MO */>}}
```


{{< instagram DNEOm1vSmyX >}}


### Declaration {#instagram-declaration}

First understand the comprensive explanation of the `display` shortcode in previous [section](#display-declaration).
Specially the [if-else-end](#if-else-end).

Hugo's repo [`instagram.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/instagram.html) content is:

```go
{{- $pc := site.Config.Privacy.Instagram -}}
{{- if not $pc.Disable -}}
  {{- with .Get 0 -}}
    {{- template "render-instagram" (dict "id" . "pc" $pc) -}}
  {{- else -}}
    {{- errorf "The %q shortcode requires a single positional parameter, the ID of the Instagram post. See %s" .Name .Position -}}
  {{- end -}}
{{- end -}}

{{- define "render-instagram" -}}
  <blockquote
    ...
    data-instgrm-permalink="https://www.instagram.com/p/{{ .id }}"
    ...
  >
  ...
  </blockquote>
  {{- if not .pc.Simple -}}
    <script async src="https://www.instagram.com/embed.js"></script>
  {{- end -}}
{{- end -}}
```

Read the [Privacy subsection](https://gohugo.io/shortcodes/instagram/#privacy) of this shortcode.
`config.toml` must use default values for `Privacy.Instagram` or explicitly set it to `false`.
This settings are read via [`site.Config.Privacy`](https://gohugo.io/methods/site/config/#privacy) into `$pc`.
This way `{{- if not $pc.Disable -}}` is `true`.

Watch if `hugo config` echoes something alike:

```
> hugo config | grep -C 5 "instagram"
[privacy]
  [privacy.instagram]
--
[services]
  [services.instagram]
```

Furthermore at least one param is required in the shortcode call, the ID of the Instagram post: `{{- with .Get 0 -}}`.
See Hugo's [`with-else-end`](https://gohugo.io/functions/go-template/with/).

If both requirements (`Privacy.Instagram` and ID) are satisfied then the shortcode template runs `{{- template "render-instagram" (dict "id" . "pc" $pc) -}}`,
where that function is after the `if-else-end` defined: `{{- define "render-instagram" -}}...{{- end -}}`.

The `template` function executes a defined template called `render-instagram`.
Docs about [go-template](https://gohugo.io/functions/go-template/template/).
MWE:

```go
{{ template "foo" (dict "answer" 42) }}

{{ define "foo" }}
  {{ printf "The answer is %v." .answer }}
{{ end }}
```

The arguments passed to that defined template are mapped to `(dict "id" . "pc" $pc)`:
- The key `"id"` maps to the first positional parameter since the *dot* is binded to the enclosing `{{- with .Get 0 -}}`.
- While the key `"pc"` maps to the variable `$pc` defined as `site.Config.Privacy.Instagram` as we saw in the first line.

The proper HTML-render with that two arguments is out of this scope.
But I summary what concerns to our arguments:
- The ID is accesed via `{{ .id }}` and it's to be found:
  - Inside the `<blockquote>` attributes: `data-instgrm-permalink="https://www.instagram.com/p/{{ .id }}"`
  - And in `('blockquote div a').href`
- Finally the `render-instagram` template checks if the Instagram policy is `false` in configs via (`{{- if not .pc.Simple -}}`),
if so then Hugo creates a static card without JavaScript for images only (no videos).
Details in [Privacy](https://gohugo.io/shortcodes/instagram/#privacy).


## Param

Visit https://gohugo.io/shortcodes/param/ for reference.

### MWE  {#param-mwe}

At top of current markown there's a `title` param.
It can be read with:

```texts
Current post title is **{{%/* param "title" */%}}**.
```

Which renders to:

Current post title is **{{% param "title" %}}**.

In `config.toml` there's a `favicon` param:

```texts
Global favicon value is `{{%/* param "favicon" */%}}`.
```

Outputs:

Global favicon value is `{{% param "favicon" %}}`.
It could also be accesed creating a shortcode template with `{{ .Site.Params.favicon }}`, read https://gohugo.io/methods/site/params/.

Not all `params` are accessible via `{{ .Site.Params.<param-name> }}`. Same applies for other `SITE` config settings. Full list can be found at https://gohugo.io/methods/site/.

Let's exemplify how to access the global `title` ([`.Site.Title`](https://gohugo.io/methods/site/title/)), defined in `config.toml`, we must instead create our own shortcode template:

1. Create a HTML shortcode with 
`echo 'Global title: <strong>{{ .Site.Title }}</strong>.' > layouts/shortcodes/myshortcode.html`
2. Insert it in a markdown `echo '---\ntitle: "Test Shortcode"\n---\n\n{{</* myshortcode */>}}' > content/en/myshortcode.md`
3. Build `hugo server --disableFastRender`
4. Check in the browser ([http://localhost:1313/myshortcode/](http://localhost:1313/myshortcode/)) that it's rendered to:
Global title: **J. Marinero...**

`hugo config` also has multiple `contacts`:

```toml
[params]
  copyright = '...'
  description = 'Juan Marinero...'
  favicon = 'images/favicon.png'

  [[params.contacts]]
    icon = 'fa fa-phone'
    label = 'phone'
    url = 'tel:...'
    value = '...'
```

Replace previous shortcode `$EDITOR layouts/shortcodes/myshortcode.html` with

```texts
{{ with (index site.Params.contacts 2) }}
By 3rd index:<br>
- Label: {{ .label }}<br>
- Value: {{ .value }}
{{ end }}

{{ with (index (where site.Params.contacts "label" "GitHub") 0) }}
  <br><br>
If <code>label</code> values <code>GitHub</code>:<br>
- URL: {{ .url }}"<br>
- Value: {{ .value }}
{{ end }}
```

To get:

{{< rawhtml >}}
<div class="html-content">
  By 3rd index:<br>
  - Label: GitHub<br>
  - Value: github.com/juanMarinero

  <br><br>
  If <code>label</code> values <code>GitHub</code>:<br>
  - URL: https://github.com/juanMarinero"<br>
  - Value: github.com/juanMarinero
  <div style="height: 0.5em;"></div> <!-- Half line break -->
</div>
{{< /rawhtml >}}


### Declaration {#param-declaration}

First understand the comprensive explanation of the `display` shortcode in previous [section](#display-declaration).
Specially the [if-else-end](#if-else-end) section.

Hugo's repo [`param.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/param.html) content is, once indented:

```go
{{- $name := (.Get 0) -}}
{{- with $name -}}
  {{- with ($.Page.Param .) }}
    {{ . }}
  {{ else }}
    {{ errorf "Param %q not found: %s" $name $.Position }}
  {{ end -}}
{{- else }}
  {{ errorf "Missing param key: %s" $.Position }}
{{ end -}}
```

`.Page` methods docs [here](https://gohugo.io/methods/page/). `.Page.Param` specific in this [link](https://gohugo.io/methods/page/param/).

Let's suppose that we have `{{%/* param "favicon" */%}}` as shortcode call.
Then `$name` values `"favicon"` (the first positional parameter of the shortcode call).

`{{- with $name -}}` is true-ish since `$name` exists (the shortcode call passed a parameter) and is not an empty string (this parameter passed wasn't `""`).

`{{- with ($.Page.Param .) }}` would be `{{- with ($.Page.Param $name) }}` because the dot is binded by the enclosing `{{- with $name -}}`.
The **parentheses** serve as a ***grouping*** *operator* for [Go](https://go.dev/ref/spec#Notation).
In vanille Go we would just write `page.Param("favicon")`.
But in this shortcode template we need the grouping `($.Page.Param "favicon")` to force evaluation of the entire method call first.

Without parentheses (`{{- with $.Page.Param . -}}`) the result would be [again!] just the previous dot (of upper `with`),
the string `"favicon"`, as long as `$.Page.Param` is `true`-ish, instead of the desired value of `page.Param("favicon")`.
The Go's **precedence rules** are just this way, the parentheses force the evaluation of its content first.
I.e. the equivalent Go code without proper grouping could be as:

```go
methodValue := $.Page.Param  // Gets the method as a value
if methodValue != nil {
  dot = .  // Sets dot to the PREVIOUS context (e.g., "favicon")
}
```

The need and purpose of the parentheses is demonstrated.
In summary, this second `with` achieves:
- Checks that `page.Param("favicon")` is `true`-ish.
- Assigns that value to dot

This way, and finally, the forth line is just a dot `{{ . }}`, inside that second `with` it's the parentheses value (e.g. `page.Param("title")`) as just explained.

{{< highlight HTML "linenos=inline, hl_lines=4">}}
{{- $name := (.Get 0) -}}
{{- with $name -}}
  {{- with ($.Page.Param .) }}
    {{ . }}
  {{ else }}
  ...
{{< /highlight >}}

## QR

Visit https://gohugo.io/shortcodes/qr/ for reference.

### MWE  {#qr-mwe}

```texts
{{</* qr text="https://gohugo.io" */>}}
```

Renders to

{{< qr text="https://gohugo.io" />}}

Now check if the QR does actually points to `https://gohugo.io`.
1. Copy the image URL above, or just `https://gohugo.io/images/qr/qr_a1aee921a2e8180d.png`
2. Go to an online QR code reader via `Paste URL` of image. Like [https://www.minifier.org/qr-code-scanner](https://www.minifier.org/qr-code-scanner)
3. Test it

We are not limited to URLs. The [docs](https://gohugo.io/shortcodes/qr/) explain how to use this shortcode to generate QRs of:
- Phone numbers
- Contact information in the [vCard](https://en.wikipedia.org/wiki/VCard) format

### Declaration {#qr-declaration}

First understand the comprensive explanation of the `display` shortcode in previous [section](#display-declaration).
Specially the [if-else-end](#if-else-end) section.

Hugo's repo [`qr.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/qr.html) content is basically:

```go
{{- /* Constants. */}}
{{- $validLevels := slice "low" "medium" "quartile" "high" }}
{{- $minimumScale := 2 }}

{{- /* Get arguments. */}}
{{- $text := or (.Get "text") (strings.TrimSpace .Inner) "" }}
{{- $level := or (.Get "level") "medium" }}
{{- $scale := or (.Get "scale") 4 }}
{{- $targetDir := or (.Get "targetDir") "" }}
{{- $alt := or (.Get "alt") "" }}
{{- $class := or (.Get "class") "" }}
{{- $id := or (.Get "id") "" }}
{{- $title := or (.Get "title") "" }}
{{- $loading := or (.Get "loading") "" }}

{{- /* Validate arguments. */}}
{{- $errors := false}}
{{- if not $text }}
  {{- errorf "The %q shortcode requires a %q argument. See %s" .Name "text" .Position }}
  {{- $errors = true }}
{{- end }}
{{- if not (in $validLevels $level) }}
  {{- errorf "The %q argument passed to the %q shortcode must be one of %s. See %s" "level" .Name (delimit $validLevels ", " ", or ") .Position }}
  {{- $errors = true }}
{{- end }}
{{- if or (lt $scale $minimumScale) (ne $scale (int $scale)) }}
  {{- errorf "The %q argument passed to the %q shortcode must be an integer greater than or equal to %d. See %s" "scale" .Name $minimumScale .Position }}
  {{- $errors = true }}
{{- end }}

{{- /* Render image. */}}
{{- if not $errors }}
  {{- $opts := dict "level" $level "scale" $scale "targetDir" $targetDir }}
  {{- with images.QR $text $opts -}}
    <img src="{{ .RelPermalink }}" width="{{ .Width }}" height="{{ .Height }}"
      {{- with $alt }} alt="{{ $alt }}" {{- end }}
      {{- with $class }} class="{{ $class }}" {{- end }}
      {{- with $id }} id="{{ $id }}" {{- end }}
      {{- with $title }} title="{{ $title }}" {{- end -}}
      {{- with $loading }} loading="{{ $loading }}" {{- end -}}
    >
  {{- end }}
{{- end -}}
```


Code explanation.
1. Assigning the arguments values (`$text`, `$level`, `$scale`, etc.) dependent on the parameters of the shortcode call or default values.
2. The arguments values are validated.
If the parameter `text` was not passed in the shortcode call
or if other parameters trigger an invalid situation (like incompatible `level` and `validLevels`) 
then `$errors` is set to `true`.
Which will cause the image to not be rendered (the `{{- if not $errors }}` condition).
The requirement for the presence of the parameter `text` is explained in the [comment](https://manski.net/articles/hugo/comments)
`@param {string} text The text to encode...` where its `text` is not wrapped in square brackets.
3. The QR object itself is achieved calling the `images.QR` function with the arguments `$text` (e.g. an URL) and `$opts` (a dictionay with some of the rest arguments).
We could add (and bold) some parentheses to clarify the evaluation order: `{{- with `**`(`**`images.QR $text $opts`**`)`**` -}}`.
4. That function returns an object. Let's suppose that that object is `true`-ish (ideally an image with relPermalink, width and height for later use).
Then the dot `.` is binded to this QR object, thanks to the `{{ with VAR }}` syntax, for the current `with` scope.
5. Inside the `with` block it's rendered the HTML element `<img>` providing:
- Properties of the dot (the QR-object returned by the `images.QR` function), respectively `{{ .RelPermalink }}` (for the `src` attribute), `{{ .Width }}` and `{{ .Height }}`:
- `class`, `id`, etc. `<img>`-attributes value the respective arguments (`$class`, `$id`, etc.). Checking each string
(yes, [qr.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/qr.html) initial lines define all the shortcode call parameters as string,
except `scale`, and logically the respective template arguments are also strings)
and if they are truthy then their respective `with` will assign its value to the homonym attribute.
For example `{{- with $alt }} alt="{{ $alt }}" {{- end }}`

{{< highlight HTML "linenos=inline, hl_lines=5, linenostart=67">}}
{{- /* Render image. */}}
{{- if not $errors }}
  {{- $opts := dict "level" $level "scale" $scale "targetDir" $targetDir }}
  {{- with images.QR $text $opts -}}
    <img src="{{ .RelPermalink }}" width="{{ .Width }}" height="{{ .Height }}"
      {{- with $alt }} alt="{{ $alt }}" {{- end }}
      {{- with $class }} class="{{ $class }}" {{- end }}
      {{- with $id }} id="{{ $id }}" {{- end }}
      {{- with $title }} title="{{ $title }}" {{- end -}}
      {{- with $loading }} loading="{{ $loading }}" {{- end -}}
    >
  {{- end }}
{{- end -}}
{{< /highlight >}}


## Ref

[Docs](https://gohugo.io/shortcodes/ref/):
> This shortcode is **obsolete** [...] use the [embedded link render hook](https://gohugo.io/render-hooks/links/#embedded) or create your own

The [embedded link render hook](https://gohugo.io/render-hooks/links/#embedded)

> Create a link render hook to override the rendering of Markdown links to HTML.

MWE

```texts
[Post 1](/posts/post-1 "My first post")
 ------  -------------  -------------
  text    destination       title
```

Template script in [render-link.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_markup/render-link.html):

```go
{{- $u := urls.Parse .Destination -}}
{{- $href := $u.String -}}
{{- if strings.HasPrefix $u.String "#" -}}
  {{- $href = printf "%s#%s" .PageInner.RelPermalink $u.Fragment -}}
{{- else if and $href (not $u.IsAbs) -}}
  {{- $path := strings.TrimPrefix "./" $u.Path -}}
  {{- with or
    ($.PageInner.GetPage $path)
    ($.PageInner.Resources.Get $path)
    (resources.Get $path)
  -}}
    {{- $href = .RelPermalink -}}
    {{- with $u.RawQuery -}}
      {{- $href = printf "%s?%s" $href . -}}
    {{- end -}}
    {{- with $u.Fragment -}}
      {{- $href = printf "%s#%s" $href . -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
<a href="{{ $href }}" {{- with .Title }} title="{{ . }}" {{- end }}>{{ .Text }}</a>
{{- /**/ -}}
```

Explanation.

1. When you write a Markdown link like `[Post 1](/posts/post-1 "My first post")` Hugo parses it into a [dot] structured object with these fields:
- `.Text`: `"Post 1"`, the link text. To be found in: `</a href="...">{{ .Text }}</a>`.
- `.Title`: `"My first post"` (the optional title attribute). Also in the second to last line: `{{- with .Title }} title="{{ . }}" {{- end }}`.
- `.Destination`: `"/posts/post-1"` is the URL/target to be parsed.
2. `{{- $u := urls.Parse .Destination -}}` calls the `urls.Parse` [function](https://gohugo.io/functions/urls/parse/)
on the `.Destination` paramater. The return populates the `$u` [URL structure](https://godoc.org/net/url#URL):
  - `$u.String`: full URL (`/posts/post-1`)
  - `$u.Path`: path part (`"/posts/post-1"`).
  - `$u.Fragment`: empty (unless URL had `#section`)
  - `$u.RawQuery`: empty (unless URL had `?foo=bar`)
  - `$u.IsAbs`: `false`. This method reports whether the URL is absolute (with a non-empty scheme like `https://...`). Examples in [docs](https://pkg.go.dev/net/url?utm_source=godoc#URL.IsAbs)

The `urls.Parse` [reference](https://gohugo.io/functions/urls/parse/) provides a more complete example:

```go
{{ $url := "https://example.org:123/foo?a=6&b=7#bar" }}
{{ $u := urls.Parse $url }}

{{ $u.String }}        // https://example.org:123/foo?a=6&b=7#bar
{{ $u.IsAbs }}         // true
{{ $u.Scheme }}        // https
{{ $u.Host }}          // example.org:123
{{ $u.Hostname }}      // example.org
{{ $u.RequestURI }}    // /foo?a=6&b=7
{{ $u.Path }}          // /foo
{{ $u.RawQuery }}      // a=6&b=7
{{ $u.Query }}         // map[a:[6] b:[7]]
{{ $u.Query.a }}       // [6]
{{ $u.Query.Get "a" }} // 6
{{ $u.Query.Has "b" }} // true
{{ $u.Fragment }}      // bar
```


3. The remaining code lines concatenate strings into the variable `$href` (for the `href` attribute) to construct the `<a>` HTML element: 

```html
<a href="/resolved/path/to/post-1" title="My first post">Post 1</a>
```

OK, understood. But...why not just use the default markdown `[text](url)`?
Well, among other features, this render hook adds **smart resolution** for:
1. **Relative links**: ensures `/posts/post-1` points to the correct permalink (e.g., `/blog/post-1/`).
2. **Fragments**: fixes `#section` links to work with Hugo's URL structure.


## Relref

[Docs](https://gohugo.io/shortcodes/relref/):
> This shortcode is **obsolete** [...] use the [embedded link render hook](https://gohugo.io/render-hooks/links/#embedded) or create your own

This is the same warning message as for [Ref](#ref).
Read the [Ref](#ref) section to grasp how an [embedded link render hook](#embedded-link-render-hook) works.


## Vimeo


### MWE  {#vimeo-mwe}

```texts
{{</* vimeo 55073825 */>}}
```

Renders the Vimeo video https://vimeo.com/channels/staffpicks/55073825 to:


{{< vimeo 55073825 >}}

The [docs](https://gohugo.io/shortcodes/vimeo/):
- Explain each argument
- How to overwrite this shortcode call to run your own shortcode template
- And the Hugo configs related

### Declaration {#vimeo-declaration}

First understand the comprensive explanation of the `display` shortcode in previous [section](#display-declaration).

Vimeo's shortcode template is [vimeo.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/vimeo.html).
But if in your Hugo configs has set `true` to `simple`'s Vimeo `privacy` (like next `hugo.toml` extract)
then it runs [vimeo_simple.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/vimeo_simple.html)
(`{{- if $pc.Simple }}` code lines).

```toml
privacy:
  vimeo:
    disable: false
    enableDNT: false
    simple: true # default is false
```


[vimeo.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/vimeo.html)
is easy to understand if you has comprehended the [Instagram](#instagram-declaration) template.
Below `@param`s, `@return` and `@example`-s [comments](https://manski.net/articles/hugo/comments) are removed,
while some commented insights and blank lines are added.

```go
{{/* Get hugo.toml configs about Vimeo's privacy */}}
{{- $pc := site.Config.Privacy.Vimeo }}


{{/* If Vimeo's privacy is not disabled */}}
{{- if not $pc.Disable }}


  {{/* If Vimeo's privacy is simple run the respective template */}}
  {{- if $pc.Simple }}
    {{- template "_shortcodes/vimeo_simple.html" . }}
  {{- else }}


    {{/* Get arguments.
    By:
      - `id` can be the 1st positional param or a named param.
      - All rest must be named params: `title`, `class`,...

    If a parameter is not passed in the shortcode call (or passed nil) then assign the respective default value to its argument.
    Otherwise assign the param value.

    Validate bool argument $allowFullScreen (and $iframeAllowList).
    Validate $id in later render block (with).

    Constant $divStyle and $iframeStyle
    --- START --- */}}

    {{- $dnt := cond $pc.EnableDNT 1 0 }} {{/* For $src */}}

    {{- $allowFullScreen := true }}
    {{- $class := or (.Get "class") }}
    {{- $id := or (.Get "id") (.Get 0) }}
    {{- $loading := or (.Get "loading") }}
    {{- $title := or (.Get "title") }}

    {{- if in (slice "true" true 1) (.Get "allowFullScreen") }}
      {{- $allowFullScreen = true }}
    {{- else if in (slice "false" false 0) (.Get "allowFullScreen") }}
      {{- $allowFullScreen = false }}
    {{- end }}

    {{- $iframeAllowList := "" }}
    {{- if $allowFullScreen }}
      {{- $iframeAllowList = "fullscreen" }}
    {{- end }}

    {{- $divStyle := "position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;" }}
    {{- $iframeStyle := "position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" }}

    {{/* --- END --- */}}


    {{/* Render <div> and <iframe>
    --- START --- */}}

    {{- with $id }} {{/* id param must be pased in the shortcode call (1st positional or named) */}}
      {{- $src := printf "https://player.vimeo.com/video/%v?dnt=%v" . $dnt }}
      <div
        {{- with $class }}
          class="{{ . }}"
        {{- else }}
          style="{{ $divStyle | safeCSS }}"
        {{- end }}>
        <iframe
          src="{{- $src }}"
          {{- if not $class }}
            style="{{ $iframeStyle | safeCSS }}"
          {{- end }}
          {{- with $iframeAllowList }} allow="{{ . }}" {{- end }}
          {{- with $loading }} loading="{{ . }}" {{- end }}
          {{- with $title }} title="{{ . }}" {{- end }}>
        </iframe>
      </div>

    {{- else }}
      {{- errorf "The %q shortcode requires a video id, either as the first positional argument or an argument named id. See %s" .Name .Position }}

    {{- end }} {{/* with $id */}}

    {{/* --- END --- */}}


  {{- end }} {{/* if not $pc.Simple */}}
{{- end }} {{/* if not $pc.Disable */}}
```

So much effort into understanding the shortcode template;
it would be a shame if it went to waste because it wasn't properly called.
Check examples of invalid calls in the [Both named and positional args](#both-named-and-positional-args) section.

## X - Twitter


### MWE  {#x-mwe}

```texts
{{</* x user="SanDiegoZoo" id="1453110110599868418" */>}}
```

Renders the X's tweet https://x.com/SanDiegoZoo/status/1453110110599868418 to:


{{< x user="SanDiegoZoo" id="1453110110599868418" >}}

The [docs](https://gohugo.io/shortcodes/vimeo/):
- Explain each argument
- How to overwrite this shortcode call to run your own shortcode template
- And the Hugo configs related

### Declaration {#x-declaration}

First understand the comprensive explanation of the `display` shortcode in previous [section](#display-declaration).

X's shortcode template is [x.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/x.html).
But if in your Hugo configs has set `true` to `simple`'s X `privacy`
then it runs [x_simple.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/x_simple.html)

This is a little complex to understand it 100% since it take advantage of some functions:
- [`collections.Querify`](https://gohugo.io/functions/collections/querify/), in code just `querify` because Hugo allows omitting the namespace in templates
- [`transform.Unmarshal`](https://gohugo.io/functions/transform/unmarshal/)
- [`resources.GetRemote`](https://gohugo.io/functions/resources/getremote/)

Anyhow, if you want to attempt this comprehension challenge,
first read Vimeo's template overview in the [paragraph above](#vimeo-declaration). 


## YouTube


### MWE  {#youtube-mwe}

```texts
{{</* youtube 0RKpf3rK57I */>}}
```

Renders the video https://www.youtube.com/watch?v=0RKpf3rK57I to:


{{< youtube 0RKpf3rK57I >}}

The [docs](https://gohugo.io/shortcodes/vimeo/):
- Explain each argument
- How to overwrite this shortcode call to run your own shortcode template
- And the Hugo configs related

### Declaration {#youtube-declaration}

Youtube shortcode template is [youtube.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/youtube.html).

Fortunately, Vimeo's template overview in the [paragraph above](#vimeo-declaration) is analogous to YouTube's template.


## Override a default shortcode

For example the  `details` shortcode declaration in the script [`details.html`](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/details.html)
might not fit your needs.
To solve this we consulted the details shortcode [documentation](https://gohugo.io/shortcodes/details/), which says

> To override Hugo’s embedded `details` shortcode, copy the [source](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_shortcodes/details.html) code to a file with the same name in the `layouts/_shortcodes` directory.

Let's get to work.

1. `$EDITOR layouts/_shortcodes/details.html`. Note the underscore `_` in `_shortcodes`.
2. Paste next

```html
{{- /* Get arguments. */}}
{{- $class := or (.Get "class") "table-of-contents" }}
{{- $name := or (.Get "name") "" }}
{{- $summary := or (.Get "summary") "Table of Contents" }}
{{- $open := true }}
{{- if in (slice "false" false 0) (.Get "open") }}
  {{- $open = false }}
{{- else if in (slice "true" true 1) (.Get "open") }}
  {{- $open = true }}
{{- end }}

{{- /* Render. */}}
<details
  {{- with $class }} class="{{ . }}" {{- end }}
  {{- with $name }} name="{{ . }}" {{- end }}
  {{- with $open }} open {{- end }}
>
  <summary>{{ $summary | .Page.RenderString }}</summary>
  {{ .Inner | .Page.RenderString (dict "display" "block") -}}
</details>
```

Quick explanation:
- `@param`, `@reference` and `@examples` comments are removed for brevity
- The `title` [param and argument] is removed.
Now if we hover our pointer over the `<describe>` element we will no longer see a small pop-up text.
More about this global attribute [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/title). 
- `$summary` new default value is `"Table of contents"`.
- `$open` new default value is `true`
- `$class` new default value is `"table-of-contents"`. Define it in `layouts/partials/custom_head.html`. For example:

```CSS
details.table-of-contents > :not(summary) {
  font-weight: bold;
}
```

Which means: for all direct children (see [child combinator `>`](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator)),
except `<summary>`-s, of a `<details>` elements with class `table-of-contents` set the `font-weight` to `bold`.
So `:not(summary)` is every HTML element except `<summary>`.
This is valid because it's compatible with Hugo's `.Page.RenderString` method,
which is already briefly described when
 `.Inner` is discussed in the [Get values](#get-values) section within the [Details](#details) paragraphs.


3. Insert the shortcode call in a markdown, e.g., `$EDITOR content/en/myshortcode.md` with

```markdown
---
title: "Test Custom Details"
---

{{</* details */>}}
This `<p>` and `<code>` are bold
- And this `<li>` too.
- Even [links](https://gohugo.io)!

Every HTML element children of `<details>` is bold
...except `<summary>` !!

| Tables | are |
|----|---|
| not exempt | from |
| being | bold |
{{</* /details */>}}
```

4. Build `hugo server --disableFastRender`
5. Check in the browser ([http://localhost:1313/myshortcode/](http://localhost:1313/myshortcode/)) that it's rendered alike:

{{< details open=true summary="Table of Contents" class="table-of-contents-all-bold-but-summary" >}}
This `<p>` and `<code>` are bold
- And this `<li>` too.
- Even [links](https://gohugo.io)!

Every HTML element children of `<details>` is bold
...except `<summary>` !!


| Tables | are |
|----|---|
| not exempt | from |
| being | bold |
{{< /details >}}




## Hugo Scroll

Theme defined shortcodes are declared in [`layouts/shortcodes/`](https://github.com/zjedi/hugo-scroll/tree/master/layouts/shortcodes):

```sh
> tree layouts/shortcodes
layouts/shortcodes
├── contact_list.html
├── email.html
├── extlink.html
├── icon.html
├── phone.html
└── rawhtml.html
```


### Raw HTML

[`rawhtml.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/shortcodes/rawhtml.html) is defined as

```html
<!-- raw html -->
{{.Inner}}
```

E.g. usage to change `font-family` in part of a link `<a>` text:

```texts
{{</* rawhtml */>}}
  My post about Tolkien:
  <a href="/blogs/tolkien/">
  <span style="font-family: 'MiddleEarth JoannaVu', cursive;">Tolkien</span>:
  books, podcasts and much more!
  </a>
{{</* /rawhtml */>}}
```

Renders to:

{{< rawhtml >}}
  My post about Tolkien:
  <a href="/blogs/tolkien/">
  <span style="font-family: 'MiddleEarth JoannaVu', cursive;;">Tolkien</span>:
  books, podcasts and much more!
  </a>
{{< /rawhtml >}}


This is the simplest shortcode to use.
It uses `.Inner`. See [Get values](#get-values) for more info.

Alternative, to directly write HTML in your Hugo markdowns add next to your `config.toml` (or equivalent in YAML/JSON).
**But** it's **NOT** recommended.

```toml
[markup.goldmark.renderer]
  unsafe = true
```

Read
- [Do you set `unsafe = true` in `[markup.goldmark.renderer]`?](https://discourse.gohugo.io/t/do-you-set-unsafe-true-in-markup-goldmark-renderer/37555)
- https://gohugo.io/configuration/markup/


For simpler usage, just a block class/style attribute use [markdown attributes](https://gohugo.io/content-management/markdown-attributes/) like:

```texts
Tolkien
{class="font-middle-earth-joanna-vu"}

Tolkien
{.font-middle-earth-joanna-vu}

Tolkien
{style="font-family: 'MiddleEarth JoannaVu', 'Great Vibes', 'Open Sans', sans-serif;"}
```

### contact_list


[`contact_list.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/shortcodes/contact_list.html) is defined as

```go
{{ range .Site.Params.contacts }}
    <p><i class="{{ .icon }}"></i>&nbsp;<a href="{{ .url | safeURL }}">{{ .value }}</a></p>
{{ end }}
```

[`Site.Params`](https://gohugo.io/methods/site/params/) access docs.

Use

```texts
{{</*contact_list*/>}}
```

Renders to:

{{<contact_list>}}


It's almost all the content of the example site [`contact.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/contact.md?plain=1).


The theme's `params` are specified in your configuration file,
mine is [`config.toml`](https://github.com/juanMarinero/juanmarinero.github.io/blob/main/hugo.toml),
in `[params]` section. It starts with:

```toml
# Theme-specific variables `.Site.Params.myParamName`
[params]

    # The path to your "favicon". This should be a square (at least 32px x 32px) png-file.
    favicon = "images/favicon.png"
```

One can also read them via `hugo config | sed -n '/^\[params\]/,/^\[permalinks\]/p'`:

```
[params]
  copyright = '...'
  description = 'Juan Marinero...'
  favicon = 'images/favicon.png'
  hidedesignbyline = true/false
  image_options = 'webp ...'
  images = ['images/cover-image.jpg']
  title = 'Juan Marinero...'
  title_guard = true

  [[params.contacts]]
    icon = 'fa fa-phone'
    label = 'phone'
    url = 'tel:...'
    value = '...'
  ...
  [params.meta]
    keywords = "Data Science, ..."
[permalinks]
```

Read [Argument collection](https://gohugo.io/templates/shortcode/#argument-collection)
> Use the [Params](https://gohugo.io/methods/shortcode/params/) method to access the arguments as a collection.

MWE: read [Access site/page parameters](https://gohugo.io/templates/introduction/#access-site-parameters)
and [Current context](https://gohugo.io/templates/introduction/#current-context) for pages.

Concerning the contact list, the shortcode template `contact_list.html` loop all via `{{ range .Site.Params.contacts }}`.
More about the `range` function in the [docs](https://gohugo.io/functions/go-template/range/).
It's worth also checking how to access a specific element of the slice (or array) via `{{ index .Site.Params.contacts 0 }}` for example,
this is explained in previous section about the `param` shortcode, [link](#param-mwe).


### email and phone


[`email.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/shortcodes/email.html) is defined as

```go
{{ .Site.Params.contact.email }}
```

Usage:

```texts
{{</*email*/>}}
```


[`phone.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/shortcodes/phone.html) is analogous.


### extlink


[`extlink.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/shortcodes/extlink.html) is defined as

```go
{{ with .Get "href" }}
  <a href="{{ . }}" target="_blank">
{{ end }}
{{ with .Get "icon" }}
  <i class="{{ . }}"></i>
{{ end }}
{{ with .Get "text" }}
  {{ . }}</a>
{{ end }}
```

Example of shortcode call:

```texts
{{</* extlink href="https://example.com" text="Click Me" */>}}
```

Which renders as:

```html
<a href="https://example.com" target="_blank">Click Me</a>
```

i.e. to

{{< extlink href="https://example.com" text="Click Me" >}}

An optional icon can be created too:

```texts
{{</* extlink href="https://example.com" icon="fas fa-external-link-alt" text="Visit Example" */>}}
```

Renders to

```html
<a href="https://example.com" target="_blank"><i class="fas fa-external-link-alt"></i> Visit Example</a>
```

And one can see: 
{{< extlink href="https://example.com" icon="fas fa-external-link-alt" text="Visit Example" >}}

What about calling it without a `text` parameter? Or explicitly empty like this:

```texts
{{</* extlink href="https://example.com" text="" */>}}
```

Take a minute to study the highlighted code lines below.

{{< highlight go "hl_lines=7-9">}}
  {{ with .Get "href" }}
    <a href="{{ . }}" target="_blank">
  {{ end }}
  {{ with .Get "icon" }}
    <i class="{{ . }}"></i>
  {{ end }}
  {{ with .Get "text" }}
    {{ . }}</a>
  {{ end }}
{{< /highlight >}}

Well, in both scenarios the `{{ with .Get "text" }}` will be evaluated as `false`,
and consequently the `{{ . }}</a>` won't be rendered (with dot the `text` value).
This can be considered as a critical **flaw**,
or as a feature, since it makes both `href` and `text` mandatory parameters.

If both are mandatory lets prevent a broken link (`</a>` not closed) if the Hugo user forgets to pass the `text` parameter.
And analogous (missing opening `<a>` tag) if forgot to pass the `href` parameter.
Thus our proposal should render anything at all only if both parameters are passed.
Try to code it yourself!

{{< details summary="**Solution A** - Click to expand" >}}
```go
{{ $href := or (.Get "href") "" }}
{{ with $href }}
  {{ with .Get "text" }}
    <a href=$ref target="_blank">
    {{ with .Get "icon" }}
      <i class="{{ . }}"></i>
    {{ end }}
    {{ . }}
    </a>
  {{ end }}
{{ end }}
```
{{< /details >}}

{{< details summary="**Solution B** - Click to expand" >}}
```go
{{ $href := .Get "href" }}
{{ $text := .Get "text" }}
{{ if and $href $text }}
  <a href="{{ $href }}" target="_blank">
    {{ with .Get "icon" }}<i class="{{ . }}"></i> {{ end }}
    {{ $text }}
  </a>
{{ else }}
  {{ errorf "extlink shortcode requires 'href' and 'text' parameters. }}
{{ end }}
```
{{< /details >}}


{{< rawhtml >}}
<div style="height: 0.5em;"></div> <!-- Half line break -->
{{< /rawhtml >}}


### icon

[`icon.html`](https://github.com/zjedi/hugo-scroll/blob/master/layouts/shortcodes/icon.html) is defined as

```go
{{ if .Get "brand" }}
  {{ with .Get "name" }}<i class="fa-brands fa-{{ . }}"></i>{{ end }}
{{ else }}
  {{ with .Get "name" }}<i class="fa fa-{{ . }}"></i>{{ end }}
{{ end }}
```

Usage example passing `brand`

```texts
{{</* icon name="github" brand=true */>}}
```

Which renders as:

```html
<i class="fa-brands fa-github"></i>
```

i.e. to

{{< icon name="github" brand=true >}}

Now with `name`

```texts
{{</* icon name="rocket" */>}}
```

We get

```html
<i class="fa fa-rocket"></i>
```

And it's shown:

{{< icon name="rocket" >}}

A practical use (as tutorial) in the example site [`services.md`](https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/homepage/services.md?plain=1):


{{< highlight html >}}
### Icons

This theme includes the full set of [Font Awesome v6.6.0 icons](https://fontawesome.com/icons). Use the `{{</* icon */>}}` [shortcode](https://gohugo.io/content-management/shortcodes/) with the respective `name` to use an icon directly in your `.md` files. For example "{{</* icon name="envelope" */>}}":

```html
{{</* icon name="envelope" */>}}
```

If you want to use one of Font Awesome's brand icons—the ones that have a trademark warning and the `fa-brands` class—add `brand=true`. For example "{{</* icon name="github" brand=true */>}}":

```html
{{</* icon name="github" brand=true */>}}
```
{{< /highlight >}}





{{< rawhtml >}}
<div class="html-content">
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
</div>
{{< /rawhtml >}}
