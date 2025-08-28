---
# The file content/en/homepage/blogs.md must have in header
#   detailed_page_path: /blogs/blogs_index # <--                                                                   http://localhost:1313/blogs_index
# Or, if the index.md would hold the index, then
#   detailed_page_path: /blogs/            # <--                                                                   http://localhost:1313/blogs
# This is explained in 
#
# Next file must YES exist: content/en/blogs/_index.md # <-- Bundle page to create more posts like                 http://localhost:1313/blogs/create_hugo_website
# Next file can exist, but : content/en/blogs/index.md # <-- Would point to                                        http://localhost:1313/blogs
#
# Post files, like content/en/blogs/create_hugo_website.md, must raw-HTML at end of file pointing to blogs_index/ (http://localhost:1313/blogs_index)
#   {{< rawhtml >}}
#     <br>
#     <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
#     <br>
#     <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
#     <br>
#   {{< /rawhtml >}}
---
