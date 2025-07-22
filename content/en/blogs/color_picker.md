---
title: "JM - 🎨🧪 Color Picker and Pastel"
---

Enhance your color picker to:
- Convert to multiple **color formats** (hex, rgb(a), hsl(a))
- Display the terminal **color preview**
- Get a list of **standard color names** (e.g. *Cornflower Blue*, *Crimson*) that are visually close

For all these we just need next **two tools** and a little of shell **script**ing.

#### Zenity

[Zenity](https://gitlab.gnome.org/GNOME/zenity) enables you to create the following types of simple dialog: calendar, notification icon, color selection,...
- [Quickstart](https://help.gnome.org/users/zenity/stable/index.html.en)
- [Showcasting](https://devopslite.com/series/gui-for-bash-script-using-zenity/), specially the [color picker](https://devopslite.com/zenity-create-a-color-selection-dialog/)

*Zenity* is usually **pre-installed** in standard **Ubuntu** installations (especially those with GNOME desktop).
If missing run
`sudo apt install zenity`


#### Pastel

[Pastel](https://github.com/sharkdp/pastel) is a command-line tool to generate, analyze, convert and manipulate colors.

To install *Pastel* just update [Rust](https://www.rust-lang.org) (`rustup update stable`) and run `cargo install pastel`.
For details read the [docs](https://github.com/sharkdp/pastel#via-cargo-source).


## Color picker enhancement

Steps:

- Paste the code below in `~/.bashrc` and run in terminal `color_picker`
- *Zenit color selection* GUI will open
- Pick a color and click "Select"
- The therminal will show awesome!

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <table class="data-table">
    <tr>
      <td class="data-cell image-cell">
        <img src="/images/blogs/color_picker/Zenit_color_selection.png" alt="Zenit_color_selection.PNG" class="table-image">
      </td>
      <td class="data-cell">
        <img src="/images/blogs/color_picker/color_picker__output.png" alt="color_picker__output.PNG" class="table-image" style="width:100%;" >
      </td>
    </tr>
  </table>
</div>
{{< /rawhtml >}}

```sh
color_check_valid_format() {
  # Example usage: color_check_valid_format "#FF0000"
  
  # Check if any argument was supplied
  local color="$1"
  if [ -z "$color" ]; then
    echo "No argument supplied"
    return 1
  fi

  # Check if it's a valid color code
  if pastel color "$color" >/dev/null 2>&1; then
    return 0
  else
    echo "This is NOT a valid color format: $color"
    return 1
  fi
}
color_picker() {
  # Open zenity color picker, then pick a color and click "Select"
  color=$(zenity --color-selection --title="Pick a Color" --color="green" 2>/dev/null)

  # Check if user clicked "Cancel"
  if [[ -z "$color" ]]; then
      echo "No color selected."
      return 1
  fi

  # Check if a valid color is provided
  if ! color_check_valid_format "$color"; then
    return 1
  fi

  # Convert HEX to RGB, etc.
  pastel color "$color"
}
```

### Bonus

Check the color format. Screenshot:

<!-- Read layouts/shortcodes/rawhtml.html to insert raw HTML -->
{{< rawhtml >}}
<div class="html-content">
  <img
    src="/images/blogs/color_picker/color_check_format__outputs.png"
    alt="ExerciseValidationWorkflow"
    style="width:90%;"
    alt="color_check_format__outputs.png"
    >
</div>
{{< /rawhtml >}}

Did you notice that the **hex** color is previewed in the terminal? Just use a Syntax Highlighting tool, for example:
- [z-shell/F-Sy-H](https://github.com/z-shell/F-Sy-H)
- [zdharma-continuum/fast-syntax-highlighting](https://github.com/zdharma-continuum/fast-syntax-highlighting)

Code:

```sh
color_check_format() {
  # Example usage: 
  #   color_check_format "rgba(207, 196, 26, 0.737)"
  #   color_check_format "rgb(207, 196, 26)"
  #   color_check_format "hsla(56, 77.7%, 45.7%, 0.737)"
  #   color_check_format "hsl(56, 77.7%, 45.7%)"
  #   color_check_format "#FF0000"
  #   color_check_format "red"
  #   color_check_format "Invalid-format"
  
  # Check if a valid color format is provided
  local color="$1"
  if ! color_check_valid_format "$color"; then
    return 1
  fi

  # Check the format
  if [[ "$color" =~ ^rgba ]]; then echo "RGBA format"
  elif [[ "$color" =~ ^rgb ]]; then echo "RGB format"
  elif [[ "$color" =~ ^hsla ]]; then echo "HSLA format"
  elif [[ "$color" =~ ^hsl ]]; then echo "HSL format"
  elif [[ "$color" =~ ^# ]]; then echo "HEX format"
  else echo "Other [valid] format"
  fi
}
```


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
