## How to get javascript scopes 
### Web

**Download required scripts:**

```sh
$> wget https://raw.github.com/ariya/esprima/master/esprima.js
$> wget https://raw.github.com/Constellation/estraverse/master/estraverse.js
$> wget https://raw.github.com/Constellation/escope/master/escope.js
```
(or you can use bower to download esprima and escope components)

**Example:**

```html
<script type="text/javascript" src="esprima.js"></script>
<script type="text/javascript" src="estraverse.js"></script>
<script type="text/javascript" src="escope.js"></script>
...
<script type="text/javascript">
    var value = "...";
    var ast = esprima.parse(value, {range: true, loc: true});
    var scopes = escope.analyze(ast).scopes;
    console.log(scopes);
</script>
```

### NodeJS

**Install required node packages:**

```sh
$> npm install esprima
$> npm install escope
```

**Example:**

```javascript
var esprima = require('esprima');
var escope = require('escope');

var value = "...";
var ast = esprima.parse(value, {range: true, loc: true});
var scopes = escope.analyze(ast).scopes;

console.log(scopes);
```
## Credits

* Yusuke Suzuki (twitter: @Constellation) and other contributors of [escope library](https://github.com/Constellation/escope).
