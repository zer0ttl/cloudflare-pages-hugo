# Hugo Notes

## Pages

- A list page has an array of all its children pages with the variables `.Pages`.

## Layouts

- Content pages use layout `single.html`. Only exception for this is `_index.md`. Those files are like a table of content for what's in the folder and use `list.html` by default.

## Templates

- Templates contain blocks. E.g. `baseof.html` can contain the following *block*.

```html
<body>
    {{ block "main" . }}
    {{ end }}
</body>
```

This block can then be filled up by any of the templates like `list.html` and `single.html`.

```html
{{ define "main" }}
    {{ .Content }}
{{ end }}
```

- The `assets/` directory cotnains assets that need some form of processing. That is why the `mria` theme has all the `scss` files in there for processing.
- If you plan on using a plain `css` file, that would go into the `static` directory. So css taken off internet would typically go in `static/` directory if you do not port it to `scss`.

## Partials

- Partials are declared in `layouts/partials` directory.
- They can be referenced in any of the templates using the `partial` directive. E.g. There is a nav bar in `layouts/partials/nav.html` file. You can reference it in `baseof.html` as follows.

```html
{{ partial "nav.html" }}
```

- `.` means the current page in Hugo. You need to keep track of when the current page needs to be passed to a partial.
- If the partial is dependent on the front matter of the current page, then you should pass the current page to the partial.

E.g. The partial `meta.html` uses the `title` in the front matter of the current page to set the title of the webpage.

```html
<head>
    <meta charset="utf-8">
    <title>{{ .Page.Title }}</title>
    {{ $style := resources.Get "sass/main.scss" | resources.ToCSS | resources.Minify }}
    <link rel="stylesheet" href="{{ $style.Permalink }}">
</head>
```

Hence, the partial would require the current page to be passed to it.

```html
{{ partial "meta.html" . }}
```

Another example would be a `footer` partial calling the `name` parameter configured in `config.toml`

```html
{{ with .Params.hide_footer }}
<!-- No footer here! -->
{{ else }}
    <footer>
        Website made by {{ .Site.Params.name }} in {{ now.Year }}
    </footer>
{{ end }}
```

When the `footer` partial is called, we would need to pass the context to the partial, as it would need access to `.Site`

```html
{{ partial "footer.html" . }}
```

- If the partial is not dependent on the front matter of the current page, then you can choose to not pass the current page to the partial.

E.g. The partial `nav.html` does not depend on any of the front matter of the page or any of the site global configurations.

```html
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About</a></li>
    </ul>
</nav>
```

Hence, you can call the partial without passing the current page to it.

```html
{{ partial "nav.html" }}
```

## Templating

- Hugo uses Go templating language in layouts.
- You can output a string.

```html
<p> {{ "Hello!" }}, world!</p>
```

- Variables in the front matter of the currnet page can be referenced via `.Params`

```html
<title>{{ .Params.title }}</title>
```

- Parameters from global Hugo configuration can be accessed via `.Site`

```html
<title>{{ .Params.title }} | {{ .Site.title }}</title>
```

[Cloudcannon Hugo Templating Language](https://cloudcannon.com/tutorials/hugo-beginner-tutorial/hugo-templating-basics/)

[Hugo Tempalating Docs](https://gohugo.io/templates/introduction/)

- Conditions
- Looping
- Set and output a variable
- Nested Key values

- If you like to trip the whitespace in the HTML output, use `{{- -}}`.

```html
<div>
    {{- .Title -}}
</div>
```

The above code will output the following.

```html
<div>Hello, World!</div>
```

You should always trim your whitespace.

- `.Permalink` can be called on any page to get its end URL.

## Shortcodes

- Content is written in markdown. Sometimes a content author needs some custom code, like video `<iframes>`,  to be embedded in markdown. This is against the simplicity of markdown's syntax.

- Shortcodes can cirumvent these limitations.

- A shortcode is a snippet inside a content file that Hugo wil render using a predefined tempalte.

> Remember that shortcodes will **NOT** work in template files.

Feature  | Application | Usage
-- | -- | --
Partials | Templates | Used to break down templates in to manageable and repeatable blocks of code.
Shortcodes | Content Files | Used to insert custom html snippets in markdown.

- In your content files, shortcode can be called using `{{% shortcodename parameters %}}`.

- Shortcode parameters are separate using spaces. If your parameter has a space, you can put that in quotes.

- You can also used named parameters with the format`name="value"`

- If you need to use raw HTML in your shortcodes, use `{{< >}}` to call your shortcodes.

```markdown
{{< myshortcode >}}<p>Hello <strong>World!</strong></p>{{< /myshortcode >}}
```

- All examples in gohugo.io website, use the raw content shortcode format `{{< >}}`

- Shortcodes live at `layouts/shortcodes` directory. You can further organize your shortcodes in subfolders, e.g. a shortcode in `layouts/shortcodes/boxes.html` can be called using `{{< boxes/square>}}` in the content file.

- All shortcode parameters are accessible via `.Get`.

- Access the parameter by name.

```markdown
{{< .Get "class" >}}
```

- Access the parameter by position. All parameters are zero-indexed. E.g. get first parameter.

```markdown
{{< .Get 0 >}}
```
- Get second parameter.

```markdown
{{< .Get 1 >}}
```

- `.Params` is the list of parameters passed to the shortcode.
- `$.Page.Params` refers to the page's params.
- `$.Page.Site.Params` refers to global variables from `config.yml`.

