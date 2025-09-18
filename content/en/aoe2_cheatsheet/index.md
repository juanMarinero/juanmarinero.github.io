---
title: 'Aoe2_cheatsheet'
type: "minimal"
---

Explanations in the post [**Hugo**'s **shortcodes**: CSV to table](/blogs/hugo_shortcode_CSV_to_table/).

## TLDR


| Eco                                        |          | Hotkey    |
| ---                                        | ---      | ---:      |
| **Cycle** through idle **Villagers**       | 💤🧑‍🌾🔄   | .         |
| Select **all**    ""                       | 💤🧑‍🌾💯   | Shift + . |
|                                            |          |           |
| Select **all** idle Trade **Carts**        | 💤💰🐎💯 | Alt + .   |
| Press again for idle Trade **Cogs**        | 💤💰🛥️💯 |           |
|                                            |          |           |
| **Military**                               |          |           |
| **Cycle** through idle **milit**ary units  | 💤🪖🔄   | ,         |
| Select **all**    ""                       | 💤🪖💯   | Shift + , |
| Press again for idle **warships**          | 💤🚢💯   |           |
|                                            |          |           |
| Select **all** military units **onscreen** | ⌞⌝🪖💯   | Alt + ,   |
| Press again for visible **warships**       | ⌞⌝🚢💯   |           |
{style="display: block"}


{{< csv-to-table-imgs
  path="data/aoe2api-aoe2techtree/06_filter/structures.csv"
  img_path="/images/aoe2techtree/img/Buildings"
  img_field="id"
  img_field_raw="false"
>}}

[![QWERTY hotkeys economic buildings](https://forums.ageofempires.com/uploads/default/original/3X/c/d/cdd44f9552594ae70fd45e2a982aafcaf6bd7706.jpeg)](https://forums.ageofempires.com/t/few-things-i-want-to-see-in-aoe2/136931)

[Fast Castle Boom](https://www.reddit.com/r/aoe2/comments/el8hvj/visual_build_order_cheatsheet_fast_castle_boom/)



## Test the `minimal` layout


| Name   | Age   | Score | Country | City   | Nationality | University          | Experience (years) |
| ---    | :---: | ---:  | ---     | ---    | ---         | ---                 | ---                |
| Maria  | 30    | 95    | Spain   | Madrid | Spanish     | UNED                | 3                  |
| Daniel | 25    | 87    | Germany | Berlin | German      | Hochschule Muenchen | 2.5                |

## The `getresource` shortcode

{{< getresource-test-01 path="data/sample/iris.csv" >}}

## The `getresource` shortcode ERROR

{{< getresource-test-01 path="test-missing-file.csv" >}}

## The `csv-to-table` shortcode

{{< csv-to-table path="data/sample/iris.csv" >}}

## The `csv-to-table-imgs` shortcode

Show both the rendered img and its field value.

{{< csv-to-table-imgs
  path="data/aoe2techtree/02_add_languages_names/structures.csv"
  img_path="/images/aoe2techtree/img/Buildings"
  img_field="id"
>}}

The rendered img only. I.e. field `id` is not displayed.
Note: some images not rendered because they lack in the [`aoe2techtree/img/Units`](https://github.com/SiegeEngineers/aoe2techtree/tree/master/img/Units) folder of the repo.

{{< csv-to-table-imgs
  path="data/aoe2techtree/02_add_languages_names/units.csv"
  img_path="/images/aoe2techtree/img/Units"
  img_field="id"
  img_field_raw="false"
>}}

## `csv-to-table` for fuzzy merged CSVs

{{< csv-to-table path="data/aoe2api-aoe2techtree/01_fuzzymerge/structures.csv" >}}

{{< csv-to-table path="data/aoe2api-aoe2techtree/01_fuzzymerge/units.csv" >}}

## Adding the icon

{{< csv-to-table-imgs
  path="data/aoe2api-aoe2techtree/02_icon_merge/unique_icon/structures.csv"
  img_path="/images/aoe2techtree/img/Buildings"
  img_field="id"
>}}

{{< csv-to-table-imgs
  path="data/aoe2api-aoe2techtree/02_icon_merge/unique_icon/units.csv"
  img_path="/images/aoe2techtree/img/Units"
  img_field="id"
>}}

## With shortcut

{{< csv-to-table-imgs
  path="data/aoe2api-aoe2techtree/04_shortcuts_merge/structures.csv"
  img_path="/images/aoe2techtree/img/Buildings"
  img_field="id"
>}}

## With aoe2api fields

{{< csv-to-table-imgs
  path="data/aoe2api-aoe2techtree/05_add_aoe2api_fields/structures.csv"
  img_path="/images/aoe2techtree/img/Buildings"
  img_field="id"
>}}
