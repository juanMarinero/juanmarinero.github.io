---
title: "Hugo render hooks: a quick guide"
description: "Extend the standard Markdown syntax with Hugo Render Hooks. Easily add CSS classes, IDs, responsive images, custom table alignment, GoAT diagrams and more."
keywords: ["Hugo Render Hooks", "Hugo templates", "customize Markdown", "Markdown rendering", "Goldmark", "headless CMS", "Hugo links", "Hugo images", "heading anchors", "automatic link titles", "Hugo theme development", "override Markdown output", "content styling", "Hugo blocks", "render-link hook", "render-image hook", "render-heading hook", "Hugo best practices", "web development", "static site generator", "custom attributes", "Hugo advanced features", "Hugo shortcodes"]
---

Reference https://gohugo.io/render-hooks/

Table of contents:

* [Shortcodes vs Render Hooks](#shortcodes-vs-render-hooks)
* [Blockquote](#blockquote)
  * [Alerts](#alerts)
    * [MWE](#blockquote-alerts-mwe)
    * [Declaration](#blockquote-alerts-declaration)
  * [As an HTML figure with an optional citation and caption](#as-an-html-figure-with-an-optional-citation-and-caption)
    * [MWE](#blockquote-figure-mwe)
    * [Declaration](#blockquote-figure-declaration)
  * [Multiple render hooks](#multiple-render-hooks)
* [Code block](#code-block)
  * [MWE](#codeblock-mwe)
  * [GoAT](#codeblock-goat)
* [Heading](#heading)
* [Image](#image)
  * [MWE](#image-mwe)
  * [Declaration](#image-declaration)
* [Link](#link)
* [Passthrough](#passthrough)
* [Table](#table)
  * [MWE](#table-mwe)
  * [Declaration](#table-declaration)



## Shortcodes vs Render Hooks

We studied shortcodes in the [previous post](/blogs/hugo_shortcodes/).
But what are the main differences between shortcodes and render hooks?

**Shortcodes**:
- Used **manual**ly in content files. You control when and how they're used. Ideal for complex elements/functionality:
  - Complex layout like a multi-column section
  - Dynamic data such as the *latest blog posts* list
  - Embed a specific piece of non-markdown content. E.g., a specific video player or an interactive map.
- Use the `{{</* ... */>}}` **syntax**. Multiline `{{</* details */>}}...{{</* /details */>}}` or inline as `{{</* qr text="https://gohugo.io" */>}}`.
- They allow **custom Go** HTML templates and complex logic, including calling Go functions.
See the flowchart of the [Highlight](/blogs/hugo_shortcodes/#highlight-declaration) shortcode explanation:
the template takes advantage of `transform.go` and `highlight.go` scripts.
- `.Page.RenderString` [method](https://gohugo.io/methods/page/renderstring/),
described in [previous post](/blogs/hugo_shortcodes/#get-values),
or other rendering methods can be applied *within* the shortcode to parse its inner content as Markdown. But they are optional.
- Shortcodes can be [nested](https://gohugo.io/content-management/shortcodes/#nesting).
Details [here](https://stackoverflow.com/questions/55401755/use-shortcode-within-definition-of-shortcode).

**Render Hooks**:
- Usage **global**ly for Markdown elements.
Automatically intercept and modify how standard markdown elements render.
It works implicitly, e.g. `> [!NOTE]` becomes an styled blockquote.
- **Standard Markdown** syntax, e.g. `[link](url)`. Thus, it's more **portable**, though the custom rendering would not automatically work in other engines.
- Specific Markdown rendering, it cannot call any Go function.
Only **certain Markdown elements** can be customized (images, links, headings, tables, etc.), whereas shortcodes can create virtually anything.


## Blockquote

- [Docs](https://gohugo.io/render-hooks/blockquotes/)
- [Goldmark source](https://github.com/gohugoio/hugo/blob/master/markup/goldmark/blockquotes/blockquotes.go)

### Alerts

#### MWE {#blockquote-alerts-mwe}

To achieve next automatic renders just follow the [docs](https://gohugo.io/render-hooks/blockquotes/) steps:

0. Create the directory `layouts/_markup/`
1. Copy the code in next section to `layouts/_markup/render-blockquote.html`
2. Edit your markdowns following next Minimal Working Examples

```texts
> [!NOTE]
> Useful information that users should know, even when skimming content.
```

Which renders to

> [!NOTE]
> Useful information that users should know, even when skimming content.

```texts
> [!TIP]
> Helpful advice for doing things better or more easily.
```

Previous renders to

> [!TIP]
> Helpful advice for doing things better or more easily.

```texts
> [!IMPORTANT]
> Key information users need to know to achieve their goal.
```

Now it renders to

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

```texts
> [!warning]
> Urgent info that needs immediate user attention to avoid problems.
```

Outputs:

> [!warning]
> Urgent info that needs immediate user attention to avoid problems.

```texts
> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

Can render in markdowns to next

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

Notice the red font-color is applied to every HTML element except the alert line (the first `<p>`aragraph) of the blockquote of type `alert-caution`.
This can be customized by editing `layouts/partials/custom_head.html`:

```css
blockquote.alert-caution *:not(p:first-of-type) {
  color: red;
}
```

#### Declaration {#blockquote-alerts-declaration}

Edit the `layouts/_markup/render-blockquote.html` script:

```go
{{ $emojis := dict
  "caution" ":exclamation:"
  "important" ":information_source:"
  "note" ":information_source:"
  "tip" ":bulb:"
  "warning" ":information_source:"
}}

{{ if eq .Type "alert" }}
  <blockquote class="alert alert-{{ .AlertType }}">
    <p class="alert-heading">
      {{ transform.Emojify (index $emojis .AlertType) }}
      {{ with .AlertTitle }}
        {{ . }}
      {{ else }}
        {{ or (i18n .AlertType) (title .AlertType) }}
      {{ end }}
    </p>
    {{ .Text }}
  </blockquote>
{{ else }}
  <blockquote>
    {{ .Text }}
  </blockquote>
{{ end }}
```

First of all I recommend you to understand basic Go code, `with` statement, etc.
Read [Go and Hugo code basics](/blogs/hugo_shortcodes/#go-and-hugo-code-basics) from my Hugo's shortcode post.

Let's dive in!

First a Go [dictionary](https://gohugo.io/functions/collections/dictionary/) for emojis is defined.
Depending on the `Alertype`-key the respective emoji-value is retrieved with `index $emojis .AlertType`.

The rest of the bloquote template is basicaly just:

```go
{{ if eq .Type "alert" }}
  [...]
{{ else }}
  <blockquote>
    {{ .Text }}
  </blockquote>
{{ end }}
```


I.e., if the blockquote is not an alert, the `{{ else }}`,
e.g. a single line like `> Useful information that users should know` not preceded by `> [!NOTE]` or alike,
then we just print the content of the blockquote as it is (`.Text`).

On the other hand, if the markdown blockquote (first line) is an alert [`Type`](https://gohugo.io/render-hooks/blockquotes/#type), `{{ if eq .Type "alert" }}` is true,
then we run the code that `[...]` represents - a `<blockquote>` element:
- The `alert` class and the `alert-{{ .AlertType }}` class (see [`AlertType`](https://gohugo.io/render-hooks/blockquotes/#alerttype)) define the style of the blockquote.
See the CSS style customization of a cauton blockquote at the end of previous subsection.
- The first paragraph `<p>` starts with the respecitive alert emoji, see [`transform.Emojify`](https://gohugo.io/functions/transform/emojify/).
- Then it's followed by the capitalized title of the alert, i.e. `Note`, `Tip`, `Warning`, etc. thanks to [`strings.Title`](https://gohugo.io/functions/strings/title/).
- The paragrah's final content is the [`.AlertTitle`](https://gohugo.io/render-hooks/blockquotes/#alerttitle) if any. We skipped this in previous MWEs,
read [Extended syntax](https://gohugo.io/render-hooks/blockquotes/#extended-syntax).
- Finally a second `<p>` is created with just the content of the second blockquote line, i.e. `{{ .Text }}`,
e.g. the line `> Useful information that users should know` if preceded by `> [!NOTE]` or other alerts.

Actually, a blockquote is allowed to have as many lines as we want, read [this](https://www.markdownguide.org/basic-syntax/#blockquotes-1) brief markdown guide.
For example the `.Text` may include all next lines (from second line onwards):

```texts
> [!CAUTION]
> **Multiple Paragraphs**:
>
> Paragraph 1.
>
> Paragraph 2.
>
> **Other Elements**:
>
> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going ~~according~~ to **plan**.
>
> **Nested Blockquotes**:
> 
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.
```

The markdown code above create next multiline blockquote. Notice though that the nested blockquotes seem to weirdly format:

> [!CAUTION]
> **Multiple Paragraphs**:
>
> Paragraph 1.
>
> Paragraph 2.
>
> **Other Elements**:
>
> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going ~~according~~ to **plan**.
>
> **Nested Blockquotes**:
> 
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.



### As an HTML figure with an optional citation and caption

#### MWE {#blockquote-figure-mwe}

```texts
> Some text
{cite="https://gohugo.io" caption="—Some caption"}
```

Can be rendered to next HTML if `layouts/_markup/render-blockquote.html` is edited to next section content.

{{< rawhtml >}}
<figure>
  <blockquote cite="https://gohugo.io">
    <p>
      Some text
    </p>
  </blockquote>
  <figcaption class="blockquote-caption">
    —Some caption
  </figcaption>
</figure>
{{< /rawhtml >}}


Which is close to the standard usage of this HTML element. Read the [`<blockquote>` Mozilla docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote).

```texts
{{</* rawhtml */>}}
<div>
  <blockquote cite="https://www.huxley.net/bnw/four.html">
    <p>
      Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.
    </p>
  </blockquote>
  <p>—Aldous Huxley, <cite>Brave New World</cite></p>
</div>
{{</* /rawhtml */>}}
```

Previous raw HTML outputs:

{{< rawhtml >}}
<div>
  <blockquote cite="https://www.huxley.net/bnw/four.html">
    <p>
      Words can be like X-rays, if you use them properly—they’ll go through
      anything. You read and you’re pierced.
    </p>
  </blockquote>
  <p>—Aldous Huxley, <cite>Brave New World</cite></p>
</div>
{{< /rawhtml >}}

#### Declaration {#blockquote-figure-declaration}

- Enable Markdown attributes editing your `hugo.toml` as explained [here](https://gohugo.io/render-hooks/blockquotes/#attributes)
- And re-edit `layouts/_markup/render-blockquote.html` script:

```go
<figure>
  <blockquote {{ with .Attributes.cite }}cite="{{ . }}"{{ end }}>
    {{ .Text }}
  </blockquote>
  {{ with .Attributes.caption }}
    <figcaption class="blockquote-caption">
      {{ . | safeHTML }}
    </figcaption>
  {{ end }}
</figure>
```

Now we no longer try to read `Tipe`, `AlertType` and `AlertTitle` attributes, but `Attributes` instead.
- If the line after a markdown quote (wrapped in curly braces) shows the parameter `cite`, then it's added to the `<figure>`-`<blockquote>` element.
- Analogous for the `caption`. If it's passed, then that's the `<figcaption>` text.


### Multiple render hooks

Notice that previous [blockquote-alerts](#blockquote-alerts) render hooks and the later [figure citations render hooks](#blockquote-figure) are mutually exclusive
because their respective HTML template `layouts/_markup/render-blockquote.html` are different.

I recommend to set as **render hook** the **most frequent** for you.
The other one can be set as a **custom shortcode**, the process is detailed in my previous [post](/blogs/hugo_shortcodes/#get);
alternative, write HTML directly in your Hugo markdowns via the [raw HTML](/blogs/hugo_shortcodes/#raw-html) shortcode.

This advise holds for ordinary blockquotes,
but if your blockquote might display complex HTML elements, requires special Go embedding functions, etc. then write it in a custom shortcode instead of a render hook.
Read the [Shortcodes vs Render Hooks](#shortcodes-vs-render-hooks) initial chapter.

## Code block

Hugo's internal template system for rendering code blocks is available since
[v0.93.0](https://github.com/gohugoio/hugo/releases/tag/v0.93.0).
Same release enabled diagram render hooks with GoAT (Go ASCII Tool) too.

### MWE {#codeblock-mwe}

As explained in the highlight shortcode [example](/blogs/hugo_shortcodes/#highlight-mwe) of my specific post, we can highlight code chunks with

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

We can achieve the same via code blocks render hooks:

{{< rawhtml >}}
  <pre><code>&#96;&#96;&#96;go {lineNos=inline hl_lines="3 6-8" style=monokai}
package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        fmt.Println("Value of i:", i)
    }
}
&#96;&#96;&#96;</code></pre>
{{< /rawhtml >}}

Which also renders to:

```go {lineNos=inline hl_lines="3 6-8" style=monokai}
package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        fmt.Println("Value of i:", i)
    }
}
```

One can pass even `class`-es and `id`. Read the docs 
https://gohugo.io/render-hooks/code-blocks/


### GoAT {#codeblock-goat}


For example, the following GoAT diagram

{{< rawhtml >}}
<pre><code>&#96;&#96;&#96;goat
      .               .               .--- 1
     / \              |           .---+     
    /   \         .---+---.       |   '--- 2
   +     +        |       |    ---+         
  / \   / \     .-+-.   .-+-.     |   .--- 3
 /   \ /   \    |   |   |   |     '---+     
 1   2 3   4    1   2   3   4         '--- 4
&#96;&#96;&#96;</code></pre>
{{< /rawhtml >}}

Gets converted to

```goat
      .               .               .--- 1
     / \              |           .---+     
    /   \         .---+---.       |   '--- 2
   +     +        |       |    ---+         
  / \   / \     .-+-.   .-+-.     |   .--- 3
 /   \ /   \    |   |   |   |     '---+     
 1   2 3   4    1   2   3   4         '--- 4
```

Many more Go ASCII diagram examples [here](https://gohugo.io/content-management/diagrams/)!

Further references:
- [Docs](https://gohugo.io/render-hooks/code-blocks/#embedded)
- [render-codeblock-goat.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_markup/render-codeblock-goat.html)
- For other diagram renderes, not only GoAT, like Mermaid, read [this](https://gohugo.io/render-hooks/code-blocks/#examples).
Follow the tip, create *language-specific templates* `layouts/_markup/render-codeblock</-python/-mermaid>.html`.


## Heading

This will be summary in a nutshell.

```texts
# Heading 1
## Heading 1.1
```

Creates a default `id` for each header. It's equivalent to:

```texts
# Heading 1 {#heading-1}
## Heading 1.1 {#heading-1.1}
```

Notice the `id` might appear, as in previous code, the first and only positional paramenter (detailed explaind in my shortcode [post](/blogs/hugo_shortcodes/#positional-arguments))
or it can be defined as a named parameter (read prev. post too) like the `class`-es.
E.g.

```texts
# Heading 1 {id="heading-1" class="foo"}
## Heading 1.1 {id="heading-1.1" class="bar"}
```

Or mix of both:

```texts
# Heading 1 {#heading-1 class="foo"}
## Heading 1.1 {#heading-1.1 class="bar"}
```


For further information and guide to override this default render hook read the [docs](https://gohugo.io/render-hooks/headings/).


## Image

The default render hook funcionality can be customized/expanded
applying [image process](https://gohugo.io/content-management/image-processing/#image-processing-performance-consideration) methods
in your **custom shortcode** template.

Let's:
- First understand how the image **render hook**s operates in next pararagraphs
- Then, find out the how to the official *figure* **shortcode** works in my [Hugo shortcodes](/blogs/hugo_shortcodes/#fig) post.

You can do it, but you don't have to - *kann man, muss aber nicht* in German.
No need to study any figure (image) shortcode nor image processing if next render hook already fulfills your requirements.


### MWE {#image-mwe}

```texts
![favicon](images/favicon.png "This website favicon!")
{id="bar" class="foo"}
```

Renders to

```html
<img
  src="/images/favicon.png"
  alt="favicon"
  title="This website favicon!"
  class="foo"
  id="bar">
```

And is displayed as

![favicon](images/favicon.png "This website favicon!")
{id="bar" class="foo"}

Note, Hugo automatically uses the [embedded image render hook](https://gohugo.io/render-hooks/images/#embedded) for multilingual single-host sites.
Since next is the default config:

```toml
[markup.goldmark.embeddedImageRender]
enable = 'auto'  # or 'always', 'fallback', 'never'
```

Other options are:
- `always`: Force use of embedded hook
- `fallback`: Use only if no custom render hooks exist
- `never`: Disable embedded hook

Do not forget to disable next as well:

```toml
[markup.goldmark.parser]
  wrapStandAloneImageWithinParagraph = false
```

Why is this needed at all?
Well, this render hook processes Markdown image links to provide better resource handling:
- **Find** the actual **image file**
- **Generate** the correct **URL** for it

We will explain these two main purposes in detail in the next [section](#image-declaration) studying the template code.

The [docs](https://gohugo.io/render-hooks/images/#embedded) emphasize the first feature, the *image destination*, so next we will exemplify the other one.
Next embedded image:

```texts
![Unrecognizable woman walking dogs on leashes in countryside](https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?width=640 "Image title")
```

It's rendered to (notice the `?width=640` in the `src`-URL is kept):

```html
<img
  src="http://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?width=640"
  alt="Unrecognizable woman walking dogs on leashes in countryside"
  title="Image title"
>
```

Which leads to

![Unrecognizable woman walking dogs on leashes in countryside](http://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?width=640 "Image title")

Open the image in a new tab to confirm that it maintains the `width` query parameter.
No need to load a heavier image (which would happen if `enable='never'`) if the web editor finds a lighter one good enough.


### Declaration {#image-declaration}

Code of [render-image.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_markup/render-image.html):

```go
{{- $u := urls.Parse .Destination -}}
{{- $src := $u.String -}}
{{- if not $u.IsAbs -}}
  {{- $path := strings.TrimPrefix "./" $u.Path -}}
  {{- with or (.PageInner.Resources.Get $path) (resources.Get $path) -}}
    {{- $src = .RelPermalink -}}
    {{- with $u.RawQuery -}}
      {{- $src = printf "%s?%s" $src . -}}
    {{- end -}}
    {{- with $u.Fragment -}}
      {{- $src = printf "%s#%s" $src . -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
<img src="{{ $src }}" alt="{{ .PlainText }}"
  {{- with .Title }} title="{{ . }}" {{- end -}}
  {{- range $k, $v := .Attributes -}}
    {{- if $v -}}
      {{- printf " %s=%q" $k ($v | transform.HTMLEscape) | safeHTMLAttr -}}
    {{- end -}}
  {{- end -}}
>
{{- /**/ -}}
```

#### Relative Path Resolution

```go
{{- if not $u.IsAbs -}}  // If it's not an absolute URL (remote image)
{{- $path := strings.TrimPrefix "./" $u.Path -}}
```

- Removes `./` prefix if present
- Handles relative paths correctly

#### Resource Lookup

```go
{{- with or (.PageInner.Resources.Get $path) (resources.Get $path) -}}
```

- First tries to find the image in **page resources** (images in the same directory as the content file)
- Falls back to **global resources** (images in `assets/` or `static/` directories)

#### Preserves URL Components

```go
{{- with $u.RawQuery -}}
  {{- $src = printf "%s?%s" $src . -}}
{{- end -}}
{{- with $u.Fragment -}}
  {{- $src = printf "%s#%s" $src . -}}
{{- end -}}
```

- Maintains query parameters like `?width=640` of the original URL in previous section example
- Preserves fragments as `#thumbnail`

#### Safe HTML Attributes

```go
{{- range $k, $v := .Attributes -}}
  {{- if $v -}}
    {{- printf " %s=%q" $k ($v | transform.HTMLEscape) | safeHTMLAttr -}}
  {{- end -}}
{{- end -}}
```

This chunk processes programmatically assigned [attributes](https://gohugo.io/render-hooks/images/#attributes).

It's like the `{...}` attribute syntax that we saw on [heading](#heading) render hooks.
E.g. the `{id="bar" class="foo"}` in

```texts
![favicon](images/favicon.png "This website favicon!")
{id="bar" class="foo"}
```


## Link

The link render hooks in Hugo work in a completely analogous way to the image render hooks just studied.

Therefore read the previous section about [images](#images) render hooks to better comprehend: 
- Its [docs](https://gohugo.io/render-hooks/links/)
- And its template [render-link.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_markup/render-link.html).


Example usage:

```texts
[Tolkien: books, podcasts and much more!](/blogs/tolkien)
{class="font-middle-earth-joanna-vu"}
```

Renders to:

[Tolkien: books, podcasts and much more!](/blogs/tolkien)
{class="font-middle-earth-joanna-vu"}


## Passthrough

Passthrough render hooks allow to **override** the **rendering** of **raw Markdown text** that is preserved by Goldmark's Passthrough extension.
This is for content wrapped in special delimiters that should bypass normal Markdown processing.

{{< rawhtml >}}
  The passthrough extension is often used in conjunction with the MathJax extension,
  check out my post concerning
  <a href="/blogs/latex_for_webdev/">
  $\LaTeX$ and $\text{Ti}\textit{k}\text{Z}$ for <strong>web dev</strong>
  </a>.
{{< /rawhtml >}}

References: https://gohugo.io/render-hooks/passthrough/



## Table

To achieve next automatic renders just follow the [docs](https://gohugo.io/render-hooks/tables/) steps:

1. Create the directory `layouts/_markup/`
2. Copy the code in next [declaration section](#table-declaration) to `layouts/_markup/render-table.html`
3. Edit your markdowns following next Minimal Working Examples

### MWE {#table-mwe}

##### Default left alignment


```markdown
| Name      | Age   | Score       | Country |
| ---       | ---   | ---         | ---     |
| Maria     | 30    | 95          | Spain   |
| Daniel    | 25    | 87          | Germany |
{id="t1"}
```

Renders to

```html
<table id="t1">
  <thead>
      <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Score</th>
          <th>Country</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td>Maria</td>
          <td>30</td>
          <td>95</td>
          <td>Spain</td>
      </tr>
      <tr>
          <td>Daniel</td>
          <td>25</td>
          <td>87</td>
          <td>Germany</td>
      </tr>
  </tbody>
</table>
```

And looks like next, notice the left alignment

| Name      | Age   | Score       | Country |
| ---       | ---   | ---         | ---     |
| Maria     | 30    | 95          | Spain   |
| Daniel    | 25    | 87          | Germany |
{id="t1"}

##### Block display

```markdown
| Name   | Age   | Score | Country |
| ---    | ---   | ---   | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{id="t2" style="display: block"}
```

Renders to

```html
<table id="t2" style="display: block">
  <thead>
      <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Score</th>
          <th>Country</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td>Maria</td>
          <td>30</td>
          <td>95</td>
          <td>Spain</td>
      </tr>
      <tr>
          <td>Daniel</td>
          <td>25</td>
          <td>87</td>
          <td>Germany</td>
      </tr>
  </tbody>
</table>
```

Output:

| Name   | Age   | Score | Country |
| ---    | ---   | ---   | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{id="t2" style="display: block"}


##### Alignment wrong way

```markdown
| Name   | Age   | Score | Country |
| ---    | ---   | ---   | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{id="t3" style="text-align: right"}
```

Renders to

```html
<table id="t3" style="text-align: right">
  <thead>
      <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Score</th>
          <th>Country</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td>Maria</td>
          <td>30</td>
          <td>95</td>
          <td>Spain</td>
      </tr>
      <tr>
          <td>Daniel</td>
          <td>25</td>
          <td>87</td>
          <td>Germany</td>
      </tr>
  </tbody>
</table>
```

Notice the fail in the right alignment:

| Name   | Age   | Score | Country |
| ---    | ---   | ---   | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{id="t3" style="text-align: right"}



##### Alignment correct approach

```markdown
| Name   | Age   | Score | Country |
| ---    | :---: | ---:  | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{id="t4" style="color: blue"}
```

Renders to

```html
<table id="t4" style="color: blue">
  <thead>
      <tr>
          <th>Name</th>
          <th style="text-align: center">Age</th>
          <th style="text-align: right">Score</th>
          <th>Country</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td>Maria</td>
          <td style="text-align: center">30</td>
          <td style="text-align: right">95</td>
          <td>Spain</td>
      </tr>
      <tr>
          <td>Daniel</td>
          <td style="text-align: center">25</td>
          <td style="text-align: right">87</td>
          <td>Germany</td>
      </tr>
  </tbody>
</table>
```

Thanks to the `:---:` and `---:` we can align the columns


| Name   | Age   | Score | Country |
| ---    | :---: | ---:  | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{id="t4" style="color: blue"}



##### ID and classes

```markdown
| Name   | Age   | Score | Country |
| ---    | :---: | ---:  | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{id="t5" class="font-middle-earth-joanna-vu"}
```
Or directly

```markdown
| Name   | Age   | Score | Country |
| ---    | :---: | ---:  | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{#t5 .font-middle-earth-joanna-vu}
```

Renders the next HTML where the Middle Earth font is applied

```html
<table class="font-middle-earth-joanna-vu" id="t5">
  <thead>
      <tr>
          <th>Name</th>
          <th style="text-align: center">Age</th>
          <th style="text-align: right">Score</th>
          <th>Country</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td>Maria</td>
          <td style="text-align: center">30</td>
          <td style="text-align: right">95</td>
          <td>Spain</td>
      </tr>
      <tr>
          <td>Daniel</td>
          <td style="text-align: center">25</td>
          <td style="text-align: right">87</td>
          <td>Germany</td>
      </tr>
  </tbody>
</table>
```

Output:


| Name   | Age   | Score | Country |
| ---    | :---: | ---:  | ---     |
| Maria  | 30    | 95    | Spain   |
| Daniel | 25    | 87    | Germany |
{id="t5" class="font-middle-earth-joanna-vu"}


##### Long tables

```markdown
| Name   | Age   | Score | Country | City   | Nationality | University          | Experience (years) |
| ---    | :---: | ---:  | ---     | ---    | ---         | ---                 | ---                |
| Maria  | 30    | 95    | Spain   | Madrid | Spanish     | UNED                | 3                  |
| Daniel | 25    | 87    | Germany | Berlin | German      | Hochschule Muenchen | 2.5                |
{#t6}
```

The display indicates that the render hook template has considerable room for improvement. For example a scrollable table.


| Name   | Age   | Score | Country | City   | Nationality | University          | Experience (years) |
| ---    | :---: | ---:  | ---     | ---    | ---         | ---                 | ---                |
| Maria  | 30    | 95    | Spain   | Madrid | Spanish     | UNED                | 3                  |
| Daniel | 25    | 87    | Germany | Berlin | German      | Hochschule Muenchen | 2.5                |
{#t6}


### Declaration {#table-declaration}

The [render-table.html](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_markup/render-table.html) template is

```go
<table
  {{- range $k, $v := .Attributes }}
    {{- if $v }}
      {{- printf " %s=%q" $k ($v | transform.HTMLEscape) | safeHTMLAttr }}
    {{- end }}
  {{- end }}>
  <thead>
    {{- range .THead }}
      <tr>
        {{- range . }}
          <th
            {{- with .Alignment }}
              {{- printf " style=%q" (printf "text-align: %s" .) | safeHTMLAttr }}
            {{- end -}}
          >
            {{- .Text -}}
          </th>
        {{- end }}
      </tr>
    {{- end }}
  </thead>
  <tbody>
    {{- range .TBody }}
      <tr>
        {{- range . }}
          <td
            {{- with .Alignment }}
              {{- printf " style=%q" (printf "text-align: %s" .) | safeHTMLAttr }}
            {{- end -}}
          >
            {{- .Text -}}
          </td>
        {{- end }}
      </tr>
    {{- end }}
  </tbody>
</table>
```


The template basically adds:
- Process programmatically [attributes](https://gohugo.io/render-hooks/images/#attributes). Explained in [Safe HTML Attributes](#safe-html-attributes) subsection.
- Correct alignment of table cells


{{< rawhtml >}}
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
{{< /rawhtml >}}
