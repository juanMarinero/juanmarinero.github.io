---
title: "JM - Blogs"
aliases:
- blogs

# I want this to be a dedicated website, e.g. like https://zjedi.github.io/hugo-scroll/services/ which renders content/en/services.md
# And not a section of the main-website, e.g. like https://zjedi.github.io/hugo-scroll/#contact  which renders content/en/homepage/contact.md
# To achiveve this:
#   We can do like services.md does (https://github.com/zjedi/hugo-scroll/blob/master/exampleSite/content/en/services.md?plain=1)
#   I.e. being located under content/en/ instead of under content/en/homepage/
#   And like contact.md have no 'type' set in 'front matter'.
#   Or we can explicity state it (read https://gohugo.io/quick-reference/glossary/#content-type):
type: "section"
# I also want that this dedicated website to be reached from the main-website header menu (like Services, About Me, Contact,... in https://zjedi.github.io/hugo-scroll/). So:
# content/en/homepage/blogs.md must be created with [mainly] next 'front matter':
#   header_menu_title: "Blogs"       # for the header menu
#   header_menu: true                # ""
#   detailed_page_path: /blogs_index      # To point to this file
#   detailed_page_homepage_content: false # "", i.e. no main-website content, details below
# In blogs.md, if the parameter `detailed_page_homepage_content` is set to
#  - `false`, then we achieve what we aim:
#    - The [non 'front matter'] content of blogs.md will not be rendered into a [sub]section of the main-website (like contact.md does). 
#    - The main-website header menu will point where `detailed_page_path` points to.
#    - The navigation menu entry of "Blogs" will not be shown, not even if `navigation_menu_title` would be explicit in the 'front matter'.
#      This is the desired result, since Blogs is a dedicated website and not a section of the main-website to be easy reacheable from nav menus. 
#  - If it's set to `true` or is missing at all, then we achieve the oppositive results from the just explained `false` case. I.e. like in contact.md.
#    - Note. The main-website header menu would NOT point where `detailed_page_path` points to. But to the #blogs section of the main-website.
---


{{< rawhtml >}}
  <br>
  <br>
{{< /rawhtml >}}

### Hugo

{{< rawhtml >}}
<div class="blogs_index">
  <a href="/blogs/create_hugo_website/" class="no-underline-except-hover">
  How to <strong>create</strong> a <strong>Hugo-scroll web</strong>site
  </a>

  <a href="/blogs/hugo_shortcodes/" class="no-underline-except-hover">
  <strong>Hugo</strong>'s <strong>shortcodes</strong>: step by step
  </a>

  <a href="/blogs/hugo_render_hooks/" class="no-underline-except-hover">
  <strong>Hugo</strong>'s <strong>render hooks</strong>: a quick guide
  </a>

  <a href="/blogs/hugo_page_bundles/" class="no-underline-except-hover">
  <strong>Hugo</strong>'s <strong>page bundles</strong>: the basics
  </a>

  <a href="/blogs/nerd_fonts_and_more/" class="no-underline-except-hover">
  Installing 
  <span style="font-family: 'Great Vibes', cursive; font-size: 3.1rem;">custom fonts</span>:
  <strong>system</strong>-wide setup <strong>& Hugo</strong> integration
  </a>
</div>
{{< /rawhtml >}}


### </> Web dev

{{< rawhtml >}}
<div class="blogs_index">
  <a href="/blogs/color_picker/" class="no-underline-except-hover">
  🎨 <strong>Color picker</strong> enhanced
  </a>

  <a href="/blogs/latex_for_webdev/" class="no-underline-except-hover">
  $\LaTeX$ and $\text{Ti}\textit{k}\text{Z}$ for <strong>web dev</strong>
  </a>
</div>
{{< /rawhtml >}}


<!--
   - ### 🐧GNU - Linux
   - 
   - {{< rawhtml >}}
   - <div class="blogs_index">
   -   <a href="/blogs/watcher_tree_files/" class="no-underline-except-hover">
   -   A simple watcher for <strong>tree files</strong>
   -   </a>
   - </div>
   - {{< /rawhtml >}}
   -->


### 📚 Books

{{< rawhtml >}}
<div class="blogs_index">
  <a href="/blogs/tolkien/" class="no-underline-except-hover">
  <span style="font-family: 'MiddleEarth JoannaVu', cursive; font-size: 2.3rem;">Tolkien</span>:
  books, podcasts and much more!
  </a>
</div>
{{< /rawhtml >}}

### 🖼️ Image editing

{{< rawhtml >}}
<div class="blogs_index">
  <a href="/blogs/instagram_mosaic/" class="no-underline-except-hover">
  Create an <strong>Instagram mosaic</strong> on the terminal
  </a>
  <br>
</div>
{{< /rawhtml >}}
