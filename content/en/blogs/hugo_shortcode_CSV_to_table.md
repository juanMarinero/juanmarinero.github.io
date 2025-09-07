---
title: "Hugo's generic shortcode to convert CSV to table"
description: "TODO"
keywords: ["TODO"]
draft: true
---


#### Not an API anymore

In the [age-of-empires-II-api](https://github.com/aalises/age-of-empires-II-api) repo we have
the structure file [`structures.csv`](https://github.com/aalises/age-of-empires-II-api/blob/master/data/structures.csv). The first four lines are:
```csv
name, expansion, age, cost, build_time, hit_points, line_of_sight, armor, range, reload_time, attack, special
Barracks, Age of Kings, Dark, {"Wood": 175}, 50, 1200,5,0/7,,,,Garrison: 10 created units
Dock, Age of Kings, Dark, {"Wood": 150}, 35, 1800,5,0/7,,,,Garrison: 10 created units
Farm, Age of Kings, Dark, {"Wood": 60},15, 480,0, 0/0,,,,Standard = 175 Food;Horse Collar = 250 Food;Heavy Plow = 375 Food;Crop Rotation = 550 Food
```

Great! We don't have to manually populate it. It's already done.

We would like to create API calls to get the data from the [age-of-empires-II-api](https://github.com/aalises/age-of-empires-II-api) API.

But, as specified in its [disclaimer](https://github.com/aalises/age-of-empires-II-api#disclaimer), the API is down.

This is inconvenient, but not a tragedy, we just need to get the
[`age-of-empires-II-api/data/`](https://github.com/aalises/age-of-empires-II-api/tree/master/data)
folder.

{{< rawhtml >}}
<!--
   - It's a LOCAL API, not a public one.
   - Thus, links like next explain an API URL that returns 404:
   - - Basic usage: https://publicapis.io/age-of-empires-ii-api
   - - Postman: https://documenter.getpostman.com/view/78530/RztoM8AL
   - - API tutorial https://www.genspark.ai/spark/age-of-empires-2-api-options/5cde7e12-e164-4ab0-9ed0-6790d30b2686
   -->
{{< /rawhtml >}}


#### Git submodule and sparse checkout

##### Directory in the Hugo project

The documentation define the [Data sources](https://gohugo.io/content-management/data-sources/) as:
> A data source might be a file in the `data` directory, a global resource, a page resource, or a remote resource.

From the ebook [Hugo in Action](https://hugo-in-action.foofun.cn/),
[Structure of the Hugo source folder](https://hugo-in-action.foofun.cn/docs/part1/chapter2/1/#213-structure-of-the-hugo-source-folder), the *data/* folder purpose:
> data—Stores structured content in the form of YAML, TOML, CSV, or JSON files, which are made available as global variables throughout the website. A traditional database houses more than just web page content. There can be tables associated with structured data, which have no place in the content folder, so this folder comes in handy when we generate content from outside of Hugo and pass that information in as a JSON or a CSV file for Hugo to consume. We will read from the data folder in chapter 5.

And the *api* directory:
> `api` folder—Although not standard, we’ll create this folder to house custom APIs in chapter 11.

From the ebook [Hugo in Action](https://hugo-in-action.foofun.cn/),
[Better together with page bundles](https://hugo-in-action.foofun.cn/docs/part1/chapter4/3/#431-leaf-bundles):
> The About page in the Acme Corporation website is the perfect page to turn into a **leaf bundle**.
> The draw.jpg image is **used in the page, not anywhere else**, and we should **localize it to that page**.

So, where to locate the CSV files?
- These local CSV files are, as said, local, they are not obtained via an API call using a Javascript file.
Thus we discard the `api/` folder to locate them.
- If they are meant to be used in the AOE2 cheatsheet page and nowhere else, 
then these structured content files location shuld be in the leaf bundle folder `content/en/aoe2_custom_cheatsheet/`.
- But I think that this data will be handy for future posts, I need them to be availables as global variable in `data/`.


##### Add the git submodule and create the sparse checkout

Since our Hugo project is a git repository, we can use the `git submodule` command to **add the submodule directory `data/age-of-empires-II-api/`** to our main project repository.

But we don't need the whole [age-of-empires-II-api](https://github.com/aalises/age-of-empires-II-api) repository.

When working with large repositories, one might only need specific directories.
[Git's sparse checkout](https://git-scm.com/docs/git-sparse-checkout) command can
> change the working tree from having all tracked files present to only having a subset of those files.

We can use this feature to **keep only the [age-of-empires-II-api/data/](https://github.com/aalises/age-of-empires-II-api/tree/master/data) dir**ectory
and not the whole [age-of-empires-II-api](https://github.com/aalises/age-of-empires-II-api) repository.

So, lets dive in!

First. Navigate to the main project root.

```sh
cd <project_root> # edit!
```

In following commands do not confuse:
- The `data/` in our local Hugo project.
- The `data/` in the repo [age-of-empires-II-api](https://github.com/aalises/age-of-empires-II-api/blob/master/data/)
that we aim to clone into `data/age-of-empires-II-api/data` of our Hugo project.

Add the git submodule, create the sparse checkout regexp and enable sparse checkout.

```sh
# Add the whole repository as a git submodule into our data/ folder
git submodule add https://github.com/aalises/age-of-empires-II-api/ data/age-of-empires-II-api

# Create the info directory and sparse-checkout file for the submodule
mkdir -p .git/modules/data/age-of-empires-II-api/info

# Sparse-checkout regexp filters the tracked submodule content
# In this case limiting the track to the age-of-empires-II-api/data/ directory only
echo "data/*" > .git/modules/data/age-of-empires-II-api/info/sparse-checkout

# Enable sparse checkout for the submodule
git -C .git/modules/data/age-of-empires-II-api/ config core.sparseCheckout true
```

Now force the submodule to reset with the **new sparse checkout rules**.

- Option A. Either from the submodule directory

```sh
# First, navigate into the submodule directory
cd data/age-of-empires-II-api

# Reset the working tree to apply sparse checkout
git read-tree -mu HEAD
```

- Option B. Or from the main project directory
```sh
git submodule update --force --checkout data/age-of-empires-II-api
```

Let's inspect the results.
Change directory to the submodule (`cd data/age-of-empires-II-api`) and run `git status`.
It echoes:

```
On branch master
Your branch is up to date with 'origin/master'.

You are in a sparse checkout with 12% of tracked files present.

nothing to commit, working tree clean
```

`ls -la` list only the `data/` directory and the `.git` file.
Which confirms that
what the '12% of tracked files present' message stated,
that *git sparse checkout* is working -- Git is only tracking and showing the files in the `data` directory,
ignoring the other 88% of files in the API repository.

Our tree structure is:

```text
our-hugo-project/
├── assets/
├── content/
├── data/
│   └── age-of-empires-II-api/  # The submodule
│       ├── .git
│       └── data/  # The sparse-checked-out directory
│           ├── civilizations.csv
│           ├── structures.csv
│           ├── technologies.csv
│           └── units.csv
└── [...]
```


##### Update the spared git submodule

In future, we will only update the sparse-checkout files (`data/*`).

One can achieve this:
- From the main project directory (A options)
- Or from the submodule directory (B options)

Via:
- Merge (A.a and B.a)
- Rebase (A.b and B.b)
- Or hard reset (B.c)

**A** options first step
```sh
cd <project_root> # edit!
```

**A.a** final step
```sh
git submodule update --remote --merge data/age-of-empires-II-api
```

**A.b** final step
```sh
git submodule update --remote --rebase data/age-of-empires-II-api
```

**B** options first steps
```sh
cd <project_root> # edit!
cd data/age-of-empires-II-api
git fetch origin
```

For the **B** options final steps we need to specify the `origin` branch we want to merge/rebase/reset-to.
Here it's `origin/master`. Not `origin/main`.

**B.a** final step
```sh
git merge origin/master
```

**B.b** final step
```sh
git rebase origin/master
```

**B.c** final step
```sh
# ⚠️ Warning: This will discard any local changes you've made in the submodule.
git reset --hard origin/master
```

Finally, no matter which option we applied, let's find out if the submodule is up to date.

```sh
cd <project_root> # edit!
cd data/age-of-empires-II-api
git status
```



##### Create the shortcode

Create a shortcode that accepts the JSON file as parameter.

In the ebook [Hugo in Action](https://hugo-in-action.foofun.cn/),
[Parsing files for data](https://hugo-in-action.foofun.cn/docs/part1/chapter5/3/#532-parsing-files-for-data):
> We need to render this [`products.csv`] as a table in the **home page** of the website.
> We can place products.csv in the root of the `content` folder to make it a part of the *branch bundle* for the index page.

So, they expand `layouts/[_default]/index.html` to loop over the `products.csv` file and render the table.





{{< rawhtml >}}
<div class="html-content">
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
</div>
{{< /rawhtml >}}
