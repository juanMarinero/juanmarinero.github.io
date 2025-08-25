---
---

<!-- Remove 'title' in markdown header and replace it with next -->
<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
<h1>$\LaTeX$ and $\text{Ti}\textit{k}\text{Z}$ for web developers</h1>
</div>
{{< /rawhtml >}}

$\LaTeX$ is a markup language for typesetting math and science.
It's used in web-dev because it's a **fast and easy** way to typeset equations and other math content.

Official [documentation](https://gohugo.io/content-management/mathematics/).

Table of Contents
* [MathJax Support](#mathjax-support)
  * [Block equations](#block-equations)
  * [Error handling](#error-handling)
  * [LaTeX packages](#latex-packages)
    * [Include extra packages](#include-extra-packages)
    * [Test a LaTeX package](#test-a-latex-package)
* [TikZ](#tikz)
  * [Enable TikZ](#enable-tikz)
  * [TikZJax issues](#tikzjax-issues)


## MathJax Support

1. Enable and configure the Goldmark passthrough extension in your site configs as described [here](https://gohugo.io/content-management/mathematics/#step-1).
2. Open a terminal. Go to your project directory: `cd <path>`
3. Run `$EDITOR layouts/partials/custom_head.html`
4. Append and save
```
<!-- MathJax Support -->
<!-- https://docs.mathjax.org/en/latest/options/input/tex.html -->
<script>
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true,
    packages: {'[+]': ['ams', 'boldsymbol']}  // 'base' + extras
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    ignoreHtmlClass: 'tex2jax_ignore'
  },
  loader: {
    load: ['[tex]/ams', '[tex]/boldsymbol']
  },
  startup: {
    ready() {
      console.log('MathJax is initializing...');
      MathJax.startup.defaultReady();
      MathJax.startup.promise.then(() => {
        console.log('MathJax typesetting complete');
      }).catch((err) => {
        console.error('MathJax failed:', err);
      });
    }
  }
};
</script>
<!-- Only include polyfill if supporting older browsers -->
<script src="https://cdn.jsdelivr.net/npm/core-js-bundle@3/minified.js"></script>
<!-- https://www.mathjax.org/#gettingstarted -->
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@4.0.0/tex-mml-chtml.js"></script>
```

5. Edit a markdown file, for example `content/en/*.md`
6. Insert $\LaTeX$ code inline like `$\sqrt{x^2 + y^2} = r$` or in `$$` blocks. Save
7. Build it with `hugo server --disableFastRender`.
Build details in my post [How to **create** a **Hugo-scroll web**site](/blogs/create_hugo_website/)
8. Check locally the changes on [http://localhost:1313/](http://localhost:1313/) or alike
9. Open the browser console. Refresh the page.
10. Check if any error is loaded. It should just show `MathJax is initializing...` and `MathJax typesetting complete`
11. Run `console.log('MathJax version:', MathJax.version)`. Expected output: `4.0.0`

### Block equations

Long one line **equations**, like [this](https://github.com/acgetchell/blog/blob/56b8c03c0f66dbd1636c7b314a696400d59f8cc7/content/posts/designing-a-metropolis-class.md?plain=1#L93)
(`$$S^{(3)} = 2\pi k\sqrt{\alpha}N_1^{TL} + N_3^{(3,1)} \left[-3k\text{arcsinh} \left(\frac{1}{\sqrt{3}\sqrt{4\alpha+1}} \righ...`),
[see](https://www.adamgetchell.org/posts/designing-a-metropolis-class/#:~:text=The%20CDT%20action%20is%20then%20based%20on%20the%20Regge%20action),
expand beyond the *Hugo* screen. Though they are visible.
Therefore, one needs **newlines** for block equations.

Hugo's Markdown processor converts `\\` to spaces.
This breaks $\LaTeX$ environments that rely on `\\` for line endings.

For example
```tex
$$ \begin{matrix} a & b \\ c & d \end{matrix} $$
```

Gets converted to:

$$ \begin{matrix} a & b \\ c & d \end{matrix} $$

The **correct** way is via *raw HTML*:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
<!-- Replace <,>,{ and } to avoid auto-render -->
{{< rawhtml >}}
<div class="html-content">
  <pre><code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;
  $$ \begin{matrix} a & b \\ c & d \end{matrix} $$
&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code></pre>
</div>
{{< /rawhtml >}}

Which displays as:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  $$ \begin{matrix} a & b \\ c & d \end{matrix} $$
</div>
{{< /rawhtml >}}

*Raw HTML* explanation and usage in my [post](/blogs/hugo_shortcodes/) concerning Hugo shortcodes,
specially its dedicated [paragraph](/blogs/hugo_shortcodes/#raw-html) about raw HTML.

Alternative use `\newline` instead of `\\`. E.g.
```tex
$$
\left(
\begin{matrix}
  a & b \newline
  c & d
\end{matrix}
\right)
$$
```

produces

$$
\left(
\begin{matrix}
  a & b \newline
  c & d
\end{matrix}
\right)
$$

### Error handling


Insert an invalid *alignment specification* to check its error.
Instead of `matrix` lets use `foo`

Original:
```tex
$$ \begin{matrix} a & b \\ c & d \end{matrix} $$
```

Error:
```tex
$$ \begin{foo} a & b \\ c & d \end{foo} $$
```

Gets converted to:

$$ \begin{foo} a & b \\ c & d \end{foo} $$


This message (`Unknown environment 'foo'`) is from MathJax.
Specific from `MathJax.config.tex.formatError`'s default value, as shown in its
[docs.mathjax.org](https://docs.mathjax.org/en/latest/options/input/tex.html) configuration:

```
MathJax = {
  tex: {
    formatError:   // function called when TeX syntax errors occur
       (jax, err) => jax.formatError(err),
  }
};
```

In the [MathJax Support](#mathjax-support) section we did not change the `formatError`.
So we benefit from previous default setting.


### LaTeX packages

[docs.mathjax.org](https://docs.mathjax.org/en/latest/options/input/tex.html) config includes

```
MathJax = {
  tex: {
    packages: ['base'],              // extensions to use
    ...
```

#### Include extra packages


In `layouts/partials/custom_head.html` we loaded a few extra packages

```
<script>
window.MathJax = {
  tex: {
    ...
    packages: {'[+]': ['ams', 'boldsymbol']}  // 'base' + extras
  },
  ...
  loader: {
    load: ['[tex]/ams', '[tex]/boldsymbol']
  },
  ...
};
</script>
```

Previous config lines use
[docs.mathjax.org - boldsymbol](https://docs.mathjax.org/en/latest/input/tex/extensions/boldsymbol.html)
config as reference:

```
window.MathJax = {
  loader: {load: ['[tex]/boldsymbol']},
  tex: {packages: {'[+]': ['boldsymbol']}}
};
```


#### Test a LaTeX package

Check in the browser's console if they are proper loaded with next, expected output: `Array [ "[tex]/ams", "[tex]/boldsymbol" ]`.

```javascript
MathJax.config.loader.load
```

Thus, ignore if the console shows a warning
like `No version information available for component [tex]/ams`
when loading.
This is might be a metadata notification.
Maybe this package doesn't have version metadata included in its build.


Now let's test if an [AMS](https://www.ams.org/arc/resources/amslatex-about.html) package,
like [amsmath](https://ctan.org/pkg/amsmath),
performs OK.

Code
```tex
\begin{equation}
\forall x \in \mathbb{R}, \quad \exists y > 0 \quad \text{such that} \quad x + y > 0
\end{equation}
```

Render

$$
\begin{equation}
\forall x \in \mathbb{R}, \quad \exists y > 0 \quad \text{such that} \quad x + y > 0
\end{equation}
$$

Test if [boldsymbol](https://docs.mathjax.org/en/latest/input/tex/extensions/boldsymbol.html), notice this is a *docs.mathjax.org* link, succeeds.

Code
```tex
\text{x normally: } x
\newline
\backslash\text{LaTeX normally: } \LaTeX
\newline
\text{x as arg of } \texttt{boldsymbol} \text{: } \boldsymbol{x}
\newline
\backslash\text{LaTeX as arg of } \texttt{boldsymbol} \text{: } \boldsymbol{\LaTeX}
```

Output

$$
\text{x normally: } x
\newline
\backslash\text{LaTeX normally: } \LaTeX
\newline
\text{x as arg of } \texttt{boldsymbol} \text{: } \boldsymbol{x}
\newline
\backslash\text{LaTeX as arg of } \texttt{boldsymbol} \text{: } \boldsymbol{\LaTeX}
$$

## TikZ

[$\text{Ti}\textit{k}\text{Z}$](https://www.ctan.org/pkg/pgf) is probably the most complex and powerful tool to create graphic elements in $\LaTeX$.

### Enable TikZ

Follow steps of [TikZJax](https://github.com/kisonecat/tikzjax):

1. Add to `layouts/partials/custom_head.html`:

```html
<!-- TikZJax -->
<!-- https://github.com/kisonecat/tikzjax -->
<link rel="stylesheet" type="text/css" href="http://tikzjax.com/v1/fonts.css">
<script src="https://tikzjax.com/v1/tikzjax.js"></script>
```

2. Try the [MWE](https://github.com/kisonecat/tikzjax#example)

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
<!-- Replace <,>,{ and } to avoid auto-render -->
{{< rawhtml >}}
<div class="html-content">
  <pre><code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;
&#60;div class="html-content"&#62;
  &#60;script type="text/tikz"&#62;
    \begin{tikzpicture}
      \draw (0,0) circle (1in);
    \end{tikzpicture}
  &#60;/script&#62;
&#60;/div&#62;
&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code></pre>
</div>
{{< /rawhtml >}}

Which draws next circle. So far so good.

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <script type="text/tikz">
    \begin{tikzpicture}
      \draw (0,0) circle (1in);
    \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

3. I prefer a centered circle, so let's add some more code to `layouts/partials/custom_head.html`, to its `<style>` tag:
```
/* TikZJax centering */
/* https://github.com/kisonecat/tikzjax/issues/12 */
.tikzjax {
  display: flex;
  justify-content: center; /* centers horizontally */
  align-items: center;     /* centers vertically if needed */
}
```

4. Now expand the classes in previous $\text{Ti}\textit{k}\text{Z}$ code,
actually in the pure raw HTML `<div>`,
to `<div class="html-content tikzjax">` and redraw it:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content tikzjax">
  <script type="text/tikz">
    \begin{tikzpicture}
      \draw (0,0) circle (1in);
    \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

**TL;DR**

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
<!-- Replace <,>,{ and } to avoid auto-render -->
{{< rawhtml >}}
<div class="html-content">
  <pre><code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;
&#60;div class="html-content tikzjax"&#62;
  &#60;script type="text/tikz"&#62;
    \begin{tikzpicture}
      \draw (0,0) circle (1in);
    \end{tikzpicture}
  &#60;/script&#62;
&#60;/div&#62;
&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code></pre>
</div>
{{< /rawhtml >}}

### TikZJax issues

The most evident **annoy**ance is the amount of **messages** in the **console**.
But this is not an error nor a limitation.
On the other hand, next are real problems.

To draw a 5 points star we can use

```tex
\begin{tikzpicture}
  \draw[thick, fill=yellow!50, draw=orange]
    (90:1in) -- (126:0.4in) -- (162:1in) -- (198:0.4in) 
    -- (234:1in) -- (270:0.4in) -- (306:1in) 
    -- (342:0.4in) -- (18:1in) -- (54:0.4in) -- cycle;
\end{tikzpicture}
```

Like this:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
<!-- Replace <,>,{ and } to avoid auto-render -->
{{< rawhtml >}}
<div class="html-content">
  <pre><code>&#123;&#123;&#60; rawhtml &#62;&#125;&#125;
&#60;div class="html-content tikzjax"&#62;
  &#60;script type="text/tikz"&#62;
    \begin{tikzpicture}
      \draw (0,0) circle (1in);
      \draw[thick, fill=yellow!50, draw=orange]
        (90:1in) -- (126:0.4in) -- (162:1in) -- (198:0.4in) 
        -- (234:1in) -- (270:0.4in) -- (306:1in) 
        -- (342:0.4in) -- (18:1in) -- (54:0.4in) -- cycle;
    \end{tikzpicture}
  &#60;/script&#62;
&#60;/div&#62;
&#123;&#123;&#60; /rawhtml &#62;&#125;&#125;</code></pre>
</div>
{{< /rawhtml >}}

Result:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content tikzjax">
  <script type="text/tikz">
    \begin{tikzpicture}
      \draw[thick, fill=yellow!50, draw=orange]
        (90:1in) -- (126:0.4in) -- (162:1in) -- (198:0.4in) 
        -- (234:1in) -- (270:0.4in) -- (306:1in) 
        -- (342:0.4in) -- (18:1in) -- (54:0.4in) -- cycle;
    \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

Though this does not take advantage of $\text{Ti}\textit{k}\text{Z}$'s [nodes](https://tikz.dev/tikz-shapes).
Following is clearer and more customizable:

```tex
\begin{tikzpicture}
  \draw[thick,fill=yellow!50, draw=orange]
    (0,0)
    node[
      star,
      star points=5,
      star point ratio=2.5,
      minimum size=2in,
      draw
    ] {};
\end{tikzpicture}
```

But it has some **disadvantages**. Notice that `fill=yellow!50` didn't work:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content tikzjax">
  <script type="text/tikz">
    \begin{tikzpicture}
      \draw[thick,fill=yellow!50, draw=orange]
        (0,0)
        node[
          star,
          star points=5,
          star point ratio=2.5,
          minimum size=2in,
          draw
        ] {};
    \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

The `node[star, ...]` construct relies on $\text{Ti}\textit{k}\text{Z}$'s nodes shapes defined in libraries like `shapes.geometric`.
TikZJax currently has limited support for some of these specialized nodes and their `fill`s may not be properly rendered in the generated SVG.

The right colored star produces

```html
<div class="html-content tikzjax">
  <div style="display: flex; width: 138.267pt; height: 131.538pt;">
    <div
      style="position: relative; width: 100%; height: 0.3999786376953124pt;"
      class="page"
    >
      <svg
        width="138.2669pt"
        height="131.5379pt"
        viewBox="-72 -72 138.2669 131.5379"
        style="position: absolute; top: 0pt; left: 0pt; overflow: visible;"
      >
        <g transform="translate(-3.1365509033203116,0.3999786376953124)">
          <g stroke-miterlimit="10" transform="scale(1,-1)">
            <g stroke="#000" fill="#000">
              <g stroke-width="0.4">
                <g stroke-width="0.8">
                  <g fill="#ffff80">
                    <g stroke="#ff8000">
                      <path d=" M 0.0 72.26999 L -16.99138 23.38681 L -68.73346 22.33293 L -27.49295 -8.93303 L -42.47913 -58.46793 L 0.0 -28.90755 L 42.47913 -58.46793 L 27.49295 -8.93303 L 68.73346 22.33293 L 16.99138 23.38681 Z  "></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</div>;
```

The other makes

```html
<div class="html-content tikzjax">
  <div style="display: flex; width: 138.267pt; height: 131.538pt;">
    <div
      style="position: relative; width: 100%; height: 0.3999786376953124pt;"
      class="page"
    >
      <svg
        width="138.2669pt"
        height="131.5379pt"
        viewBox="-72 -72 138.2669 131.5379"
        style="position: absolute; top: 0pt; left: 0pt; overflow: visible;"
      >
        <g transform="translate(-3.1365509033203116,0.3999786376953124)">
          <g stroke-miterlimit="10" transform="scale(1,-1)">
            <g stroke="#000" fill="#000">
              <g stroke-width="0.4">
                <g stroke-width="0.8">
                  <g fill="#ffff80">
                    <g stroke="#ff8000">
                      <path d=" M 0.0 0.0  "></path>
                      <path
                        d=" M 0.0 72.26999 L -16.99527 23.39217 L -68.73346 22.33293 L -27.49925 -8.93507 L -42.47913 -58.46793 L 0.0 -28.91417 L 42.47913 -58.46793 L 27.49925 -8.93507 L 68.73346 22.33293 L 16.99527 23.39217 Z  "
                        fill="none"
                      ></path>
                      <g
                        stroke="none"
                        transform="scale(-1.00375,1.00375)translate(0.19677734374999994,0.3999786376953124)scale(-1,-1)"
                      >
                        <g fill="#000">
                          <g stroke="none"> </g>{" "}
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</div>;
```

The differences can be checked with `vim -d a.html b.html` or online with [text-compare](https://text-compare.com/).
These are inside `<g stroke="#ff8000">`.

On the not fill-colored, those lines are next. 
Notes:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <ul>
  <li>Mismatches in <span style="color: red;">red</span> font color</li>
  <li><code>...</code> to hide non important parts</li>
  </ul>
</div>
{{< /rawhtml >}}


<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <div style="white-space: pre-wrap; color: red;">
  &#60;path d=" M 0.0 0.0  "&#62;&#60;/path&#62;
    <span style="color: grey;">&#60;path"</span>
      <span style="color: grey;">d=" M 0.0 72.26999 ... Z  "</span>
      fill="none"
    <span style="color: grey;">&#62;/path"</span>
    &#60;g
      stroke="none"
      transform="scale(...)translate(...)scale(-1,-1)"
    &#62;
      &#60;g fill="#000"&#62;
        &#60;g stroke="none"&#62; &#60;/g&#62;{" "}
      &#60;/g&#62;
    &#60;/g&#62; 
  </div>
</div>
{{< /rawhtml >}}

On the right colored star all previous HTML lines are just next `<path>`,
which is like the second one of previous code but without `fill="none"`.
I said *like* because some decimals of `d` might differ, but this doesn't matter.

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <div style="white-space: pre-wrap; color: grey;">
    &#60;path
      d=" M 0.0 72.26999 ... Z  "
    &#62;&#60;/path&#62;
  </div>
</div>
{{< /rawhtml >}}

Thus, inspecting this star in the browser we can force remove `fill="none"`,
now the star will be right colored (as long as we don't refresh the page obviously).
Let's apply this fix permanently and programmatically in next section.

#### Workaround

1. Add a new class to previous $\text{Ti}\textit{k}\text{Z}$-node star:
`<div class="html-content tikzjax tikzjax-node">` instead of `<div class="html-content tikzjax">`.

2. `$EDITOR assets/js/tikzjax-node.js` with content

```js
// Configuration
const TIKZJAX_FIX_CONFIG = {
  TIMEOUT_MS: 3000,  // 3 second timeout to ensure TikZJax is done
  CONTAINER_SELECTORS: ['.tikzjax-node'] // All possible container classes
  // CONTAINER_SELECTORS: ['.tikzjax', '.tikzjax-node'] // All possible container classes
};

// Main processing function
function processTikzNodes() {
  // Process all TikZ containers
  const containers = document.querySelectorAll(TIKZJAX_FIX_CONFIG.CONTAINER_SELECTORS.join(','));
  
  containers.forEach(container => {
    const svgs = container.querySelectorAll('svg');
    
    svgs.forEach(svg => {
      // Find all paths that have M and Z commands
      const paths = Array.from(svg.querySelectorAll('path')).filter(path => {
        const d = path.getAttribute('d') || '';
        return d.includes('M') && d.includes('Z');
      });
      
      // Process each star path
      paths.forEach(path => {
        // Remove fill="none" if present
        if (path.getAttribute('fill') === 'none') {
          path.removeAttribute('fill');
        }
        
        // Also check parent groups
        let current = path.parentElement;
        while (current && current !== svg) {
          if (current.getAttribute('fill') === 'none') {
            current.removeAttribute('fill');
          }
          current = current.parentElement;
        }
      });
    });
  });
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Wait for TikZJax to finish rendering
  setTimeout(processTikzNodes, TIKZJAX_FIX_CONFIG.TIMEOUT_MS);
});
```

Actually I set a intial delay bigger than 3 secs, and with retries.
Check the [script](https://github.com/juanMarinero/juanmarinero.github.io/blob/main/assets/js/tikzjax-node.js).

3. `$EDITOR layouts/partials/custom_head.html` and append

```
<!-- TikZJax-node -->
{{ $js := resources.Get "js/tikzjax-node.js" | minify | fingerprint }}
<script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}" defer></script>
```

Result:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content tikzjax tikzjax-node">
  <script type="text/tikz">
    \begin{tikzpicture}
      \draw[thick,fill=yellow!50, draw=orange]
        (0,0)
        node[
          star,
          star points=5,
          star point ratio=2.5,
          minimum size=2in,
          draw
        ] {};
    \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

The star is now **right colored**!
If not, then the drawing took too long to be rendered, thus `assets/js/tikzjax-node.js` found nothing to fix.
Just refresh the page without clearing the cache memory (`F5`).
Remember this is a *workaround*, not an official patch.

We can even draw multiple $\text{Ti}\textit{k}\text{Z}$ nodes in the same `<div>`:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content tikzjax tikzjax-node">
  <script type="text/tikz">
    \begin{tikzpicture}
      % Figures in cornels of a pentagon
      % Position must be:
      % - (xi,yi)=(rcos(90+72*i),rsin(90+72*i))  for i=0,1,2,3,4 starting from the top vertex (90 grades)
      \draw[thick,fill=yellow!50, draw=orange]
        (0,3) node[
          star,
          star points=5,
          star point ratio=0.5,
          minimum size=0.3in,
          draw
        ] {};
      \draw[thick, fill=green!50, draw=green]
        (-2.85,0.93) node[rectangle, minimum size=0.5in, draw] {};
      \draw[thick, fill=blue!50, draw=blue]
        (-1.76,-2.43) node[circle, minimum size=0.5in, draw] {};
      \draw[thick, fill=gray!50, draw=gray]
        (1.76,-2.43) node[diamond, minimum size=0.5in, draw] {};
      \draw[thick, fill=pink!50, draw=red]
        (2.85,0.93) node[regular polygon, regular polygon sides=6, minimum size=0.5in, draw] {};
    \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content tikzjax tikzjax-node">
  <script type="text/tikz">
    \begin{tikzpicture}
      % This does nothing visible but reserves vertical space
      \draw[opacity=0] (0,0) -- (0,0.5in);
    \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

#### Unleash your creativity

Last but not list **explore** the many drawing capabilities that $\text{Ti}\textit{k}\text{Z}$ offers.

**Combine** normal text (with emojis), HTML-tags, $\LaTeX$ and $\text{Ti}\textit{k}\text{Z}$:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content tikzjax tikzjax-node">
  <span style="color: yellow; font-weight: bold; -webkit-text-stroke: 1px orange;">
    5 points star
  </span>
  ⭐ with $\,Ti\textit{k}Z \quad\Rightarrow\qquad$ 
  <script type="text/tikz">
    \begin{tikzpicture}
      \draw[thick,fill=yellow!50, draw=orange]
        (0,0)
        node[
          star,
          star points=5,
          star point ratio=2.5,
          minimum size=2in,
          draw
        ] {};
    \end{tikzpicture}
  </script>
</div>
{{< /rawhtml >}}

**Various** drawings and shapes:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content tikzjax">
  <script type="text/tikz">
    \begin{tikzpicture}
      % Draw two intersecting lines
      \draw[gray, thick] (-1,2) -- (2,-4);
      \draw[gray, thick] (-1,-1) -- (2,2);

      % Draw and fill a black circle at the intersection point
      \filldraw[black] (0,0) circle (2pt) node[anchor=west] {Some \LaTeX\, text};

      % Define nodes with styles
      \node[circle, draw=green!60, fill=green!5, very thick, minimum size=7mm] (A) at (5,0) {A};
      \node[rectangle, draw=red!60, fill=red!5, very thick, minimum size=5mm, right=2cm of A] (B) {B};

      % Draw arrow between nodes
      \draw[->] (A) -- (B);
    \end{tikzpicture}

    \begin{tikzcd}
      % Commutative diagram from https://tikzjax.com/
      A \arrow[r, "\phi"] \arrow[d, red]
        & B \arrow[d, "\psi" red] \\
      C \arrow[r, red, "\eta" blue]
        & |[blue, rotate=-15]| D
    \end{tikzcd}
  </script>
</div>
{{< /rawhtml >}}

Do you need **inspiration**? Check out some [$\text{Ti}\textit{k}\text{Z}$ galleries](https://github.com/xiaohanyu/awesome-tikz#gallery)!


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
