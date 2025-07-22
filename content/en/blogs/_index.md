---
# The file content/en/blogs/_index.md is generated so once opened any content/en/blogs/whatever.md (e.g. http://localhost:1313/blogs/create_hugo_website/)
# this website has HTML-header links pointing to mainpage (http://localhost:1313/)
# instead to pointing to blogs/ (http://localhost:1313/blogs), which shows 404 error if content/en/blogs/index.md does not exist,
# but if content/en/index.md exists then this file inhibits Hugo to build rest of makrdowns under content/en/blogs (e.g. http://localhost:1313/blogs/create_hugo_website/ would not be built). 
# This is a Teufelkreis!!
#
# Pointing to blogs would be OK if content/en/blogs/index.md existed (notice "_" prefix),
# but creating that file inhibits Hugo to build rest of makrdowns under content/en/blogs, try: 
#  cd <repo-path>
#  rm -rf public/blogs # remove so just what is built is OK
#  hugo server --disableFastRender # wait and Ctrl+C
#  hugo list all # check missing markdowns in content/en/blogs/
#
# Sidenote
#   With content/en/blogs/index.md the file content/en/homepage/blogs.md must have in header (and content/en/blogs_index.md must exist):
#     detailed_page_path: /blogs_index
#   Without (and content/en/index.md must exist, but as said this file inhibits Hugo to build rest of makrdowns under content/en/blogs):
#     detailed_page_path: /blogs/
#
# Workaround:
#   The file content/en/homepage/blogs.md must have in header
#     detailed_page_path: /blogs_blogs_index
#   Next file must YES exist: content/en/blogs/_index.md
#   Next file must NOT exist: content/en/blogs/index.md
#   Post files, like content/en/blogs/create_hugo_website.md, must raw-HTML at end of file pointing to blogs_index/ (http://localhost:1313/blogs_index)
#     <!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
#     {{< rawhtml >}}
#     <div class="html-content">
#       <br>
#       <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
#       <br>
#       <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
#       <br>
#     </div>
#     {{< /rawhtml >}}
---
