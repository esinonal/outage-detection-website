(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.P.F === region.W.F)
	{
		return 'on line ' + region.P.F;
	}
	return 'on lines ' + region.P.F + ' through ' + region.W.F;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aX,
		impl.a9,
		impl.a7,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		u: func(record.u),
		R: record.R,
		N: record.N
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.u;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.R;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.N) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aX,
		impl.a9,
		impl.a7,
		function(sendToApp, initialModel) {
			var view = impl.ba;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aX,
		impl.a9,
		impl.a7,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.O && impl.O(sendToApp)
			var view = impl.ba;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.aM);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.a8) && (_VirtualDom_doc.title = title = doc.a8);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.a1;
	var onUrlRequest = impl.a2;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		O: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.at === next.at
							&& curr.ac === next.ac
							&& curr.ap.a === next.ap.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		aX: function(flags)
		{
			return A3(impl.aX, flags, _Browser_getUrl(), key);
		},
		ba: impl.ba,
		a9: impl.a9,
		a7: impl.a7
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { aU: 'hidden', aN: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { aU: 'mozHidden', aN: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { aU: 'msHidden', aN: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { aU: 'webkitHidden', aN: 'webkitvisibilitychange' }
		: { aU: 'hidden', aN: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		az: _Browser_getScene(),
		aG: {
			aI: _Browser_window.pageXOffset,
			aJ: _Browser_window.pageYOffset,
			aH: _Browser_doc.documentElement.clientWidth,
			aa: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aH: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		aa: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			az: {
				aH: node.scrollWidth,
				aa: node.scrollHeight
			},
			aG: {
				aI: node.scrollLeft,
				aJ: node.scrollTop,
				aH: node.clientWidth,
				aa: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			az: _Browser_getScene(),
			aG: {
				aI: x,
				aJ: y,
				aH: _Browser_doc.documentElement.clientWidth,
				aa: _Browser_doc.documentElement.clientHeight
			},
			aS: {
				aI: x + rect.left,
				aJ: y + rect.top,
				aH: rect.width,
				aa: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}





// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.g) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.i);
		} else {
			var treeLen = builder.g * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.j) : builder.j;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.g);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.i);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{j: nodeList, g: (len / $elm$core$Array$branchFactor) | 0, i: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {_: fragment, ac: host, an: path, ap: port_, at: protocol, au: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$UploadForm = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$initModel = $author$project$Main$UploadForm(1);
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2($author$project$Main$initModel, $elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Main$CsvLoaded = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$CsvSelected = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$UploadError = {$: 1};
var $author$project$Main$Uploaded = function (a) {
	return {$: 2, a: a};
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $gicentre$elm_vegalite$VegaLite$combineSpecs = function (specs) {
	return $elm$json$Json$Encode$object(specs);
};
var $gicentre$elm_vegalite$VegaLite$X = 0;
var $gicentre$elm_vegalite$VegaLite$Y = 1;
var $gicentre$elm_vegalite$VegaLite$Bar = 1;
var $gicentre$elm_vegalite$VegaLite$VLMark = 12;
var $gicentre$elm_vegalite$VegaLite$markLabel = function (m) {
	switch (m) {
		case 0:
			return 'area';
		case 1:
			return 'bar';
		case 2:
			return 'boxplot';
		case 5:
			return 'circle';
		case 3:
			return 'errorband';
		case 4:
			return 'errorbar';
		case 7:
			return 'image';
		case 8:
			return 'line';
		case 6:
			return 'geoshape';
		case 9:
			return 'point';
		case 10:
			return 'rect';
		case 11:
			return 'rule';
		case 12:
			return 'square';
		case 13:
			return 'text';
		case 14:
			return 'tick';
		default:
			return 'trail';
	}
};
var $gicentre$elm_vegalite$VegaLite$TTNone = 2;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $elm$json$Json$Encode$string = _Json_wrap;
var $gicentre$elm_vegalite$VegaLite$blendModeSpec = function (bm) {
	switch (bm) {
		case 0:
			return $elm$json$Json$Encode$null;
		case 1:
			return $elm$json$Json$Encode$string('multiply');
		case 2:
			return $elm$json$Json$Encode$string('screen');
		case 3:
			return $elm$json$Json$Encode$string('overlay');
		case 4:
			return $elm$json$Json$Encode$string('darken');
		case 5:
			return $elm$json$Json$Encode$string('lighten');
		case 6:
			return $elm$json$Json$Encode$string('color-dodge');
		case 7:
			return $elm$json$Json$Encode$string('color-burn');
		case 8:
			return $elm$json$Json$Encode$string('hard-light');
		case 9:
			return $elm$json$Json$Encode$string('soft-light');
		case 10:
			return $elm$json$Json$Encode$string('difference');
		case 11:
			return $elm$json$Json$Encode$string('exclusion');
		case 12:
			return $elm$json$Json$Encode$string('hue');
		case 13:
			return $elm$json$Json$Encode$string('saturation');
		case 14:
			return $elm$json$Json$Encode$string('color');
		default:
			return $elm$json$Json$Encode$string('luminosity');
	}
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $gicentre$elm_vegalite$VegaLite$colorGradientLabel = function (gr) {
	if (!gr) {
		return 'linear';
	} else {
		return 'radial';
	}
};
var $gicentre$elm_vegalite$VegaLite$cursorLabel = function (cur) {
	switch (cur) {
		case 0:
			return 'auto';
		case 1:
			return 'default';
		case 2:
			return 'none';
		case 3:
			return 'context-menu';
		case 4:
			return 'help';
		case 5:
			return 'pointer';
		case 6:
			return 'progress';
		case 7:
			return 'wait';
		case 8:
			return 'cell';
		case 9:
			return 'crosshair';
		case 10:
			return 'text';
		case 11:
			return 'vertical-text';
		case 12:
			return 'alias';
		case 13:
			return 'copy';
		case 14:
			return 'move';
		case 15:
			return 'no-drop';
		case 16:
			return 'not-allowed';
		case 17:
			return 'all-scroll';
		case 18:
			return 'col-resize';
		case 19:
			return 'row-resize';
		case 20:
			return 'n-resize';
		case 21:
			return 'e-resize';
		case 22:
			return 's-resize';
		case 23:
			return 'w-resize';
		case 24:
			return 'ne-resize';
		case 25:
			return 'nw-resize';
		case 26:
			return 'se-resize';
		case 27:
			return 'sw-resize';
		case 28:
			return 'ew-resize';
		case 29:
			return 'ns-resize';
		case 30:
			return 'nesw-resize';
		case 31:
			return 'nwse-resize';
		case 32:
			return 'zoom-in';
		case 33:
			return 'zoom-out';
		case 34:
			return 'grab';
		default:
			return 'grabbing';
	}
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $gicentre$elm_vegalite$VegaLite$extentSpec = function (ext) {
	switch (ext.$) {
		case 0:
			return $elm$json$Json$Encode$string('ci');
		case 1:
			return $elm$json$Json$Encode$string('stderr');
		case 2:
			return $elm$json$Json$Encode$string('stdev');
		case 3:
			return $elm$json$Json$Encode$string('iqr');
		case 4:
			return $elm$json$Json$Encode$string('min-max');
		default:
			var sc = ext.a;
			return $elm$json$Json$Encode$float(sc);
	}
};
var $gicentre$elm_vegalite$VegaLite$fontWeightSpec = function (w) {
	switch (w) {
		case 3:
			return $elm$json$Json$Encode$string('normal');
		case 0:
			return $elm$json$Json$Encode$string('bold');
		case 1:
			return $elm$json$Json$Encode$string('bolder');
		case 2:
			return $elm$json$Json$Encode$string('lighter');
		case 4:
			return $elm$json$Json$Encode$float(100);
		case 5:
			return $elm$json$Json$Encode$float(200);
		case 6:
			return $elm$json$Json$Encode$float(300);
		case 7:
			return $elm$json$Json$Encode$float(400);
		case 8:
			return $elm$json$Json$Encode$float(500);
		case 9:
			return $elm$json$Json$Encode$float(600);
		case 10:
			return $elm$json$Json$Encode$float(700);
		case 11:
			return $elm$json$Json$Encode$float(800);
		default:
			return $elm$json$Json$Encode$float(900);
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $gicentre$elm_vegalite$VegaLite$stopSpec = function (_v0) {
	var x = _v0.a;
	var c = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'offset',
				$elm$json$Json$Encode$float(x)),
				_Utils_Tuple2(
				'color',
				$elm$json$Json$Encode$string(c))
			]));
};
var $gicentre$elm_vegalite$VegaLite$gradientProperty = function (gp) {
	switch (gp.$) {
		case 0:
			var x = gp.a;
			return _Utils_Tuple2(
				'x1',
				$elm$json$Json$Encode$float(x));
		case 1:
			var x = gp.a;
			return _Utils_Tuple2(
				'y1',
				$elm$json$Json$Encode$float(x));
		case 2:
			var x = gp.a;
			return _Utils_Tuple2(
				'x2',
				$elm$json$Json$Encode$float(x));
		case 3:
			var x = gp.a;
			return _Utils_Tuple2(
				'y2',
				$elm$json$Json$Encode$float(x));
		case 4:
			var x = gp.a;
			return _Utils_Tuple2(
				'r1',
				$elm$json$Json$Encode$float(x));
		case 5:
			var x = gp.a;
			return _Utils_Tuple2(
				'r2',
				$elm$json$Json$Encode$float(x));
		default:
			var grs = gp.a;
			return _Utils_Tuple2(
				'stops',
				A2($elm$json$Json$Encode$list, $gicentre$elm_vegalite$VegaLite$stopSpec, grs));
	}
};
var $gicentre$elm_vegalite$VegaLite$hAlignLabel = function (al) {
	switch (al) {
		case 1:
			return 'left';
		case 0:
			return 'center';
		default:
			return 'right';
	}
};
var $gicentre$elm_vegalite$VegaLite$markInterpolationLabel = function (interp) {
	switch (interp) {
		case 7:
			return 'linear';
		case 8:
			return 'linear-closed';
		case 12:
			return 'step';
		case 11:
			return 'step-before';
		case 10:
			return 'step-after';
		case 0:
			return 'basis';
		case 2:
			return 'basis-open';
		case 1:
			return 'basis-closed';
		case 4:
			return 'cardinal';
		case 6:
			return 'cardinal-open';
		case 5:
			return 'cardinal-closed';
		case 3:
			return 'bundle';
		default:
			return 'monotone';
	}
};
var $gicentre$elm_vegalite$VegaLite$markOrientationLabel = function (orient) {
	if (!orient) {
		return 'horizontal';
	} else {
		return 'vertical';
	}
};
var $gicentre$elm_vegalite$VegaLite$multilineTextSpec = function (tText) {
	var _v0 = A2($elm$core$String$split, '\n', tText);
	if (!_v0.b) {
		return $elm$json$Json$Encode$string('');
	} else {
		if (!_v0.b.b) {
			var s = _v0.a;
			return $elm$json$Json$Encode$string(s);
		} else {
			var ss = _v0;
			return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, ss);
		}
	}
};
var $gicentre$elm_vegalite$VegaLite$strokeCapLabel = function (cap) {
	switch (cap) {
		case 0:
			return 'butt';
		case 1:
			return 'round';
		default:
			return 'square';
	}
};
var $gicentre$elm_vegalite$VegaLite$strokeJoinLabel = function (jn) {
	switch (jn) {
		case 0:
			return 'miter';
		case 1:
			return 'round';
		default:
			return 'bevel';
	}
};
var $gicentre$elm_vegalite$VegaLite$symbolLabel = function (sym) {
	switch (sym.$) {
		case 0:
			return 'circle';
		case 1:
			return 'square';
		case 2:
			return 'cross';
		case 3:
			return 'diamond';
		case 4:
			return 'triangle-up';
		case 5:
			return 'triangle-down';
		case 6:
			return 'triangle-left';
		case 7:
			return 'triangle-right';
		case 12:
			return 'triangle';
		case 9:
			return 'stroke';
		case 10:
			return 'arrow';
		case 11:
			return 'wedge';
		default:
			var svgPath = sym.a;
			return svgPath;
	}
};
var $gicentre$elm_vegalite$VegaLite$textDirectionLabel = function (td) {
	if (!td) {
		return 'ltr';
	} else {
		return 'rtl';
	}
};
var $elm$core$String$trim = _String_trim;
var $gicentre$elm_vegalite$VegaLite$ttContentLabel = function (ttContent) {
	switch (ttContent) {
		case 0:
			return 'encoding';
		case 1:
			return 'data';
		default:
			return 'null';
	}
};
var $gicentre$elm_vegalite$VegaLite$vAlignLabel = function (al) {
	switch (al) {
		case 0:
			return 'top';
		case 1:
			return 'line-top';
		case 2:
			return 'middle';
		case 3:
			return 'bottom';
		case 4:
			return 'line-bottom';
		default:
			return 'alphabetic';
	}
};
var $gicentre$elm_vegalite$VegaLite$lineMarkerSpec = function (pm) {
	if (!pm.$) {
		return $elm$json$Json$Encode$bool(false);
	} else {
		var mps = pm.a;
		return $elm$json$Json$Encode$object(
			A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, mps));
	}
};
var $gicentre$elm_vegalite$VegaLite$markProperty = function (mProp) {
	switch (mProp.$) {
		case 29:
			var b = mProp.a;
			return _Utils_Tuple2(
				'filled',
				$elm$json$Json$Encode$bool(b));
		case 5:
			var bm = mProp.a;
			return _Utils_Tuple2(
				'blend',
				$gicentre$elm_vegalite$VegaLite$blendModeSpec(bm));
		case 8:
			var b = mProp.a;
			return _Utils_Tuple2(
				'clip',
				$elm$json$Json$Encode$bool(b));
		case 9:
			var col = mProp.a;
			return _Utils_Tuple2(
				'color',
				$elm$json$Json$Encode$string(col));
		case 11:
			var r = mProp.a;
			return _Utils_Tuple2(
				'cornerRadius',
				$elm$json$Json$Encode$float(r));
		case 12:
			var r = mProp.a;
			return _Utils_Tuple2(
				'cornerRadiusEnd',
				$elm$json$Json$Encode$float(r));
		case 15:
			var r = mProp.a;
			return _Utils_Tuple2(
				'cornerRadiusBottomLeft',
				$elm$json$Json$Encode$float(r));
		case 16:
			var r = mProp.a;
			return _Utils_Tuple2(
				'cornerRadiusBottomRight',
				$elm$json$Json$Encode$float(r));
		case 13:
			var r = mProp.a;
			return _Utils_Tuple2(
				'cornerRadiusTopLeft',
				$elm$json$Json$Encode$float(r));
		case 14:
			var r = mProp.a;
			return _Utils_Tuple2(
				'cornerRadiusTopRight',
				$elm$json$Json$Encode$float(r));
		case 17:
			var cur = mProp.a;
			return _Utils_Tuple2(
				'cursor',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$cursorLabel(cur)));
		case 26:
			var ext = mProp.a;
			return _Utils_Tuple2(
				'extent',
				$gicentre$elm_vegalite$VegaLite$extentSpec(ext));
		case 18:
			var s = mProp.a;
			return _Utils_Tuple2(
				'href',
				$elm$json$Json$Encode$string(s));
		case 45:
			var b = mProp.a;
			return b ? _Utils_Tuple2(
				'invalid',
				$elm$json$Json$Encode$string('filter')) : _Utils_Tuple2('invalid', $elm$json$Json$Encode$null);
		case 27:
			var col = mProp.a;
			return ($elm$core$String$trim(col) === '') ? _Utils_Tuple2('fill', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'fill',
				$elm$json$Json$Encode$string(col));
		case 28:
			var cGrad = mProp.a;
			var props = mProp.b;
			return _Utils_Tuple2(
				'fill',
				$elm$json$Json$Encode$object(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							'gradient',
							$elm$json$Json$Encode$string(
								$gicentre$elm_vegalite$VegaLite$colorGradientLabel(cGrad))),
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$gradientProperty, props))));
		case 10:
			var cGrad = mProp.a;
			var props = mProp.b;
			return _Utils_Tuple2(
				'color',
				$elm$json$Json$Encode$object(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							'gradient',
							$elm$json$Json$Encode$string(
								$gicentre$elm_vegalite$VegaLite$colorGradientLabel(cGrad))),
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$gradientProperty, props))));
		case 51:
			var cGrad = mProp.a;
			var props = mProp.b;
			return _Utils_Tuple2(
				'stroke',
				$elm$json$Json$Encode$object(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							'gradient',
							$elm$json$Json$Encode$string(
								$gicentre$elm_vegalite$VegaLite$colorGradientLabel(cGrad))),
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$gradientProperty, props))));
		case 50:
			var col = mProp.a;
			return ($elm$core$String$trim(col) === '') ? _Utils_Tuple2('stroke', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'stroke',
				$elm$json$Json$Encode$string(col));
		case 52:
			var sc = mProp.a;
			return _Utils_Tuple2(
				'strokeCap',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$strokeCapLabel(sc)));
		case 55:
			var sj = mProp.a;
			return _Utils_Tuple2(
				'strokeJoin',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$strokeJoinLabel(sj)));
		case 56:
			var ml = mProp.a;
			return _Utils_Tuple2(
				'strokeMiterLimit',
				$elm$json$Json$Encode$float(ml));
		case 39:
			var x = mProp.a;
			return _Utils_Tuple2(
				'opacity',
				$elm$json$Json$Encode$float(x));
		case 30:
			var x = mProp.a;
			return _Utils_Tuple2(
				'fillOpacity',
				$elm$json$Json$Encode$float(x));
		case 57:
			var x = mProp.a;
			return _Utils_Tuple2(
				'strokeOpacity',
				$elm$json$Json$Encode$float(x));
		case 58:
			var x = mProp.a;
			return _Utils_Tuple2(
				'strokeWidth',
				$elm$json$Json$Encode$float(x));
		case 53:
			var xs = mProp.a;
			return _Utils_eq(xs, _List_Nil) ? _Utils_Tuple2('strokeDash', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'strokeDash',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, xs));
		case 54:
			var x = mProp.a;
			return _Utils_Tuple2(
				'strokeDashOffset',
				$elm$json$Json$Encode$float(x));
		case 59:
			var styles = mProp.a;
			return _Utils_Tuple2(
				'style',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, styles));
		case 35:
			var interp = mProp.a;
			return _Utils_Tuple2(
				'interpolate',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$markInterpolationLabel(interp)));
		case 60:
			var x = mProp.a;
			return _Utils_Tuple2(
				'tension',
				$elm$json$Json$Encode$float(x));
		case 42:
			var orient = mProp.a;
			return _Utils_Tuple2(
				'orient',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$markOrientationLabel(orient)));
		case 47:
			var sym = mProp.a;
			return _Utils_Tuple2(
				'shape',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$symbolLabel(sym)));
		case 49:
			var x = mProp.a;
			return _Utils_Tuple2(
				'size',
				$elm$json$Json$Encode$float(x));
		case 1:
			var x = mProp.a;
			return _Utils_Tuple2(
				'angle',
				$elm$json$Json$Encode$float(x));
		case 0:
			var al = mProp.a;
			return _Utils_Tuple2(
				'align',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$hAlignLabel(al)));
		case 3:
			var va = mProp.a;
			return _Utils_Tuple2(
				'baseline',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$vAlignLabel(va)));
		case 24:
			var dx = mProp.a;
			return _Utils_Tuple2(
				'dx',
				$elm$json$Json$Encode$float(dx));
		case 25:
			var dy = mProp.a;
			return _Utils_Tuple2(
				'dy',
				$elm$json$Json$Encode$float(dy));
		case 31:
			var fnt = mProp.a;
			return _Utils_Tuple2(
				'font',
				$elm$json$Json$Encode$string(fnt));
		case 32:
			var x = mProp.a;
			return _Utils_Tuple2(
				'fontSize',
				$elm$json$Json$Encode$float(x));
		case 33:
			var fSty = mProp.a;
			return _Utils_Tuple2(
				'fontStyle',
				$elm$json$Json$Encode$string(fSty));
		case 34:
			var w = mProp.a;
			return _Utils_Tuple2(
				'fontWeight',
				$gicentre$elm_vegalite$VegaLite$fontWeightSpec(w));
		case 44:
			var x = mProp.a;
			return _Utils_Tuple2(
				'radius',
				$elm$json$Json$Encode$float(x));
		case 61:
			var txt = mProp.a;
			return _Utils_Tuple2(
				'text',
				$gicentre$elm_vegalite$VegaLite$multilineTextSpec(txt));
		case 37:
			var x = mProp.a;
			return _Utils_Tuple2(
				'lineHeight',
				$elm$json$Json$Encode$float(x));
		case 20:
			var x = mProp.a;
			return _Utils_Tuple2(
				'limit',
				$elm$json$Json$Encode$float(x));
		case 21:
			var s = mProp.a;
			return _Utils_Tuple2(
				'ellipsis',
				$elm$json$Json$Encode$string(s));
		case 22:
			var td = mProp.a;
			return _Utils_Tuple2(
				'dir',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$textDirectionLabel(td)));
		case 62:
			var x = mProp.a;
			return _Utils_Tuple2(
				'theta',
				$elm$json$Json$Encode$float(x));
		case 4:
			var x = mProp.a;
			return _Utils_Tuple2(
				'binSpacing',
				$elm$json$Json$Encode$float(x));
		case 19:
			var x = mProp.a;
			return _Utils_Tuple2(
				'continuousBandSize',
				$elm$json$Json$Encode$float(x));
		case 23:
			var x = mProp.a;
			return _Utils_Tuple2(
				'discreteBandSize',
				$elm$json$Json$Encode$float(x));
		case 48:
			var b = mProp.a;
			return _Utils_Tuple2(
				'shortTimeLabels',
				$elm$json$Json$Encode$bool(b));
		case 2:
			var x = mProp.a;
			return _Utils_Tuple2(
				'bandSize',
				$elm$json$Json$Encode$float(x));
		case 63:
			var x = mProp.a;
			return _Utils_Tuple2(
				'thickness',
				$elm$json$Json$Encode$float(x));
		case 46:
			var props = mProp.a;
			if (!props.b) {
				return _Utils_Tuple2(
					'rule',
					$elm$json$Json$Encode$bool(false));
			} else {
				return _Utils_Tuple2(
					'rule',
					$elm$json$Json$Encode$object(
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, props)));
			}
		case 6:
			var props = mProp.a;
			return _Utils_Tuple2(
				'borders',
				$elm$json$Json$Encode$object(
					A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, props)));
		case 38:
			var props = mProp.a;
			if (!props.b) {
				return _Utils_Tuple2(
					'median',
					$elm$json$Json$Encode$bool(false));
			} else {
				return _Utils_Tuple2(
					'median',
					$elm$json$Json$Encode$object(
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, props)));
			}
		case 7:
			var props = mProp.a;
			if (!props.b) {
				return _Utils_Tuple2(
					'box',
					$elm$json$Json$Encode$bool(false));
			} else {
				return _Utils_Tuple2(
					'box',
					$elm$json$Json$Encode$object(
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, props)));
			}
		case 40:
			var props = mProp.a;
			if (!props.b) {
				return _Utils_Tuple2(
					'outliers',
					$elm$json$Json$Encode$bool(false));
			} else {
				return _Utils_Tuple2(
					'outliers',
					$elm$json$Json$Encode$object(
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, props)));
			}
		case 64:
			var props = mProp.a;
			return _Utils_Tuple2(
				'ticks',
				$elm$json$Json$Encode$object(
					A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, props)));
		case 65:
			var ttContent = mProp.a;
			return (ttContent === 2) ? _Utils_Tuple2('tooltip', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'tooltip',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'content',
							$elm$json$Json$Encode$string(
								$gicentre$elm_vegalite$VegaLite$ttContentLabel(ttContent)))
						])));
		case 43:
			var pm = mProp.a;
			return _Utils_Tuple2(
				'point',
				$gicentre$elm_vegalite$VegaLite$pointMarkerSpec(pm));
		case 36:
			var lm = mProp.a;
			return _Utils_Tuple2(
				'line',
				$gicentre$elm_vegalite$VegaLite$lineMarkerSpec(lm));
		case 66:
			var w = mProp.a;
			return _Utils_Tuple2(
				'width',
				$elm$json$Json$Encode$float(w));
		case 67:
			var h = mProp.a;
			return _Utils_Tuple2(
				'height',
				$elm$json$Json$Encode$float(h));
		case 68:
			var x = mProp.a;
			return _Utils_Tuple2(
				'x',
				$elm$json$Json$Encode$float(x));
		case 69:
			var y = mProp.a;
			return _Utils_Tuple2(
				'y',
				$elm$json$Json$Encode$float(y));
		case 70:
			var x = mProp.a;
			return _Utils_Tuple2(
				'x2',
				$elm$json$Json$Encode$float(x));
		case 71:
			var y = mProp.a;
			return _Utils_Tuple2(
				'y2',
				$elm$json$Json$Encode$float(y));
		case 41:
			var b = mProp.a;
			return _Utils_Tuple2(
				'order',
				$elm$json$Json$Encode$bool(b));
		case 72:
			var o = mProp.a;
			return _Utils_Tuple2(
				'xOffset',
				$elm$json$Json$Encode$float(o));
		case 74:
			var o = mProp.a;
			return _Utils_Tuple2(
				'x2Offset',
				$elm$json$Json$Encode$float(o));
		case 73:
			var o = mProp.a;
			return _Utils_Tuple2(
				'yOffset',
				$elm$json$Json$Encode$float(o));
		case 75:
			var o = mProp.a;
			return _Utils_Tuple2(
				'y2Offset',
				$elm$json$Json$Encode$float(o));
		default:
			var b = mProp.a;
			return _Utils_Tuple2(
				'aspect',
				$elm$json$Json$Encode$bool(b));
	}
};
var $gicentre$elm_vegalite$VegaLite$pointMarkerSpec = function (pm) {
	switch (pm.$) {
		case 0:
			return $elm$json$Json$Encode$string('transparent');
		case 1:
			return $elm$json$Json$Encode$bool(false);
		default:
			var mps = pm.a;
			return _Utils_eq(mps, _List_Nil) ? $elm$json$Json$Encode$bool(true) : $elm$json$Json$Encode$object(
				A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, mps));
	}
};
var $gicentre$elm_vegalite$VegaLite$mark = F2(
	function (m, mProps) {
		if (!mProps.b) {
			return _Utils_Tuple2(
				12,
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$markLabel(m)));
		} else {
			return _Utils_Tuple2(
				12,
				$elm$json$Json$Encode$object(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string(
								$gicentre$elm_vegalite$VegaLite$markLabel(m))),
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$markProperty, mProps))));
		}
	});
var $gicentre$elm_vegalite$VegaLite$bar = $gicentre$elm_vegalite$VegaLite$mark(1);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $gicentre$elm_vegalite$VegaLite$VLData = 10;
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $gicentre$elm_vegalite$VegaLite$dataTypeLabel = function (dType) {
	switch (dType.$) {
		case 0:
			return 'number';
		case 1:
			return 'boolean';
		case 2:
			var dateFmt = dType.a;
			return (dateFmt === '') ? 'date' : ('date:\'' + (dateFmt + '\''));
		default:
			var dateFmt = dType.a;
			return (dateFmt === '') ? 'utc' : ('utc:\'' + (dateFmt + '\''));
	}
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $gicentre$elm_vegalite$VegaLite$formatProperties = function (fmt) {
	switch (fmt.$) {
		case 0:
			var propertyName = fmt.a;
			return ($elm$core$String$trim(propertyName) === '') ? _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('json'))
				]) : _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('json')),
					_Utils_Tuple2(
					'property',
					$elm$json$Json$Encode$string(propertyName))
				]);
		case 1:
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('csv'))
				]);
		case 2:
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('tsv'))
				]);
		case 3:
			var delim = fmt.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('dsv')),
					_Utils_Tuple2(
					'delimiter',
					$elm$json$Json$Encode$string(
						$elm$core$String$fromChar(delim)))
				]);
		case 4:
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('arrow'))
				]);
		case 5:
			var objectSet = fmt.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('topojson')),
					_Utils_Tuple2(
					'feature',
					$elm$json$Json$Encode$string(objectSet))
				]);
		case 6:
			var objectSet = fmt.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('topojson')),
					_Utils_Tuple2(
					'mesh',
					$elm$json$Json$Encode$string(objectSet))
				]);
		default:
			var fmts = fmt.a;
			return _Utils_eq(fmts, _List_Nil) ? _List_fromArray(
				[
					_Utils_Tuple2('parse', $elm$json$Json$Encode$null)
				]) : _List_fromArray(
				[
					_Utils_Tuple2(
					'parse',
					$elm$json$Json$Encode$object(
						A2(
							$elm$core$List$map,
							function (_v1) {
								var field = _v1.a;
								var fFormat = _v1.b;
								return _Utils_Tuple2(
									field,
									$elm$json$Json$Encode$string(
										$gicentre$elm_vegalite$VegaLite$dataTypeLabel(fFormat)));
							},
							fmts)))
				]);
	}
};
var $gicentre$elm_vegalite$VegaLite$toList = $elm$json$Json$Encode$list($elm$core$Basics$identity);
var $gicentre$elm_vegalite$VegaLite$dataFromRows = F2(
	function (fmts, rows) {
		return _Utils_eq(fmts, _List_Nil) ? _Utils_Tuple2(
			10,
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'values',
						$gicentre$elm_vegalite$VegaLite$toList(rows))
					]))) : _Utils_Tuple2(
			10,
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'values',
						$gicentre$elm_vegalite$VegaLite$toList(rows)),
						_Utils_Tuple2(
						'format',
						$elm$json$Json$Encode$object(
							A2($elm$core$List$concatMap, $gicentre$elm_vegalite$VegaLite$formatProperties, fmts)))
					])));
	});
var $gicentre$elm_vegalite$VegaLite$dayLabel = function (dayName) {
	switch (dayName) {
		case 0:
			return 'Mon';
		case 1:
			return 'Tue';
		case 2:
			return 'Wed';
		case 3:
			return 'Thu';
		case 4:
			return 'Fri';
		case 5:
			return 'Sat';
		default:
			return 'Sun';
	}
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $gicentre$elm_vegalite$VegaLite$monthNameLabel = function (mon) {
	switch (mon) {
		case 0:
			return 'Jan';
		case 1:
			return 'Feb';
		case 2:
			return 'Mar';
		case 3:
			return 'Apr';
		case 4:
			return 'May';
		case 5:
			return 'Jun';
		case 6:
			return 'Jul';
		case 7:
			return 'Aug';
		case 8:
			return 'Sep';
		case 9:
			return 'Oct';
		case 10:
			return 'Nov';
		default:
			return 'Dec';
	}
};
var $gicentre$elm_vegalite$VegaLite$dateTimeProperty = function (dtp) {
	switch (dtp.$) {
		case 0:
			var y = dtp.a;
			return _Utils_Tuple2(
				'year',
				$elm$json$Json$Encode$int(y));
		case 1:
			var q = dtp.a;
			return _Utils_Tuple2(
				'quarter',
				$elm$json$Json$Encode$int(q));
		case 2:
			var mon = dtp.a;
			return _Utils_Tuple2(
				'month',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$monthNameLabel(mon)));
		case 3:
			var n = dtp.a;
			return _Utils_Tuple2(
				'month',
				$elm$json$Json$Encode$int(n));
		case 4:
			var d = dtp.a;
			return _Utils_Tuple2(
				'date',
				$elm$json$Json$Encode$int(d));
		case 5:
			var d = dtp.a;
			return _Utils_Tuple2(
				'day',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$dayLabel(d)));
		case 6:
			var h = dtp.a;
			return _Utils_Tuple2(
				'hours',
				$elm$json$Json$Encode$int(h));
		case 7:
			var m = dtp.a;
			return _Utils_Tuple2(
				'minutes',
				$elm$json$Json$Encode$int(m));
		case 8:
			var s = dtp.a;
			return _Utils_Tuple2(
				'seconds',
				$elm$json$Json$Encode$int(s));
		default:
			var ms = dtp.a;
			return _Utils_Tuple2(
				'milliseconds',
				$elm$json$Json$Encode$int(ms));
	}
};
var $gicentre$elm_vegalite$VegaLite$dataValueSpec = function (val) {
	switch (val.$) {
		case 2:
			var x = val.a;
			return $elm$json$Json$Encode$float(x);
		case 3:
			var s = val.a;
			return $elm$json$Json$Encode$string(s);
		case 0:
			var b = val.a;
			return $elm$json$Json$Encode$bool(b);
		case 1:
			var d = val.a;
			return $elm$json$Json$Encode$object(
				A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, d));
		default:
			return $elm$json$Json$Encode$null;
	}
};
var $gicentre$elm_vegalite$VegaLite$dataRow = function (r) {
	return $elm$core$List$cons(
		$elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var colName = _v0.a;
					var val = _v0.b;
					return _Utils_Tuple2(
						colName,
						$gicentre$elm_vegalite$VegaLite$dataValueSpec(val));
				},
				r)));
};
var $gicentre$elm_vegalite$VegaLite$VLEncoding = 15;
var $gicentre$elm_vegalite$VegaLite$encoding = function (channels) {
	return _Utils_Tuple2(
		15,
		$elm$json$Json$Encode$object(channels));
};
var $gicentre$elm_vegalite$VegaLite$Number = function (a) {
	return {$: 2, a: a};
};
var $gicentre$elm_vegalite$VegaLite$num = $gicentre$elm_vegalite$VegaLite$Number;
var $gicentre$elm_vegalite$VegaLite$PName = function (a) {
	return {$: 0, a: a};
};
var $gicentre$elm_vegalite$VegaLite$pName = $gicentre$elm_vegalite$VegaLite$PName;
var $gicentre$elm_vegalite$VegaLite$Ordinal = 1;
var $gicentre$elm_vegalite$VegaLite$PmType = function (a) {
	return {$: 5, a: a};
};
var $gicentre$elm_vegalite$VegaLite$pOrdinal = $gicentre$elm_vegalite$VegaLite$PmType(1);
var $gicentre$elm_vegalite$VegaLite$Quantitative = 2;
var $gicentre$elm_vegalite$VegaLite$pQuant = $gicentre$elm_vegalite$VegaLite$PmType(2);
var $gicentre$elm_vegalite$VegaLite$Latitude = 5;
var $gicentre$elm_vegalite$VegaLite$Latitude2 = 7;
var $gicentre$elm_vegalite$VegaLite$Longitude = 4;
var $gicentre$elm_vegalite$VegaLite$Longitude2 = 6;
var $gicentre$elm_vegalite$VegaLite$X2 = 2;
var $gicentre$elm_vegalite$VegaLite$XError = 8;
var $gicentre$elm_vegalite$VegaLite$XError2 = 10;
var $gicentre$elm_vegalite$VegaLite$Y2 = 3;
var $gicentre$elm_vegalite$VegaLite$YError = 9;
var $gicentre$elm_vegalite$VegaLite$YError2 = 11;
var $gicentre$elm_vegalite$VegaLite$arrangementLabel = function (arrng) {
	switch (arrng) {
		case 1:
			return 'row';
		case 0:
			return 'column';
		default:
			return 'repeat';
	}
};
var $gicentre$elm_vegalite$VegaLite$AxGridColor = function (a) {
	return {$: 64, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxGridDash = function (a) {
	return {$: 65, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxGridOpacity = function (a) {
	return {$: 66, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxGridWidth = function (a) {
	return {$: 67, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelAlign = function (a) {
	return {$: 16, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelBaseline = function (a) {
	return {$: 18, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelColor = function (a) {
	return {$: 20, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelFont = function (a) {
	return {$: 24, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelFontSize = function (a) {
	return {$: 25, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelFontStyle = function (a) {
	return {$: 26, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelFontWeight = function (a) {
	return {$: 27, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelOffset = function (a) {
	return {$: 30, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelOpacity = function (a) {
	return {$: 31, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxLabelPadding = function (a) {
	return {$: 33, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxTickColor = function (a) {
	return {$: 36, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxTickDash = function (a) {
	return {$: 38, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxTickOpacity = function (a) {
	return {$: 41, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxTickSize = function (a) {
	return {$: 44, a: a};
};
var $gicentre$elm_vegalite$VegaLite$AxTickWidth = function (a) {
	return {$: 45, a: a};
};
var $gicentre$elm_vegalite$VegaLite$anchorLabel = function (an) {
	switch (an) {
		case 0:
			return 'start';
		case 1:
			return 'middle';
		default:
			return 'end';
	}
};
var $gicentre$elm_vegalite$VegaLite$binProperty = function (binProp) {
	switch (binProp.$) {
		case 5:
			var n = binProp.a;
			return _Utils_Tuple2(
				'maxbins',
				$elm$json$Json$Encode$int(n));
		case 0:
			var x = binProp.a;
			return _Utils_Tuple2(
				'anchor',
				$elm$json$Json$Encode$float(x));
		case 1:
			var x = binProp.a;
			return _Utils_Tuple2(
				'base',
				$elm$json$Json$Encode$float(x));
		case 8:
			var x = binProp.a;
			return _Utils_Tuple2(
				'step',
				$elm$json$Json$Encode$float(x));
		case 9:
			var xs = binProp.a;
			return _Utils_Tuple2(
				'steps',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, xs));
		case 6:
			var x = binProp.a;
			return _Utils_Tuple2(
				'minstep',
				$elm$json$Json$Encode$float(x));
		case 2:
			var xs = binProp.a;
			return _Utils_Tuple2(
				'divide',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, xs));
		case 3:
			var mn = binProp.a;
			var mx = binProp.b;
			return _Utils_Tuple2(
				'extent',
				A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$float,
					_List_fromArray(
						[mn, mx])));
		case 4:
			var s = binProp.a;
			return _Utils_Tuple2(
				'extent',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'selection',
							$elm$json$Json$Encode$string(s))
						])));
		default:
			var b = binProp.a;
			return _Utils_Tuple2(
				'nice',
				$elm$json$Json$Encode$bool(b));
	}
};
var $gicentre$elm_vegalite$VegaLite$bin = function (bProps) {
	return _Utils_eq(bProps, _List_Nil) ? _Utils_Tuple2(
		'bin',
		$elm$json$Json$Encode$bool(true)) : _Utils_Tuple2(
		'bin',
		$elm$json$Json$Encode$object(
			A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$binProperty, bProps)));
};
var $gicentre$elm_vegalite$VegaLite$dataValuesSpecs = function (dvs) {
	switch (dvs.$) {
		case 2:
			var xs = dvs.a;
			return A2($elm$core$List$map, $elm$json$Json$Encode$float, xs);
		case 3:
			var ss = dvs.a;
			return A2($elm$core$List$map, $elm$json$Json$Encode$string, ss);
		case 1:
			var dtss = dvs.a;
			return A2(
				$elm$core$List$map,
				function (ds) {
					return $elm$json$Json$Encode$object(
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, ds));
				},
				dtss);
		default:
			var bs = dvs.a;
			return A2($elm$core$List$map, $elm$json$Json$Encode$bool, bs);
	}
};
var $gicentre$elm_vegalite$VegaLite$filterProperties = function (f) {
	switch (f.$) {
		case 0:
			var field = f.a;
			var val = f.b;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2(
					'equal',
					$gicentre$elm_vegalite$VegaLite$dataValueSpec(val))
				]);
		case 1:
			var field = f.a;
			var val = f.b;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2(
					'lt',
					$gicentre$elm_vegalite$VegaLite$dataValueSpec(val))
				]);
		case 2:
			var field = f.a;
			var val = f.b;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2(
					'lte',
					$gicentre$elm_vegalite$VegaLite$dataValueSpec(val))
				]);
		case 3:
			var field = f.a;
			var val = f.b;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2(
					'gt',
					$gicentre$elm_vegalite$VegaLite$dataValueSpec(val))
				]);
		case 4:
			var field = f.a;
			var val = f.b;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2(
					'gte',
					$gicentre$elm_vegalite$VegaLite$dataValueSpec(val))
				]);
		case 7:
			var selName = f.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'selection',
					$elm$json$Json$Encode$string(selName))
				]);
		case 9:
			var field = f.a;
			var vals = f.b;
			var values = function () {
				if (!vals.$) {
					var mn = vals.a;
					var mx = vals.b;
					return A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$float,
						_List_fromArray(
							[mn, mx]));
				} else {
					if (!vals.a.b) {
						if (!vals.b.b) {
							return $gicentre$elm_vegalite$VegaLite$toList(
								_List_fromArray(
									[$elm$json$Json$Encode$null, $elm$json$Json$Encode$null]));
						} else {
							var dMax = vals.b;
							return $gicentre$elm_vegalite$VegaLite$toList(
								_List_fromArray(
									[
										$elm$json$Json$Encode$null,
										$elm$json$Json$Encode$object(
										A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, dMax))
									]));
						}
					} else {
						if (!vals.b.b) {
							var dMin = vals.a;
							return $gicentre$elm_vegalite$VegaLite$toList(
								_List_fromArray(
									[
										$elm$json$Json$Encode$object(
										A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, dMin)),
										$elm$json$Json$Encode$null
									]));
						} else {
							var dMin = vals.a;
							var dMax = vals.b;
							return A2(
								$elm$json$Json$Encode$list,
								$elm$json$Json$Encode$object,
								_List_fromArray(
									[
										A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, dMin),
										A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, dMax)
									]));
						}
					}
				}
			}();
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2('range', values)
				]);
		case 8:
			var field = f.a;
			var vals = f.b;
			var values = function () {
				switch (vals.$) {
					case 2:
						var xs = vals.a;
						return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, xs);
					case 1:
						var ds = vals.a;
						return A2(
							$elm$json$Json$Encode$list,
							function (d) {
								return $elm$json$Json$Encode$object(
									A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, d));
							},
							ds);
					case 3:
						var ss = vals.a;
						return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, ss);
					default:
						var bs = vals.a;
						return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$bool, bs);
				}
			}();
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2('oneOf', values)
				]);
		case 10:
			var field = f.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2(
					'valid',
					$elm$json$Json$Encode$bool(true))
				]);
		default:
			return _List_Nil;
	}
};
var $gicentre$elm_vegalite$VegaLite$compositionAlignmentLabel = function (ca) {
	switch (ca) {
		case 0:
			return 'none';
		case 1:
			return 'each';
		default:
			return 'all';
	}
};
var $gicentre$elm_vegalite$VegaLite$legendOrientLabel = function (orient) {
	switch (orient) {
		case 3:
			return 'left';
		case 7:
			return 'top-left';
		case 6:
			return 'top';
		case 8:
			return 'top-right';
		case 5:
			return 'right';
		case 2:
			return 'bottom-right';
		case 0:
			return 'bottom';
		case 1:
			return 'bottom-left';
		default:
			return 'none';
	}
};
var $gicentre$elm_vegalite$VegaLite$overlapStrategySpec = function (strat) {
	switch (strat) {
		case 0:
			return $elm$json$Json$Encode$bool(false);
		case 1:
			return $elm$json$Json$Encode$string('parity');
		default:
			return $elm$json$Json$Encode$string('greedy');
	}
};
var $gicentre$elm_vegalite$VegaLite$legendProperty = function (legendProp) {
	switch (legendProp.$) {
		case 0:
			var h = legendProp.a;
			return _Utils_Tuple2(
				'clipHeight',
				$elm$json$Json$Encode$float(h));
		case 1:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'columnPadding',
				$elm$json$Json$Encode$float(n));
		case 26:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'rowPadding',
				$elm$json$Json$Encode$float(n));
		case 2:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'columns',
				$elm$json$Json$Encode$float(n));
		case 3:
			var r = legendProp.a;
			return _Utils_Tuple2(
				'cornerRadius',
				$elm$json$Json$Encode$float(r));
		case 5:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'fillColor',
				$elm$json$Json$Encode$string(s));
		case 4:
			var d = legendProp.a;
			return _Utils_Tuple2(
				'direction',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$markOrientationLabel(d)));
		case 44:
			var lType = legendProp.a;
			if (!lType) {
				return _Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('gradient'));
			} else {
				return _Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('symbol'));
			}
		case 6:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'format',
				$elm$json$Json$Encode$string(s));
		case 7:
			return _Utils_Tuple2(
				'formatType',
				$elm$json$Json$Encode$string('number'));
		case 8:
			return _Utils_Tuple2(
				'formatType',
				$elm$json$Json$Encode$string('time'));
		case 9:
			var formatter = legendProp.a;
			return _Utils_Tuple2(
				'formatType',
				$elm$json$Json$Encode$string(formatter));
		case 10:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'gradientLength',
				$elm$json$Json$Encode$float(n));
		case 11:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'gradientThickness',
				$elm$json$Json$Encode$float(n));
		case 12:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'gradientStrokeColor',
				$elm$json$Json$Encode$string(s));
		case 13:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'gradientStrokeWidth',
				$elm$json$Json$Encode$float(n));
		case 14:
			var ga = legendProp.a;
			return _Utils_Tuple2(
				'gridAlign',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$compositionAlignmentLabel(ga)));
		case 15:
			var ha = legendProp.a;
			return _Utils_Tuple2(
				'labelAlign',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$hAlignLabel(ha)));
		case 16:
			var va = legendProp.a;
			return _Utils_Tuple2(
				'labelBaseline',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$vAlignLabel(va)));
		case 17:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'labelColor',
				$elm$json$Json$Encode$string(s));
		case 18:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'labelFont',
				$elm$json$Json$Encode$string(s));
		case 19:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'labelFontSize',
				$elm$json$Json$Encode$float(x));
		case 20:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'labelLimit',
				$elm$json$Json$Encode$float(x));
		case 21:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'labelOffset',
				$elm$json$Json$Encode$float(x));
		case 22:
			var lo = legendProp.a;
			return _Utils_Tuple2(
				'labelOverlap',
				$gicentre$elm_vegalite$VegaLite$overlapStrategySpec(lo));
		case 23:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'offset',
				$elm$json$Json$Encode$float(x));
		case 24:
			var orient = legendProp.a;
			return _Utils_Tuple2(
				'orient',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$legendOrientLabel(orient)));
		case 25:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'padding',
				$elm$json$Json$Encode$float(x));
		case 27:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'strokeColor',
				$elm$json$Json$Encode$string(s));
		case 28:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'strokeWidth',
				$elm$json$Json$Encode$float(x));
		case 29:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'symbolFillColor',
				$elm$json$Json$Encode$string(s));
		case 33:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'symbolStrokeColor',
				$elm$json$Json$Encode$string(s));
		case 30:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'symbolType',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$symbolLabel(s)));
		case 31:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'symbolSize',
				$elm$json$Json$Encode$float(x));
		case 32:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'symbolStrokeWidth',
				$elm$json$Json$Encode$float(x));
		case 34:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'tickCount',
				$elm$json$Json$Encode$float(x));
		case 35:
			var s = legendProp.a;
			return (s === '') ? _Utils_Tuple2('title', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'title',
				$gicentre$elm_vegalite$VegaLite$multilineTextSpec(s));
		case 36:
			var ha = legendProp.a;
			return _Utils_Tuple2(
				'titleAlign',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$hAlignLabel(ha)));
		case 37:
			var va = legendProp.a;
			return _Utils_Tuple2(
				'titleBaseline',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$vAlignLabel(va)));
		case 38:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'titleColor',
				$elm$json$Json$Encode$string(s));
		case 39:
			var s = legendProp.a;
			return _Utils_Tuple2(
				'titleFont',
				$elm$json$Json$Encode$string(s));
		case 40:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'titleFontSize',
				$elm$json$Json$Encode$float(x));
		case 41:
			var fw = legendProp.a;
			return _Utils_Tuple2(
				'titleFontWeight',
				$gicentre$elm_vegalite$VegaLite$fontWeightSpec(fw));
		case 42:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'titleLimit',
				$elm$json$Json$Encode$float(x));
		case 43:
			var x = legendProp.a;
			return _Utils_Tuple2(
				'titlePadding',
				$elm$json$Json$Encode$float(x));
		case 45:
			var vals = legendProp.a;
			var list = function () {
				switch (vals.$) {
					case 1:
						var xs = vals.a;
						return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, xs);
					case 0:
						var ds = vals.a;
						return A2(
							$elm$json$Json$Encode$list,
							function (d) {
								return $elm$json$Json$Encode$object(
									A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, d));
							},
							ds);
					default:
						var ss = vals.a;
						return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, ss);
				}
			}();
			return _Utils_Tuple2('values', list);
		case 46:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'legendX',
				$elm$json$Json$Encode$float(n));
		case 47:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'legendY',
				$elm$json$Json$Encode$float(n));
		default:
			var n = legendProp.a;
			return _Utils_Tuple2(
				'zindex',
				$elm$json$Json$Encode$int(n));
	}
};
var $gicentre$elm_vegalite$VegaLite$measurementLabel = function (mType) {
	switch (mType) {
		case 0:
			return 'nominal';
		case 1:
			return 'ordinal';
		case 2:
			return 'quantitative';
		case 3:
			return 'temporal';
		default:
			return 'geojson';
	}
};
var $gicentre$elm_vegalite$VegaLite$operationSpec = function (op) {
	switch (op.$) {
		case 0:
			var maybeField = op.a;
			if (maybeField.$ === 1) {
				return $elm$json$Json$Encode$string('argmax');
			} else {
				var f = maybeField.a;
				return (!$elm$core$String$length(
					$elm$core$String$trim(f))) ? $elm$json$Json$Encode$string('argmax') : $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'argmax',
							$elm$json$Json$Encode$string(f))
						]));
			}
		case 1:
			var maybeField = op.a;
			if (maybeField.$ === 1) {
				return $elm$json$Json$Encode$string('argmin');
			} else {
				var f = maybeField.a;
				return (!$elm$core$String$length(
					$elm$core$String$trim(f))) ? $elm$json$Json$Encode$string('argmin') : $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'argmin',
							$elm$json$Json$Encode$string(f))
						]));
			}
		case 4:
			return $elm$json$Json$Encode$string('count');
		case 2:
			return $elm$json$Json$Encode$string('ci0');
		case 3:
			return $elm$json$Json$Encode$string('ci1');
		case 5:
			return $elm$json$Json$Encode$string('distinct');
		case 6:
			return $elm$json$Json$Encode$string('max');
		case 7:
			return $elm$json$Json$Encode$string('mean');
		case 8:
			return $elm$json$Json$Encode$string('median');
		case 9:
			return $elm$json$Json$Encode$string('min');
		case 10:
			return $elm$json$Json$Encode$string('missing');
		case 11:
			return $elm$json$Json$Encode$string('product');
		case 12:
			return $elm$json$Json$Encode$string('q1');
		case 13:
			return $elm$json$Json$Encode$string('q3');
		case 15:
			return $elm$json$Json$Encode$string('stdev');
		case 16:
			return $elm$json$Json$Encode$string('stdevp');
		case 17:
			return $elm$json$Json$Encode$string('sum');
		case 14:
			return $elm$json$Json$Encode$string('stderr');
		case 18:
			return $elm$json$Json$Encode$string('valid');
		case 19:
			return $elm$json$Json$Encode$string('variance');
		default:
			return $elm$json$Json$Encode$string('variancep');
	}
};
var $gicentre$elm_vegalite$VegaLite$cInterpolateSpec = function (iType) {
	switch (iType.$) {
		case 7:
			var gamma = iType.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('rgb')),
						_Utils_Tuple2(
						'gamma',
						$elm$json$Json$Encode$float(gamma))
					]));
		case 4:
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('hsl'))
					]));
		case 5:
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('hsl-long'))
					]));
		case 6:
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('lab'))
					]));
		case 2:
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('hcl'))
					]));
		case 3:
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('hcl-long'))
					]));
		case 0:
			var gamma = iType.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('cubehelix')),
						_Utils_Tuple2(
						'gamma',
						$elm$json$Json$Encode$float(gamma))
					]));
		default:
			var gamma = iType.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('cubehelix-long')),
						_Utils_Tuple2(
						'gamma',
						$elm$json$Json$Encode$float(gamma))
					]));
	}
};
var $gicentre$elm_vegalite$VegaLite$channelLabel = function (ch) {
	switch (ch) {
		case 0:
			return 'x';
		case 1:
			return 'y';
		case 2:
			return 'x2';
		case 3:
			return 'y2';
		case 4:
			return 'color';
		case 5:
			return 'opacity';
		case 6:
			return 'shape';
		case 7:
			return 'size';
		default:
			return 'strokeDash';
	}
};
var $gicentre$elm_vegalite$VegaLite$scaleDomainSpec = function (sdType) {
	switch (sdType.$) {
		case 0:
			var ns = sdType.a;
			return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, ns);
		case 2:
			var ds = sdType.a;
			return A2(
				$elm$json$Json$Encode$list,
				function (d) {
					return $elm$json$Json$Encode$object(
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, d));
				},
				ds);
		case 1:
			var cats = sdType.a;
			return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, cats);
		case 3:
			var selName = sdType.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'selection',
						$elm$json$Json$Encode$string(selName))
					]));
		case 5:
			var selName = sdType.a;
			var ch = sdType.b;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'selection',
						$elm$json$Json$Encode$string(selName)),
						_Utils_Tuple2(
						'encoding',
						$elm$json$Json$Encode$string(
							$gicentre$elm_vegalite$VegaLite$channelLabel(ch)))
					]));
		case 4:
			var selName = sdType.a;
			var f = sdType.b;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'selection',
						$elm$json$Json$Encode$string(selName)),
						_Utils_Tuple2(
						'field',
						$elm$json$Json$Encode$string(f))
					]));
		case 7:
			return $elm$json$Json$Encode$string('unaggregated');
		default:
			var scDo = sdType.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'unionWith',
						$gicentre$elm_vegalite$VegaLite$scaleDomainSpec(scDo))
					]));
	}
};
var $gicentre$elm_vegalite$VegaLite$scaleLabel = function (sc) {
	switch (sc) {
		case 0:
			return 'linear';
		case 1:
			return 'pow';
		case 4:
			return 'symlog';
		case 2:
			return 'sqrt';
		case 3:
			return 'log';
		case 5:
			return 'time';
		case 6:
			return 'utc';
		case 7:
			return 'ordinal';
		case 8:
			return 'band';
		case 9:
			return 'point';
		case 10:
			return 'bin-ordinal';
		case 11:
			return 'quantile';
		case 12:
			return 'quantize';
		default:
			return 'threshold';
	}
};
var $gicentre$elm_vegalite$VegaLite$timeUnitLabel = function (tu) {
	switch (tu.$) {
		case 0:
			return 'year';
		case 1:
			return 'yearquarter';
		case 2:
			return 'yearquartermonth';
		case 3:
			return 'yearmonth';
		case 4:
			return 'yearmonthdate';
		case 5:
			return 'yearmonthdatehours';
		case 6:
			return 'yearmonthdatehoursminutes';
		case 7:
			return 'yearmonthdatehoursminutesseconds';
		case 8:
			return 'quarter';
		case 9:
			return 'quartermonth';
		case 10:
			return 'month';
		case 11:
			return 'monthdate';
		case 12:
			return 'monthdatehours';
		case 13:
			return 'date';
		case 14:
			return 'day';
		case 15:
			return 'hours';
		case 16:
			return 'hoursminutes';
		case 17:
			return 'hoursminutesseconds';
		case 18:
			return 'minutes';
		case 19:
			return 'minutesseconds';
		case 20:
			return 'seconds';
		case 21:
			return 'secondsmilliseconds';
		case 22:
			return 'milliseconds';
		default:
			return '';
	}
};
var $gicentre$elm_vegalite$VegaLite$timeUnitProperties = function (tUnit) {
	switch (tUnit.$) {
		case 23:
			var tu = tUnit.a;
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'utc',
					$elm$json$Json$Encode$bool(true)),
				$gicentre$elm_vegalite$VegaLite$timeUnitProperties(tu));
		case 24:
			var n = tUnit.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'maxbins',
					$elm$json$Json$Encode$int(n))
				]);
		case 25:
			var x = tUnit.a;
			var tu = tUnit.b;
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'step',
					$elm$json$Json$Encode$float(x)),
				$gicentre$elm_vegalite$VegaLite$timeUnitProperties(tu));
		default:
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'unit',
					$elm$json$Json$Encode$string(
						$gicentre$elm_vegalite$VegaLite$timeUnitLabel(tUnit)))
				]);
	}
};
var $gicentre$elm_vegalite$VegaLite$timeUnitSpec = function (tUnit) {
	return $elm$json$Json$Encode$object(
		$gicentre$elm_vegalite$VegaLite$timeUnitProperties(tUnit));
};
var $gicentre$elm_vegalite$VegaLite$scaleNiceSpec = function (ni) {
	switch (ni.$) {
		case 0:
			return $elm$json$Json$Encode$string('millisecond');
		case 1:
			return $elm$json$Json$Encode$string('second');
		case 2:
			return $elm$json$Json$Encode$string('minute');
		case 3:
			return $elm$json$Json$Encode$string('hour');
		case 4:
			return $elm$json$Json$Encode$string('day');
		case 5:
			return $elm$json$Json$Encode$string('week');
		case 6:
			return $elm$json$Json$Encode$string('month');
		case 7:
			return $elm$json$Json$Encode$string('year');
		case 10:
			var tu = ni.a;
			var step = ni.b;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'interval',
						$gicentre$elm_vegalite$VegaLite$timeUnitSpec(tu)),
						_Utils_Tuple2(
						'step',
						$elm$json$Json$Encode$int(step))
					]));
		case 8:
			return $elm$json$Json$Encode$bool(true);
		case 9:
			return $elm$json$Json$Encode$bool(false);
		default:
			var n = ni.a;
			return $elm$json$Json$Encode$int(n);
	}
};
var $gicentre$elm_vegalite$VegaLite$schemeProperty = F2(
	function (schName, extent) {
		if (!extent.b) {
			return _Utils_Tuple2(
				'scheme',
				$elm$json$Json$Encode$string(schName));
		} else {
			if (!extent.b.b) {
				var n = extent.a;
				return _Utils_Tuple2(
					'scheme',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'name',
								$elm$json$Json$Encode$string(schName)),
								_Utils_Tuple2(
								'count',
								$elm$json$Json$Encode$float(n))
							])));
			} else {
				if (!extent.b.b.b) {
					var mn = extent.a;
					var _v1 = extent.b;
					var mx = _v1.a;
					return _Utils_Tuple2(
						'scheme',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'name',
									$elm$json$Json$Encode$string(schName)),
									_Utils_Tuple2(
									'extent',
									A2(
										$elm$json$Json$Encode$list,
										$elm$json$Json$Encode$float,
										_List_fromArray(
											[mn, mx])))
								])));
				} else {
					return _Utils_Tuple2(
						'scheme',
						$elm$json$Json$Encode$string(schName));
				}
			}
		}
	});
var $gicentre$elm_vegalite$VegaLite$scaleProperty = function (scaleProp) {
	switch (scaleProp.$) {
		case 0:
			var sType = scaleProp.a;
			return _Utils_Tuple2(
				'type',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$scaleLabel(sType)));
		case 1:
			var sdType = scaleProp.a;
			return _Utils_Tuple2(
				'domain',
				$gicentre$elm_vegalite$VegaLite$scaleDomainSpec(sdType));
		case 2:
			var range = scaleProp.a;
			switch (range.$) {
				case 0:
					var xs = range.a;
					return _Utils_Tuple2(
						'range',
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, xs));
				case 2:
					var xss = range.a;
					return _Utils_Tuple2(
						'range',
						A2(
							$elm$json$Json$Encode$list,
							$elm$json$Json$Encode$list($elm$json$Json$Encode$float),
							xss));
				case 1:
					var ss = range.a;
					return _Utils_Tuple2(
						'range',
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, ss));
				default:
					var s = range.a;
					return _Utils_Tuple2(
						'range',
						$elm$json$Json$Encode$string(s));
			}
		case 3:
			var schName = scaleProp.a;
			var extent = scaleProp.b;
			return A2($gicentre$elm_vegalite$VegaLite$schemeProperty, schName, extent);
		case 4:
			var x = scaleProp.a;
			return _Utils_Tuple2(
				'align',
				$elm$json$Json$Encode$float(x));
		case 5:
			var x = scaleProp.a;
			return _Utils_Tuple2(
				'padding',
				$elm$json$Json$Encode$float(x));
		case 17:
			var x = scaleProp.a;
			return _Utils_Tuple2(
				'base',
				$elm$json$Json$Encode$float(x));
		case 14:
			var x = scaleProp.a;
			return _Utils_Tuple2(
				'exponent',
				$elm$json$Json$Encode$float(x));
		case 15:
			var x = scaleProp.a;
			return _Utils_Tuple2(
				'domainMid',
				$elm$json$Json$Encode$float(x));
		case 16:
			var x = scaleProp.a;
			return _Utils_Tuple2(
				'constant',
				$elm$json$Json$Encode$float(x));
		case 6:
			var x = scaleProp.a;
			return _Utils_Tuple2(
				'paddingInner',
				$elm$json$Json$Encode$float(x));
		case 7:
			var x = scaleProp.a;
			return _Utils_Tuple2(
				'paddingOuter',
				$elm$json$Json$Encode$float(x));
		case 8:
			var numOrNull = scaleProp.a;
			if (!numOrNull.$) {
				var x = numOrNull.a;
				return _Utils_Tuple2(
					'rangeStep',
					$elm$json$Json$Encode$float(x));
			} else {
				return _Utils_Tuple2('rangeStep', $elm$json$Json$Encode$null);
			}
		case 9:
			var b = scaleProp.a;
			return _Utils_Tuple2(
				'round',
				$elm$json$Json$Encode$bool(b));
		case 10:
			var b = scaleProp.a;
			return _Utils_Tuple2(
				'clamp',
				$elm$json$Json$Encode$bool(b));
		case 11:
			var interp = scaleProp.a;
			return _Utils_Tuple2(
				'interpolate',
				$gicentre$elm_vegalite$VegaLite$cInterpolateSpec(interp));
		case 12:
			var ni = scaleProp.a;
			return _Utils_Tuple2(
				'nice',
				$gicentre$elm_vegalite$VegaLite$scaleNiceSpec(ni));
		case 13:
			var b = scaleProp.a;
			return _Utils_Tuple2(
				'zero',
				$elm$json$Json$Encode$bool(b));
		default:
			var b = scaleProp.a;
			return _Utils_Tuple2(
				'reverse',
				$elm$json$Json$Encode$bool(b));
	}
};
var $gicentre$elm_vegalite$VegaLite$sortProperties = function (sp) {
	switch (sp.$) {
		case 0:
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'order',
					$elm$json$Json$Encode$string('ascending'))
				]);
		case 1:
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'order',
					$elm$json$Json$Encode$string('descending'))
				]);
		case 5:
			var ch = sp.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'encoding',
					$elm$json$Json$Encode$string(
						$gicentre$elm_vegalite$VegaLite$channelLabel(ch)))
				]);
		case 4:
			var field = sp.a;
			var op = sp.b;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(field)),
					_Utils_Tuple2(
					'op',
					$gicentre$elm_vegalite$VegaLite$operationSpec(op))
				]);
		case 3:
			var arr = sp.a;
			var op = sp.b;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'repeat',
								$elm$json$Json$Encode$string(
									$gicentre$elm_vegalite$VegaLite$arrangementLabel(arr)))
							]))),
					_Utils_Tuple2(
					'op',
					$gicentre$elm_vegalite$VegaLite$operationSpec(op))
				]);
		default:
			var dvs = sp.a;
			return _List_Nil;
	}
};
var $gicentre$elm_vegalite$VegaLite$booleanOpSpec = function (bo) {
	switch (bo.$) {
		case 0:
			var ex = bo.a;
			return $elm$json$Json$Encode$string(ex);
		case 1:
			var f = bo.a;
			return $gicentre$elm_vegalite$VegaLite$filterSpec(f);
		case 2:
			var tr = bo.a;
			var f = bo.b;
			return A2($gicentre$elm_vegalite$VegaLite$trFilterSpec, tr, f);
		case 4:
			var selName = bo.a;
			return $elm$json$Json$Encode$string(selName);
		case 3:
			var sel = bo.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'selection',
						$elm$json$Json$Encode$string(sel))
					]));
		case 5:
			var operand1 = bo.a;
			var operand2 = bo.b;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'and',
						A2(
							$elm$json$Json$Encode$list,
							$gicentre$elm_vegalite$VegaLite$booleanOpSpec,
							_List_fromArray(
								[operand1, operand2])))
					]));
		case 6:
			var operand1 = bo.a;
			var operand2 = bo.b;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'or',
						A2(
							$elm$json$Json$Encode$list,
							$gicentre$elm_vegalite$VegaLite$booleanOpSpec,
							_List_fromArray(
								[operand1, operand2])))
					]));
		default:
			var operand = bo.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'not',
						$gicentre$elm_vegalite$VegaLite$booleanOpSpec(operand))
					]));
	}
};
var $gicentre$elm_vegalite$VegaLite$filterSpec = function (f) {
	switch (f.$) {
		case 5:
			var ex = f.a;
			return $elm$json$Json$Encode$string(ex);
		case 6:
			var boolExpr = f.a;
			return $gicentre$elm_vegalite$VegaLite$booleanOpSpec(boolExpr);
		default:
			return $elm$json$Json$Encode$object(
				$gicentre$elm_vegalite$VegaLite$filterProperties(f));
	}
};
var $gicentre$elm_vegalite$VegaLite$markChannelProperties = function (field) {
	switch (field.$) {
		case 0:
			var s = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$string(s))
				]);
		case 1:
			var arr = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'field',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'repeat',
								$elm$json$Json$Encode$string(
									$gicentre$elm_vegalite$VegaLite$arrangementLabel(arr)))
							])))
				]);
		case 2:
			var t = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string(
						$gicentre$elm_vegalite$VegaLite$measurementLabel(t)))
				]);
		case 3:
			var sps = field.a;
			return _Utils_eq(sps, _List_Nil) ? _List_fromArray(
				[
					_Utils_Tuple2('scale', $elm$json$Json$Encode$null)
				]) : _List_fromArray(
				[
					_Utils_Tuple2(
					'scale',
					$elm$json$Json$Encode$object(
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$scaleProperty, sps)))
				]);
		case 10:
			var lps = field.a;
			return _Utils_eq(lps, _List_Nil) ? _List_fromArray(
				[
					_Utils_Tuple2('legend', $elm$json$Json$Encode$null)
				]) : _List_fromArray(
				[
					_Utils_Tuple2(
					'legend',
					$elm$json$Json$Encode$object(
						A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$legendProperty, lps)))
				]);
		case 4:
			var bps = field.a;
			return _List_fromArray(
				[
					$gicentre$elm_vegalite$VegaLite$bin(bps)
				]);
		case 6:
			var sps = field.a;
			_v2$4:
			while (true) {
				if (!sps.b) {
					return _List_fromArray(
						[
							_Utils_Tuple2('sort', $elm$json$Json$Encode$null)
						]);
				} else {
					if (!sps.b.b) {
						switch (sps.a.$) {
							case 0:
								var _v3 = sps.a;
								return _List_fromArray(
									[
										_Utils_Tuple2(
										'sort',
										$elm$json$Json$Encode$string('ascending'))
									]);
							case 1:
								var _v4 = sps.a;
								return _List_fromArray(
									[
										_Utils_Tuple2(
										'sort',
										$elm$json$Json$Encode$string('descending'))
									]);
							case 2:
								var dvs = sps.a.a;
								return _List_fromArray(
									[
										_Utils_Tuple2(
										'sort',
										$gicentre$elm_vegalite$VegaLite$toList(
											$gicentre$elm_vegalite$VegaLite$dataValuesSpecs(dvs)))
									]);
							default:
								break _v2$4;
						}
					} else {
						break _v2$4;
					}
				}
			}
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'sort',
					$elm$json$Json$Encode$object(
						A2($elm$core$List$concatMap, $gicentre$elm_vegalite$VegaLite$sortProperties, sps)))
				]);
		case 5:
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'bin',
					$elm$json$Json$Encode$string('binned'))
				]);
		case 11:
			var selName = field.a;
			var ifClause = field.b;
			var elseClause = field.c;
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'condition',
					$elm$json$Json$Encode$object(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								'selection',
								$gicentre$elm_vegalite$VegaLite$booleanOpSpec(selName)),
							A2($elm$core$List$concatMap, $gicentre$elm_vegalite$VegaLite$markChannelProperties, ifClause)))),
				A2($elm$core$List$concatMap, $gicentre$elm_vegalite$VegaLite$markChannelProperties, elseClause));
		case 12:
			var tests = field.a;
			var elseClause = field.b;
			var testClause = function (_v6) {
				var predicate = _v6.a;
				var ifClause = _v6.b;
				return $elm$json$Json$Encode$object(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							'test',
							$gicentre$elm_vegalite$VegaLite$booleanOpSpec(predicate)),
						A2($elm$core$List$concatMap, $gicentre$elm_vegalite$VegaLite$markChannelProperties, ifClause)));
			};
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'condition',
					function () {
						if (tests.b && (!tests.b.b)) {
							var test = tests.a;
							return testClause(test);
						} else {
							return A2($elm$json$Json$Encode$list, testClause, tests);
						}
					}()),
				A2($elm$core$List$concatMap, $gicentre$elm_vegalite$VegaLite$markChannelProperties, elseClause));
		case 7:
			var tu = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'timeUnit',
					$gicentre$elm_vegalite$VegaLite$timeUnitSpec(tu))
				]);
		case 8:
			var t = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'title',
					$gicentre$elm_vegalite$VegaLite$multilineTextSpec(t))
				]);
		case 9:
			var op = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'aggregate',
					$gicentre$elm_vegalite$VegaLite$operationSpec(op))
				]);
		case 13:
			var s = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'value',
					$elm$json$Json$Encode$string(s))
				]);
		case 14:
			var x = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'value',
					$elm$json$Json$Encode$float(x))
				]);
		case 15:
			var s = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'value',
					$elm$json$Json$Encode$string(s))
				]);
		default:
			var b = field.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'value',
					$elm$json$Json$Encode$bool(b))
				]);
	}
};
var $gicentre$elm_vegalite$VegaLite$trFilterSpec = F2(
	function (mc, f) {
		switch (f.$) {
			case 5:
				var ex = f.a;
				return $elm$json$Json$Encode$string(ex);
			case 6:
				var boolExpr = f.a;
				return $gicentre$elm_vegalite$VegaLite$booleanOpSpec(boolExpr);
			default:
				return $elm$json$Json$Encode$object(
					_Utils_ap(
						$gicentre$elm_vegalite$VegaLite$markChannelProperties(mc),
						$gicentre$elm_vegalite$VegaLite$filterProperties(f)));
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $gicentre$elm_vegalite$VegaLite$sideLabel = function (side) {
	switch (side) {
		case 0:
			return 'top';
		case 1:
			return 'bottom';
		case 2:
			return 'left';
		default:
			return 'right';
	}
};
var $gicentre$elm_vegalite$VegaLite$axisProperty = function (axisProp) {
	switch (axisProp.$) {
		case 0:
			var n = axisProp.a;
			return _Utils_Tuple2(
				'bandPosition',
				$elm$json$Json$Encode$float(n));
		case 69:
			var predicate = axisProp.a;
			var cap = axisProp.b;
			var _v1 = function () {
				switch (cap.$) {
					case 0:
						var ha1 = cap.a;
						var ha2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelAlign(ha1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelAlign(ha2)));
					case 1:
						var va1 = cap.a;
						var va2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelBaseline(va1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelBaseline(va2)));
					case 2:
						var c1 = cap.a;
						var c2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelColor(c1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelColor(c2)));
					case 3:
						var f1 = cap.a;
						var f2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelFont(f1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelFont(f2)));
					case 4:
						var s1 = cap.a;
						var s2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelFontSize(s1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelFontSize(s2)));
					case 5:
						var s1 = cap.a;
						var s2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelFontStyle(s1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelFontStyle(s2)));
					case 6:
						var w1 = cap.a;
						var w2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelFontWeight(w1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelFontWeight(w2)));
					case 7:
						var o1 = cap.a;
						var o2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelOffset(o1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelOffset(o2)));
					case 8:
						var o1 = cap.a;
						var o2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelOpacity(o1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelOpacity(o2)));
					case 9:
						var p1 = cap.a;
						var p2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelPadding(p1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxLabelPadding(p2)));
					case 10:
						var c1 = cap.a;
						var c2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickColor(c1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickColor(c2)));
					case 11:
						var d1 = cap.a;
						var d2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickDash(d1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickDash(d2)));
					case 12:
						var o1 = cap.a;
						var o2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickOpacity(o1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickOpacity(o2)));
					case 17:
						var s1 = cap.a;
						var s2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickSize(s1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickSize(s2)));
					case 13:
						var w1 = cap.a;
						var w2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickWidth(w1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxTickWidth(w2)));
					case 14:
						var c1 = cap.a;
						var c2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxGridColor(c1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxGridColor(c2)));
					case 15:
						var d1 = cap.a;
						var d2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxGridDash(d1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxGridDash(d2)));
					case 16:
						var o1 = cap.a;
						var o2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxGridOpacity(o1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxGridOpacity(o2)));
					default:
						var w1 = cap.a;
						var w2 = cap.b;
						return _Utils_Tuple2(
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxGridWidth(w1)),
							$gicentre$elm_vegalite$VegaLite$axisProperty(
								$gicentre$elm_vegalite$VegaLite$AxGridWidth(w2)));
				}
			}();
			var ifProp = _v1.a;
			var elseProp = _v1.b;
			return _Utils_Tuple2(
				ifProp.a,
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'condition',
							$elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'test',
										$gicentre$elm_vegalite$VegaLite$booleanOpSpec(predicate)),
										_Utils_Tuple2('value', ifProp.b)
									]))),
							_Utils_Tuple2('value', elseProp.b)
						])));
		case 11:
			var fmt = axisProp.a;
			return _Utils_Tuple2(
				'format',
				$elm$json$Json$Encode$string(fmt));
		case 12:
			return _Utils_Tuple2(
				'formatType',
				$elm$json$Json$Encode$string('number'));
		case 13:
			return _Utils_Tuple2(
				'formatType',
				$elm$json$Json$Encode$string('time'));
		case 14:
			var formatter = axisProp.a;
			return _Utils_Tuple2(
				'formatType',
				$elm$json$Json$Encode$string(formatter));
		case 64:
			var c = axisProp.a;
			return _Utils_Tuple2(
				'gridColor',
				$elm$json$Json$Encode$string(c));
		case 65:
			var ds = axisProp.a;
			return _Utils_eq(ds, _List_Nil) ? _Utils_Tuple2('gridDash', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'gridDash',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, ds));
		case 66:
			var o = axisProp.a;
			return _Utils_Tuple2(
				'gridOpacity',
				$elm$json$Json$Encode$float(o));
		case 67:
			var w = axisProp.a;
			return _Utils_Tuple2(
				'gridWidth',
				$elm$json$Json$Encode$float(w));
		case 15:
			var b = axisProp.a;
			return _Utils_Tuple2(
				'labels',
				$elm$json$Json$Encode$bool(b));
		case 16:
			var ha = axisProp.a;
			return _Utils_Tuple2(
				'labelAlign',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$hAlignLabel(ha)));
		case 18:
			var va = axisProp.a;
			return _Utils_Tuple2(
				'labelBaseline',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$vAlignLabel(va)));
		case 19:
			var mn = axisProp.a;
			if (!mn.$) {
				var n = mn.a;
				return (n === 1) ? _Utils_Tuple2(
					'labelBound',
					$elm$json$Json$Encode$bool(true)) : _Utils_Tuple2(
					'labelBound',
					$elm$json$Json$Encode$float(n));
			} else {
				return _Utils_Tuple2(
					'labelBound',
					$elm$json$Json$Encode$bool(false));
			}
		case 17:
			var angle = axisProp.a;
			return _Utils_Tuple2(
				'labelAngle',
				$elm$json$Json$Encode$float(angle));
		case 20:
			var s = axisProp.a;
			return _Utils_Tuple2(
				'labelColor',
				$elm$json$Json$Encode$string(s));
		case 21:
			var ex = axisProp.a;
			return _Utils_Tuple2(
				'labelExpr',
				$elm$json$Json$Encode$string(ex));
		case 22:
			var mn = axisProp.a;
			if (!mn.$) {
				var n = mn.a;
				return (n === 1) ? _Utils_Tuple2(
					'labelFlush',
					$elm$json$Json$Encode$bool(true)) : _Utils_Tuple2(
					'labelFlush',
					$elm$json$Json$Encode$float(n));
			} else {
				return _Utils_Tuple2(
					'labelFlush',
					$elm$json$Json$Encode$bool(false));
			}
		case 23:
			var n = axisProp.a;
			return _Utils_Tuple2(
				'labelFlushOffset',
				$elm$json$Json$Encode$float(n));
		case 24:
			var s = axisProp.a;
			return _Utils_Tuple2(
				'labelFont',
				$elm$json$Json$Encode$string(s));
		case 25:
			var n = axisProp.a;
			return _Utils_Tuple2(
				'labelFontSize',
				$elm$json$Json$Encode$float(n));
		case 26:
			var s = axisProp.a;
			return _Utils_Tuple2(
				'labelFontStyle',
				$elm$json$Json$Encode$string(s));
		case 27:
			var fw = axisProp.a;
			return _Utils_Tuple2(
				'labelFontWeight',
				$gicentre$elm_vegalite$VegaLite$fontWeightSpec(fw));
		case 29:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'labelLimit',
				$elm$json$Json$Encode$float(x));
		case 28:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'labelLineHeight',
				$elm$json$Json$Encode$float(x));
		case 30:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'labelOffset',
				$elm$json$Json$Encode$float(x));
		case 31:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'labelOpacity',
				$elm$json$Json$Encode$float(x));
		case 32:
			var strat = axisProp.a;
			return _Utils_Tuple2(
				'labelOverlap',
				$gicentre$elm_vegalite$VegaLite$overlapStrategySpec(strat));
		case 33:
			var pad = axisProp.a;
			return _Utils_Tuple2(
				'labelPadding',
				$elm$json$Json$Encode$float(pad));
		case 34:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'labelSeparation',
				$elm$json$Json$Encode$float(x));
		case 7:
			var b = axisProp.a;
			return _Utils_Tuple2(
				'domain',
				$elm$json$Json$Encode$bool(b));
		case 8:
			var c = axisProp.a;
			return _Utils_Tuple2(
				'domainColor',
				$elm$json$Json$Encode$string(c));
		case 9:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'domainOpacity',
				$elm$json$Json$Encode$float(x));
		case 10:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'domainWidth',
				$elm$json$Json$Encode$float(x));
		case 63:
			var b = axisProp.a;
			return _Utils_Tuple2(
				'grid',
				$elm$json$Json$Encode$bool(b));
		case 1:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'maxExtent',
				$elm$json$Json$Encode$float(x));
		case 2:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'minExtent',
				$elm$json$Json$Encode$float(x));
		case 3:
			var side = axisProp.a;
			return _Utils_Tuple2(
				'orient',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$sideLabel(side)));
		case 4:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'offset',
				$elm$json$Json$Encode$float(x));
		case 5:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'position',
				$elm$json$Json$Encode$float(x));
		case 35:
			var ss = axisProp.a;
			if (ss.b && (!ss.b.b)) {
				var s = ss.a;
				return _Utils_Tuple2(
					'style',
					$elm$json$Json$Encode$string(s));
			} else {
				return _Utils_Tuple2(
					'style',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, ss));
			}
		case 6:
			var n = axisProp.a;
			return _Utils_Tuple2(
				'zindex',
				$elm$json$Json$Encode$int(n));
		case 43:
			var b = axisProp.a;
			return _Utils_Tuple2(
				'ticks',
				$elm$json$Json$Encode$bool(b));
		case 36:
			var s = axisProp.a;
			return _Utils_Tuple2(
				'tickColor',
				$elm$json$Json$Encode$string(s));
		case 37:
			var n = axisProp.a;
			return _Utils_Tuple2(
				'tickCount',
				$elm$json$Json$Encode$int(n));
		case 38:
			var ds = axisProp.a;
			return _Utils_eq(ds, _List_Nil) ? _Utils_Tuple2('tickDash', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'tickDash',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, ds));
		case 39:
			var b = axisProp.a;
			return _Utils_Tuple2(
				'tickExtra',
				$elm$json$Json$Encode$bool(b));
		case 40:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'tickOffset',
				$elm$json$Json$Encode$float(x));
		case 41:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'tickOpacity',
				$elm$json$Json$Encode$float(x));
		case 42:
			var b = axisProp.a;
			return _Utils_Tuple2(
				'tickRound',
				$elm$json$Json$Encode$bool(b));
		case 68:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'tickMinStep',
				$elm$json$Json$Encode$float(x));
		case 44:
			var sz = axisProp.a;
			return _Utils_Tuple2(
				'tickSize',
				$elm$json$Json$Encode$float(sz));
		case 45:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'tickWidth',
				$elm$json$Json$Encode$float(x));
		case 47:
			var vals = axisProp.a;
			return _Utils_Tuple2(
				'values',
				$gicentre$elm_vegalite$VegaLite$toList(
					$gicentre$elm_vegalite$VegaLite$dataValuesSpecs(vals)));
		case 46:
			var dtss = axisProp.a;
			return _Utils_Tuple2(
				'values',
				A2(
					$elm$json$Json$Encode$list,
					function (ds) {
						return $elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$dateTimeProperty, ds));
					},
					dtss));
		case 48:
			var s = axisProp.a;
			return _Utils_Tuple2(
				'title',
				$gicentre$elm_vegalite$VegaLite$multilineTextSpec(s));
		case 49:
			var al = axisProp.a;
			return _Utils_Tuple2(
				'titleAlign',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$hAlignLabel(al)));
		case 51:
			var angle = axisProp.a;
			return _Utils_Tuple2(
				'titleAngle',
				$elm$json$Json$Encode$float(angle));
		case 50:
			var an = axisProp.a;
			return _Utils_Tuple2(
				'titleAnchor',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$anchorLabel(an)));
		case 52:
			var va = axisProp.a;
			return _Utils_Tuple2(
				'titleBaseline',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$vAlignLabel(va)));
		case 53:
			var s = axisProp.a;
			return _Utils_Tuple2(
				'titleColor',
				$elm$json$Json$Encode$string(s));
		case 54:
			var s = axisProp.a;
			return _Utils_Tuple2(
				'titleFont',
				$elm$json$Json$Encode$string(s));
		case 55:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'titleFontSize',
				$elm$json$Json$Encode$float(x));
		case 56:
			var s = axisProp.a;
			return _Utils_Tuple2(
				'titleFontStyle',
				$elm$json$Json$Encode$string(s));
		case 57:
			var fw = axisProp.a;
			return _Utils_Tuple2(
				'titleFontWeight',
				$gicentre$elm_vegalite$VegaLite$fontWeightSpec(fw));
		case 58:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'titleLimit',
				$elm$json$Json$Encode$float(x));
		case 59:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'titleOpacity',
				$elm$json$Json$Encode$float(x));
		case 60:
			var pad = axisProp.a;
			return _Utils_Tuple2(
				'titlePadding',
				$elm$json$Json$Encode$float(pad));
		case 61:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'titleX',
				$elm$json$Json$Encode$float(x));
		default:
			var x = axisProp.a;
			return _Utils_Tuple2(
				'titleY',
				$elm$json$Json$Encode$float(x));
	}
};
var $gicentre$elm_vegalite$VegaLite$imMethodLabel = function (method) {
	switch (method) {
		case 0:
			return 'value';
		case 1:
			return 'mean';
		case 2:
			return 'median';
		case 3:
			return 'max';
		default:
			return 'min';
	}
};
var $gicentre$elm_vegalite$VegaLite$imputeProperty = function (ip) {
	switch (ip.$) {
		case 0:
			if (!ip.a.$) {
				if (!ip.b.$) {
					var n1 = ip.a.a;
					var n2 = ip.b.a;
					return _Utils_Tuple2(
						'frame',
						A2(
							$elm$json$Json$Encode$list,
							$elm$json$Json$Encode$int,
							_List_fromArray(
								[n1, n2])));
				} else {
					var n1 = ip.a.a;
					var _v2 = ip.b;
					return _Utils_Tuple2(
						'frame',
						$gicentre$elm_vegalite$VegaLite$toList(
							_List_fromArray(
								[
									$elm$json$Json$Encode$int(n1),
									$elm$json$Json$Encode$null
								])));
				}
			} else {
				if (!ip.b.$) {
					var _v1 = ip.a;
					var n2 = ip.b.a;
					return _Utils_Tuple2(
						'frame',
						$gicentre$elm_vegalite$VegaLite$toList(
							_List_fromArray(
								[
									$elm$json$Json$Encode$null,
									$elm$json$Json$Encode$int(n2)
								])));
				} else {
					var _v3 = ip.a;
					var _v4 = ip.b;
					return _Utils_Tuple2(
						'frame',
						$gicentre$elm_vegalite$VegaLite$toList(
							_List_fromArray(
								[$elm$json$Json$Encode$null, $elm$json$Json$Encode$null])));
				}
			}
		case 1:
			var dVals = ip.a;
			return _Utils_Tuple2(
				'keyvals',
				$gicentre$elm_vegalite$VegaLite$toList(
					$gicentre$elm_vegalite$VegaLite$dataValuesSpecs(dVals)));
		case 2:
			var start = ip.a;
			var stop = ip.b;
			var step = ip.c;
			return _Utils_Tuple2(
				'keyvals',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'start',
							$elm$json$Json$Encode$float(start)),
							_Utils_Tuple2(
							'stop',
							$elm$json$Json$Encode$float(stop)),
							_Utils_Tuple2(
							'step',
							$elm$json$Json$Encode$float(step))
						])));
		case 3:
			var method = ip.a;
			return _Utils_Tuple2(
				'method',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$imMethodLabel(method)));
		case 5:
			var dVal = ip.a;
			return _Utils_Tuple2(
				'value',
				$gicentre$elm_vegalite$VegaLite$dataValueSpec(dVal));
		default:
			var fields = ip.a;
			return _Utils_Tuple2(
				'groupby',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, fields));
	}
};
var $gicentre$elm_vegalite$VegaLite$stackOffsetSpec = function (sp) {
	switch (sp) {
		case 0:
			return $elm$json$Json$Encode$string('zero');
		case 1:
			return $elm$json$Json$Encode$string('normalize');
		case 2:
			return $elm$json$Json$Encode$string('center');
		default:
			return $elm$json$Json$Encode$null;
	}
};
var $gicentre$elm_vegalite$VegaLite$stackOffsetProperty = function (offset) {
	return _Utils_Tuple2(
		'stack',
		$gicentre$elm_vegalite$VegaLite$stackOffsetSpec(offset));
};
var $gicentre$elm_vegalite$VegaLite$positionChannelProperty = function (pDef) {
	switch (pDef.$) {
		case 0:
			var s = pDef.a;
			return _Utils_Tuple2(
				'field',
				$elm$json$Json$Encode$string(s));
		case 5:
			var measure = pDef.a;
			return _Utils_Tuple2(
				'type',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$measurementLabel(measure)));
		case 6:
			var bps = pDef.a;
			return $gicentre$elm_vegalite$VegaLite$bin(bps);
		case 7:
			return _Utils_Tuple2(
				'bin',
				$elm$json$Json$Encode$string('binned'));
		case 10:
			var op = pDef.a;
			return _Utils_Tuple2(
				'aggregate',
				$gicentre$elm_vegalite$VegaLite$operationSpec(op));
		case 8:
			var tu = pDef.a;
			return _Utils_Tuple2(
				'timeUnit',
				$gicentre$elm_vegalite$VegaLite$timeUnitSpec(tu));
		case 9:
			var t = pDef.a;
			return _Utils_Tuple2(
				'title',
				$gicentre$elm_vegalite$VegaLite$multilineTextSpec(t));
		case 13:
			var sps = pDef.a;
			_v1$4:
			while (true) {
				if (!sps.b) {
					return _Utils_Tuple2('sort', $elm$json$Json$Encode$null);
				} else {
					if (!sps.b.b) {
						switch (sps.a.$) {
							case 0:
								var _v2 = sps.a;
								return _Utils_Tuple2(
									'sort',
									$elm$json$Json$Encode$string('ascending'));
							case 1:
								var _v3 = sps.a;
								return _Utils_Tuple2(
									'sort',
									$elm$json$Json$Encode$string('descending'));
							case 2:
								var dvs = sps.a.a;
								return _Utils_Tuple2(
									'sort',
									$gicentre$elm_vegalite$VegaLite$toList(
										$gicentre$elm_vegalite$VegaLite$dataValuesSpecs(dvs)));
							default:
								break _v1$4;
						}
					} else {
						break _v1$4;
					}
				}
			}
			return _Utils_Tuple2(
				'sort',
				$elm$json$Json$Encode$object(
					A2($elm$core$List$concatMap, $gicentre$elm_vegalite$VegaLite$sortProperties, sps)));
		case 14:
			var x = pDef.a;
			return _Utils_Tuple2(
				'band',
				$elm$json$Json$Encode$float(x));
		case 11:
			var sps = pDef.a;
			return _Utils_eq(sps, _List_Nil) ? _Utils_Tuple2('scale', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'scale',
				$elm$json$Json$Encode$object(
					A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$scaleProperty, sps)));
		case 12:
			var aps = pDef.a;
			return _Utils_eq(aps, _List_Nil) ? _Utils_Tuple2('axis', $elm$json$Json$Encode$null) : _Utils_Tuple2(
				'axis',
				$elm$json$Json$Encode$object(
					A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$axisProperty, aps)));
		case 15:
			var so = pDef.a;
			return $gicentre$elm_vegalite$VegaLite$stackOffsetProperty(so);
		case 4:
			var arr = pDef.a;
			return _Utils_Tuple2(
				'field',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'repeat',
							$elm$json$Json$Encode$string(
								$gicentre$elm_vegalite$VegaLite$arrangementLabel(arr)))
						])));
		case 1:
			return _Utils_Tuple2(
				'value',
				$elm$json$Json$Encode$string('width'));
		case 2:
			return _Utils_Tuple2(
				'value',
				$elm$json$Json$Encode$string('height'));
		case 3:
			var x = pDef.a;
			return _Utils_Tuple2(
				'value',
				$elm$json$Json$Encode$float(x));
		default:
			var ips = pDef.a;
			return _Utils_Tuple2(
				'impute',
				$elm$json$Json$Encode$object(
					A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$imputeProperty, ips)));
	}
};
var $gicentre$elm_vegalite$VegaLite$positionLabel = function (pChannel) {
	switch (pChannel) {
		case 0:
			return 'x';
		case 1:
			return 'y';
		case 2:
			return 'x2';
		case 3:
			return 'y2';
		case 8:
			return 'xError';
		case 9:
			return 'yError';
		case 10:
			return 'xError2';
		case 11:
			return 'yError2';
		case 4:
			return 'longitude';
		case 5:
			return 'latitude';
		case 6:
			return 'longitude2';
		default:
			return 'latitude2';
	}
};
var $gicentre$elm_vegalite$VegaLite$position = F2(
	function (pos, pDefs) {
		var isNotPmType = function (pp) {
			if (pp.$ === 5) {
				var t = pp.a;
				return false;
			} else {
				return true;
			}
		};
		switch (pos) {
			case 0:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(0),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 1:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(1),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 2:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(2),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 3:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(3),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 8:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(8),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 9:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(9),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 10:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(10),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 11:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(11),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 4:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(4),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 5:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(5),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			case 6:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(6),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
			default:
				return $elm$core$List$cons(
					_Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$positionLabel(7),
						$elm$json$Json$Encode$object(
							A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$positionChannelProperty, pDefs))));
		}
	});
var $gicentre$elm_vegalite$VegaLite$Str = function (a) {
	return {$: 3, a: a};
};
var $gicentre$elm_vegalite$VegaLite$str = $gicentre$elm_vegalite$VegaLite$Str;
var $gicentre$elm_vegalite$VegaLite$VLTitle = 2;
var $gicentre$elm_vegalite$VegaLite$tfLabel = function (tf) {
	if (tf === 1) {
		return 'group';
	} else {
		return 'bounds';
	}
};
var $gicentre$elm_vegalite$VegaLite$titleConfigProperty = function (titleCfg) {
	switch (titleCfg.$) {
		case 0:
			var an = titleCfg.a;
			return _Utils_Tuple2(
				'anchor',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$anchorLabel(an)));
		case 1:
			var x = titleCfg.a;
			return _Utils_Tuple2(
				'angle',
				$elm$json$Json$Encode$float(x));
		case 2:
			var va = titleCfg.a;
			return _Utils_Tuple2(
				'baseline',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$vAlignLabel(va)));
		case 3:
			var clr = titleCfg.a;
			return _Utils_Tuple2(
				'color',
				$elm$json$Json$Encode$string(clr));
		case 4:
			var fnt = titleCfg.a;
			return _Utils_Tuple2(
				'font',
				$elm$json$Json$Encode$string(fnt));
		case 5:
			var x = titleCfg.a;
			return _Utils_Tuple2(
				'fontSize',
				$elm$json$Json$Encode$float(x));
		case 6:
			var s = titleCfg.a;
			return _Utils_Tuple2(
				'fontStyle',
				$elm$json$Json$Encode$string(s));
		case 8:
			var tf = titleCfg.a;
			return _Utils_Tuple2(
				'frame',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$tfLabel(tf)));
		case 7:
			var w = titleCfg.a;
			return _Utils_Tuple2(
				'fontWeight',
				$gicentre$elm_vegalite$VegaLite$fontWeightSpec(w));
		case 10:
			var x = titleCfg.a;
			return _Utils_Tuple2(
				'limit',
				$elm$json$Json$Encode$float(x));
		case 9:
			var x = titleCfg.a;
			return _Utils_Tuple2(
				'lineHeight',
				$elm$json$Json$Encode$float(x));
		case 11:
			var x = titleCfg.a;
			return _Utils_Tuple2(
				'offset',
				$elm$json$Json$Encode$float(x));
		case 12:
			var sd = titleCfg.a;
			return _Utils_Tuple2(
				'orient',
				$elm$json$Json$Encode$string(
					$gicentre$elm_vegalite$VegaLite$sideLabel(sd)));
		case 13:
			var ss = titleCfg.a;
			if (ss.b && (!ss.b.b)) {
				var s = ss.a;
				return _Utils_Tuple2(
					'style',
					$elm$json$Json$Encode$string(s));
			} else {
				return _Utils_Tuple2(
					'style',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, ss));
			}
		case 14:
			var s = titleCfg.a;
			return _Utils_Tuple2(
				'subtitle',
				$gicentre$elm_vegalite$VegaLite$multilineTextSpec(s));
		case 15:
			var s = titleCfg.a;
			return _Utils_Tuple2(
				'subtitleColor',
				$elm$json$Json$Encode$string(s));
		case 16:
			var s = titleCfg.a;
			return _Utils_Tuple2(
				'subtitleFont',
				$elm$json$Json$Encode$string(s));
		case 17:
			var x = titleCfg.a;
			return _Utils_Tuple2(
				'subtitleFontSize',
				$elm$json$Json$Encode$float(x));
		case 18:
			var s = titleCfg.a;
			return _Utils_Tuple2(
				'subtitleFontStyle',
				$elm$json$Json$Encode$string(s));
		case 19:
			var w = titleCfg.a;
			return _Utils_Tuple2(
				'subtitleFontWeight',
				$gicentre$elm_vegalite$VegaLite$fontWeightSpec(w));
		case 20:
			var x = titleCfg.a;
			return _Utils_Tuple2(
				'subtitleLineHeight',
				$elm$json$Json$Encode$float(x));
		case 21:
			var x = titleCfg.a;
			return _Utils_Tuple2(
				'subtitlePadding',
				$elm$json$Json$Encode$float(x));
		default:
			var n = titleCfg.a;
			return _Utils_Tuple2(
				'zindex',
				$elm$json$Json$Encode$int(n));
	}
};
var $gicentre$elm_vegalite$VegaLite$title = F2(
	function (txt, tps) {
		return _Utils_Tuple2(
			2,
			$elm$json$Json$Encode$object(
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						'text',
						$gicentre$elm_vegalite$VegaLite$multilineTextSpec(txt)),
					A2($elm$core$List$map, $gicentre$elm_vegalite$VegaLite$titleConfigProperty, tps))));
	});
var $gicentre$elm_vegalite$VegaLite$vlPropertyLabel = function (spec) {
	switch (spec) {
		case 0:
			return 'name';
		case 1:
			return 'description';
		case 2:
			return 'title';
		case 3:
			return 'width';
		case 5:
			return 'width';
		case 4:
			return 'height';
		case 6:
			return 'height';
		case 8:
			return 'padding';
		case 7:
			return 'autosize';
		case 9:
			return 'background';
		case 10:
			return 'data';
		case 11:
			return 'datasets';
		case 14:
			return 'projection';
		case 12:
			return 'mark';
		case 13:
			return 'transform';
		case 15:
			return 'encoding';
		case 29:
			return 'config';
		case 30:
			return 'selection';
		case 17:
			return 'concat';
		case 20:
			return 'columns';
		case 18:
			return 'hconcat';
		case 19:
			return 'vconcat';
		case 16:
			return 'layer';
		case 21:
			return 'repeat';
		case 22:
			return 'facet';
		case 25:
			return 'spacing';
		case 26:
			return 'align';
		case 27:
			return 'bounds';
		case 28:
			return 'center';
		case 23:
			return 'spec';
		case 24:
			return 'resolve';
		default:
			return 'view';
	}
};
var $gicentre$elm_vegalite$VegaLite$toVegaLite = function (spec) {
	return $elm$json$Json$Encode$object(
		A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'$schema',
				$elm$json$Json$Encode$string('https://vega.github.io/schema/vega-lite/v4.json')),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var s = _v0.a;
					var v = _v0.b;
					return _Utils_Tuple2(
						$gicentre$elm_vegalite$VegaLite$vlPropertyLabel(s),
						v);
				},
				spec)));
};
var $author$project$Visualization$outagesCountsPerNodeVisualization = function (outagesPerNode) {
	var outagesPerNodeList = A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, acc) {
				var nodeId = _v0.a;
				var numOutages = _v0.b;
				return A2(
					$gicentre$elm_vegalite$VegaLite$dataRow,
					_List_fromArray(
						[
							_Utils_Tuple2(
							'node id',
							$gicentre$elm_vegalite$VegaLite$str(nodeId)),
							_Utils_Tuple2(
							'outages count',
							$gicentre$elm_vegalite$VegaLite$num(numOutages))
						]),
					acc);
			}),
		_List_Nil,
		$elm$core$Dict$toList(outagesPerNode));
	var enc = A2(
		$elm$core$Basics$composeL,
		A2(
			$elm$core$Basics$composeL,
			$gicentre$elm_vegalite$VegaLite$encoding,
			A2(
				$gicentre$elm_vegalite$VegaLite$position,
				0,
				_List_fromArray(
					[
						$gicentre$elm_vegalite$VegaLite$pName('node id'),
						$gicentre$elm_vegalite$VegaLite$pOrdinal
					]))),
		A2(
			$gicentre$elm_vegalite$VegaLite$position,
			1,
			_List_fromArray(
				[
					$gicentre$elm_vegalite$VegaLite$pName('outages count'),
					$gicentre$elm_vegalite$VegaLite$pQuant
				])));
	var data = A2($gicentre$elm_vegalite$VegaLite$dataFromRows, _List_Nil, outagesPerNodeList);
	return $gicentre$elm_vegalite$VegaLite$toVegaLite(
		_List_fromArray(
			[
				A2($gicentre$elm_vegalite$VegaLite$title, 'Number of outages per node', _List_Nil),
				data,
				enc(_List_Nil),
				$gicentre$elm_vegalite$VegaLite$bar(_List_Nil)
			]));
};
var $gicentre$elm_vegalite$VegaLite$Sum = {$: 17};
var $gicentre$elm_vegalite$VegaLite$opSum = $gicentre$elm_vegalite$VegaLite$Sum;
var $gicentre$elm_vegalite$VegaLite$PAggregate = function (a) {
	return {$: 10, a: a};
};
var $gicentre$elm_vegalite$VegaLite$pAggregate = $gicentre$elm_vegalite$VegaLite$PAggregate;
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $author$project$Visualization$outagesLenghtsPerNodeVisualization = function (outages) {
	var outagesPerNodeList = A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, acc) {
				var affectedNodeId = _v0.aK;
				var duration = _v0.aR;
				return A2(
					$gicentre$elm_vegalite$VegaLite$dataRow,
					_List_fromArray(
						[
							_Utils_Tuple2(
							'node id',
							$gicentre$elm_vegalite$VegaLite$str(affectedNodeId)),
							_Utils_Tuple2(
							'outage duration',
							$gicentre$elm_vegalite$VegaLite$num(
								($elm$time$Time$posixToMillis(duration) / 1000) | 0))
						]),
					acc);
			}),
		_List_Nil,
		outages);
	var enc = A2(
		$elm$core$Basics$composeL,
		A2(
			$elm$core$Basics$composeL,
			$gicentre$elm_vegalite$VegaLite$encoding,
			A2(
				$gicentre$elm_vegalite$VegaLite$position,
				0,
				_List_fromArray(
					[
						$gicentre$elm_vegalite$VegaLite$pName('node id'),
						$gicentre$elm_vegalite$VegaLite$pOrdinal
					]))),
		A2(
			$gicentre$elm_vegalite$VegaLite$position,
			1,
			_List_fromArray(
				[
					$gicentre$elm_vegalite$VegaLite$pName('outage duration'),
					$gicentre$elm_vegalite$VegaLite$pAggregate($gicentre$elm_vegalite$VegaLite$opSum),
					$gicentre$elm_vegalite$VegaLite$pQuant
				])));
	var data = A2($gicentre$elm_vegalite$VegaLite$dataFromRows, _List_Nil, outagesPerNodeList);
	return $gicentre$elm_vegalite$VegaLite$toVegaLite(
		_List_fromArray(
			[
				A2($gicentre$elm_vegalite$VegaLite$title, 'Outage duration per node (in seconds)', _List_Nil),
				data,
				enc(_List_Nil),
				$gicentre$elm_vegalite$VegaLite$bar(_List_Nil)
			]));
};
var $author$project$Visualization$allSummaryVisualizations = F2(
	function (outages, outagesPerNode) {
		return $gicentre$elm_vegalite$VegaLite$combineSpecs(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'outages-counts-summary',
					$author$project$Visualization$outagesCountsPerNodeVisualization(outagesPerNode)),
					_Utils_Tuple2(
					'outages-lengths-summary',
					$author$project$Visualization$outagesLenghtsPerNodeVisualization(outages))
				]));
	});
var $elm$core$Basics$compare = _Utils_compare;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$dayToInt = function (_v0) {
	var day = _v0;
	return day;
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$compareDays = F2(
	function (lhs, rhs) {
		return A2(
			$elm$core$Basics$compare,
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$dayToInt(lhs),
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$dayToInt(rhs));
	});
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$monthToInt = function (month) {
	switch (month) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		case 8:
			return 9;
		case 9:
			return 10;
		case 10:
			return 11;
		default:
			return 12;
	}
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$compareMonths = F2(
	function (lhs, rhs) {
		return A2(
			$elm$core$Basics$compare,
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$monthToInt(lhs),
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$monthToInt(rhs));
	});
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$yearToInt = function (_v0) {
	var year = _v0;
	return year;
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$compareYears = F2(
	function (lhs, rhs) {
		return A2(
			$elm$core$Basics$compare,
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$yearToInt(lhs),
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$yearToInt(rhs));
	});
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getDay = function (_v0) {
	var date = _v0;
	return date.aP;
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getMonth = function (_v0) {
	var month = _v0.a$;
	return month;
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getYear = function (_v0) {
	var year = _v0.bc;
	return year;
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$compare = F2(
	function (lhs, rhs) {
		var _v0 = _Utils_Tuple3(
			A2(
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$compareYears,
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getYear(lhs),
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getYear(rhs)),
			A2(
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$compareMonths,
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getMonth(lhs),
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getMonth(rhs)),
			A2(
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$compareDays,
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getDay(lhs),
				$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getDay(rhs)));
		var yearsComparison = _v0.a;
		var monthsComparison = _v0.b;
		var daysComparison = _v0.c;
		if (yearsComparison === 1) {
			if (monthsComparison === 1) {
				return daysComparison;
			} else {
				return monthsComparison;
			}
		} else {
			return yearsComparison;
		}
	});
var $PanagiotisGeorgiadis$elm_datetime$Calendar$compare = $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$compare;
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compareHours = F2(
	function (_v0, _v1) {
		var lhs = _v0;
		var rhs = _v1;
		return A2($elm$core$Basics$compare, lhs, rhs);
	});
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compareMilliseconds = F2(
	function (_v0, _v1) {
		var lhs = _v0;
		var rhs = _v1;
		return A2($elm$core$Basics$compare, lhs, rhs);
	});
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compareMinutes = F2(
	function (_v0, _v1) {
		var lhs = _v0;
		var rhs = _v1;
		return A2($elm$core$Basics$compare, lhs, rhs);
	});
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compareSeconds = F2(
	function (_v0, _v1) {
		var lhs = _v0;
		var rhs = _v1;
		return A2($elm$core$Basics$compare, lhs, rhs);
	});
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getHours = function (_v0) {
	var hours = _v0.aV;
	return hours;
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getMilliseconds = function (_v0) {
	var milliseconds = _v0.aZ;
	return milliseconds;
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getMinutes = function (_v0) {
	var minutes = _v0.a_;
	return minutes;
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getSeconds = function (_v0) {
	var seconds = _v0.a6;
	return seconds;
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compare = F2(
	function (lhs, rhs) {
		var _v0 = _Utils_Tuple3(
			A2(
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compareHours,
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getHours(lhs),
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getHours(rhs)),
			A2(
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compareMinutes,
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getMinutes(lhs),
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getMinutes(rhs)),
			A2(
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compareSeconds,
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getSeconds(lhs),
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getSeconds(rhs)));
		var hoursComparison = _v0.a;
		var minutesComparison = _v0.b;
		var secondsComparison = _v0.c;
		if (hoursComparison === 1) {
			if (minutesComparison === 1) {
				if (secondsComparison === 1) {
					return A2(
						$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compareMilliseconds,
						$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getMilliseconds(lhs),
						$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getMilliseconds(rhs));
				} else {
					return secondsComparison;
				}
			} else {
				return minutesComparison;
			}
		} else {
			return hoursComparison;
		}
	});
var $PanagiotisGeorgiadis$elm_datetime$Clock$compare = $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$compare;
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$compare = F2(
	function (_v0, _v1) {
		var lhs = _v0;
		var rhs = _v1;
		var _v2 = A2($PanagiotisGeorgiadis$elm_datetime$Calendar$compare, lhs.a, rhs.a);
		if (_v2 === 1) {
			return A2($PanagiotisGeorgiadis$elm_datetime$Clock$compare, lhs.c, rhs.c);
		} else {
			var ord = _v2;
			return ord;
		}
	});
var $PanagiotisGeorgiadis$elm_datetime$DateTime$compare = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$compare;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$not = _Basics_not;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$isLeapYear = function (_v0) {
	var _int = _v0;
	return (!A2($elm$core$Basics$modBy, 4, _int)) && ((!A2($elm$core$Basics$modBy, 400, _int)) || (!(!A2($elm$core$Basics$modBy, 100, _int))));
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisInADay = ((1000 * 60) * 60) * 24;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisInYear = function (year) {
	return $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$isLeapYear(year) ? ($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisInADay * 366) : ($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisInADay * 365);
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$Year = $elm$core$Basics$identity;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$yearFromInt = function (year) {
	return (year > 0) ? $elm$core$Maybe$Just(year) : $elm$core$Maybe$Nothing;
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisSinceEpoch = function (_v0) {
	var year = _v0;
	var getTotalMillis = A2(
		$elm$core$Basics$composeL,
		A2(
			$elm$core$Basics$composeL,
			$elm$core$List$sum,
			$elm$core$List$map($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisInYear)),
		$elm$core$List$filterMap($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$yearFromInt));
	var epochYear = 1970;
	return (year >= 1970) ? getTotalMillis(
		A2($elm$core$List$range, epochYear, year - 1)) : (-getTotalMillis(
		A2($elm$core$List$range, year, epochYear - 1)));
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisSinceStartOfTheMonth = function (day) {
	return $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisInADay * ($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$dayToInt(day) - 1);
};
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{j: nodeList, g: nodeListSize, i: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$months = $elm$core$Array$fromList(
	_List_fromArray(
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.i)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.i, tail);
		return (notAppended < 0) ? {
			j: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.j),
			g: builder.g + 1,
			i: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			j: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.j),
			g: builder.g + 1,
			i: $elm$core$Elm$JsArray$empty
		} : {j: builder.j, g: builder.g, i: appended});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						j: _List_Nil,
						g: 0,
						i: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getPrecedingMonths = function (month) {
	return $elm$core$Array$toList(
		A3(
			$elm$core$Array$slice,
			0,
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$monthToInt(month) - 1,
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$months));
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$Day = $elm$core$Basics$identity;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$lastDayOf = F2(
	function (year, month) {
		switch (month) {
			case 0:
				return 31;
			case 1:
				return $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$isLeapYear(year) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisSinceStartOfTheYear = F2(
	function (year, month) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (m, res) {
					return res + ($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisInADay * $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$dayToInt(
						A2($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$lastDayOf, year, m)));
				}),
			0,
			$PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getPrecedingMonths(month));
	});
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$toMillis = function (_v0) {
	var year = _v0.bc;
	var month = _v0.a$;
	var day = _v0.aP;
	return ($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisSinceEpoch(year) + A2($PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisSinceStartOfTheYear, year, month)) + $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$millisSinceStartOfTheMonth(day);
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$toMillis = $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$toMillis;
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$hoursToInt = function (_v0) {
	var hours = _v0;
	return hours;
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$millisecondsToInt = function (_v0) {
	var milliseconds = _v0;
	return milliseconds;
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$minutesToInt = function (_v0) {
	var minutes = _v0;
	return minutes;
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$secondsToInt = function (_v0) {
	var seconds = _v0;
	return seconds;
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$toMillis = function (_v0) {
	var hours = _v0.aV;
	var minutes = _v0.a_;
	var seconds = _v0.a6;
	var milliseconds = _v0.aZ;
	return $elm$core$List$sum(
		_List_fromArray(
			[
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$hoursToInt(hours) * 3600000,
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$minutesToInt(minutes) * 60000,
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$secondsToInt(seconds) * 1000,
				$PanagiotisGeorgiadis$elm_datetime$Clock$Internal$millisecondsToInt(milliseconds)
			]));
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$toMillis = $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$toMillis;
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$toMillis = function (_v0) {
	var date = _v0.a;
	var time = _v0.c;
	return $PanagiotisGeorgiadis$elm_datetime$Calendar$toMillis(date) + $PanagiotisGeorgiadis$elm_datetime$Clock$toMillis(time);
};
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$toPosix = A2($elm$core$Basics$composeL, $elm$time$Time$millisToPosix, $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$toMillis);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$toPosix = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$toPosix;
var $author$project$OutageDetection$detectDiff = F3(
	function (sm1, sm2, minOutageDuration) {
		var t2 = $PanagiotisGeorgiadis$elm_datetime$DateTime$toPosix(sm2.aE);
		var t1 = $PanagiotisGeorgiadis$elm_datetime$DateTime$toPosix(sm1.aE);
		var diffMs = $elm$time$Time$posixToMillis(t2) - $elm$time$Time$posixToMillis(t1);
		return (_Utils_cmp(
			diffMs,
			$elm$time$Time$posixToMillis(minOutageDuration)) > 0) ? $elm$core$Maybe$Just(
			{
				aK: sm1.ai,
				aR: $elm$time$Time$millisToPosix(diffMs),
				Q: sm1.aE
			}) : $elm$core$Maybe$Nothing;
	});
var $elm_community$maybe_extra$Maybe$Extra$toList = function (m) {
	if (m.$ === 1) {
		return _List_Nil;
	} else {
		var x = m.a;
		return _List_fromArray(
			[x]);
	}
};
var $author$project$OutageDetection$detectSingleNodeOutages = F3(
	function (minOutageDuration, singleNodeMeasurements, acc) {
		detectSingleNodeOutages:
		while (true) {
			if (singleNodeMeasurements.b && singleNodeMeasurements.b.b) {
				var sm1 = singleNodeMeasurements.a;
				var _v1 = singleNodeMeasurements.b;
				var sm2 = _v1.a;
				var rest = _v1.b;
				var maybeOutage = A3($author$project$OutageDetection$detectDiff, sm1, sm2, minOutageDuration);
				var maybeOutageList = $elm_community$maybe_extra$Maybe$Extra$toList(maybeOutage);
				var $temp$minOutageDuration = minOutageDuration,
					$temp$singleNodeMeasurements = A2($elm$core$List$cons, sm2, rest),
					$temp$acc = _Utils_ap(maybeOutageList, acc);
				minOutageDuration = $temp$minOutageDuration;
				singleNodeMeasurements = $temp$singleNodeMeasurements;
				acc = $temp$acc;
				continue detectSingleNodeOutages;
			} else {
				return acc;
			}
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $elm_community$dict_extra$Dict$Extra$groupBy = F2(
	function (keyfn, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A3(
						$elm$core$Dict$update,
						keyfn(x),
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Maybe$map(
								$elm$core$List$cons(x)),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Maybe$withDefault(
									_List_fromArray(
										[x])),
								$elm$core$Maybe$Just)),
						acc);
				}),
			$elm$core$Dict$empty,
			list);
	});
var $author$project$OutageDetection$groupMeasurementByNodes = function (measurements) {
	return A2(
		$elm_community$dict_extra$Dict$Extra$groupBy,
		function ($) {
			return $.ai;
		},
		measurements);
};
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$OutageDetection$outageDuration = function (minOutageLength) {
	return $elm$time$Time$millisToPosix((1000 * 60) * minOutageLength);
};
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$OutageDetection$detectAllOutages = F2(
	function (minOutageLength, allSensorMeasurements) {
		var temperatureMeasurements = A2(
			$elm$core$List$filter,
			function (sm) {
				return sm.am === 'temperature';
			},
			allSensorMeasurements);
		var measurementsByNodes = $author$project$OutageDetection$groupMeasurementByNodes(temperatureMeasurements);
		var outagesByNodes = A2(
			$elm$core$Dict$map,
			F2(
				function (_v0, nodeMeasurements) {
					var sortedNodeMeasurements = A2(
						$elm$core$List$sortWith,
						F2(
							function (sm1, sm2) {
								return A2($PanagiotisGeorgiadis$elm_datetime$DateTime$compare, sm1.aE, sm2.aE);
							}),
						nodeMeasurements);
					return A3(
						$author$project$OutageDetection$detectSingleNodeOutages,
						$author$project$OutageDetection$outageDuration(minOutageLength),
						sortedNodeMeasurements,
						_List_Nil);
				}),
			measurementsByNodes);
		return A2(
			$elm$core$List$concatMap,
			$elm$core$Tuple$second,
			$elm$core$Dict$toList(outagesByNodes));
	});
var $author$project$Visualization$elmToJS = _Platform_outgoingPort('elmToJS', $elm$core$Basics$identity);
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $elm_community$maybe_extra$Maybe$Extra$filter = F2(
	function (f, m) {
		var _v0 = A2($elm$core$Maybe$map, f, m);
		if ((!_v0.$) && _v0.a) {
			return m;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndex = $elm_community$list_extra$List$Extra$findIndexHelp(0);
var $elm_community$list_extra$List$Extra$elemIndex = function (x) {
	return $elm_community$list_extra$List$Extra$findIndex(
		$elm$core$Basics$eq(x));
};
var $elm$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					return $elm$core$Maybe$Just(
						A3(func, a, b, c));
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$lines = _String_lines;
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $lovasoa$elm_csv$Helper$parseRemaining = F5(
	function (separator, quoted, startOfLine, remaining, result) {
		parseRemaining:
		while (true) {
			if (remaining === '') {
				return result;
			} else {
				if ((separator !== '') && ((!quoted) && A2($elm$core$String$startsWith, separator, remaining))) {
					var nextChars = A2(
						$elm$core$String$dropLeft,
						$elm$core$String$length(separator),
						remaining);
					var newResult = startOfLine ? _List_fromArray(
						['', '']) : A2($elm$core$List$cons, '', result);
					var newQuoted = false;
					var $temp$separator = separator,
						$temp$quoted = false,
						$temp$startOfLine = false,
						$temp$remaining = nextChars,
						$temp$result = newResult;
					separator = $temp$separator;
					quoted = $temp$quoted;
					startOfLine = $temp$startOfLine;
					remaining = $temp$remaining;
					result = $temp$result;
					continue parseRemaining;
				} else {
					var others = A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						$elm$core$List$tail(result));
					var nextNextChar = A3($elm$core$String$slice, 1, 2, remaining);
					var nextChar = A3($elm$core$String$slice, 0, 1, remaining);
					var isEscapedQuote = (!quoted) && (((nextChar === '\\') || (nextChar === '\"')) && (nextNextChar === '\"'));
					var nextChars = A2(
						$elm$core$String$dropLeft,
						isEscapedQuote ? 2 : 1,
						remaining);
					var endQuote = quoted && ((nextChar === '\"') && (!isEscapedQuote));
					var current = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(result));
					var startQuote = (nextChar === '\"') && ((nextNextChar !== '\"') && (current === ''));
					var newChar = isEscapedQuote ? '\"' : ((startQuote || endQuote) ? '' : nextChar);
					var newDone = A2(
						$elm$core$List$cons,
						_Utils_ap(current, newChar),
						others);
					var newQuoted = (quoted && (!endQuote)) || startQuote;
					var $temp$separator = separator,
						$temp$quoted = newQuoted,
						$temp$startOfLine = false,
						$temp$remaining = nextChars,
						$temp$result = newDone;
					separator = $temp$separator;
					quoted = $temp$quoted;
					startOfLine = $temp$startOfLine;
					remaining = $temp$remaining;
					result = $temp$result;
					continue parseRemaining;
				}
			}
		}
	});
var $lovasoa$elm_csv$Helper$splitLineWith = F2(
	function (separator, line) {
		return $elm$core$List$reverse(
			A5($lovasoa$elm_csv$Helper$parseRemaining, separator, false, true, line, _List_Nil));
	});
var $lovasoa$elm_csv$Csv$splitWith = F2(
	function (separator, lines) {
		var values = A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			$elm$core$String$lines(lines));
		return A2(
			$elm$core$List$map,
			$lovasoa$elm_csv$Helper$splitLineWith(separator),
			values);
	});
var $lovasoa$elm_csv$Csv$parseWith = F2(
	function (separator, lines) {
		var values = A2($lovasoa$elm_csv$Csv$splitWith, separator, lines);
		var records = A2($elm$core$List$drop, 1, values);
		var headers = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$head(values));
		return {K: headers, a4: records};
	});
var $lovasoa$elm_csv$Csv$parse = $lovasoa$elm_csv$Csv$parseWith(',');
var $elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$DateTime = $elm$core$Basics$identity;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$Date = $elm$core$Basics$identity;
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.P, posixMinutes) < 0) {
					return posixMinutes + era.d;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		aP: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		a$: month,
		bc: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).aP;
	});
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).a$;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).bc;
	});
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$fromPosix = function (posix) {
	return {
		aP: A2($elm$time$Time$toDay, $elm$time$Time$utc, posix),
		a$: A2($elm$time$Time$toMonth, $elm$time$Time$utc, posix),
		bc: A2($elm$time$Time$toYear, $elm$time$Time$utc, posix)
	};
};
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$Hour = $elm$core$Basics$identity;
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$Millisecond = $elm$core$Basics$identity;
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$Minute = $elm$core$Basics$identity;
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$Second = $elm$core$Basics$identity;
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$Time = $elm$core$Basics$identity;
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $elm$time$Time$toMillis = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			1000,
			$elm$time$Time$posixToMillis(time));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$fromPosix = function (posix) {
	return {
		aV: A2($elm$time$Time$toHour, $elm$time$Time$utc, posix),
		aZ: A2($elm$time$Time$toMillis, $elm$time$Time$utc, posix),
		a_: A2($elm$time$Time$toMinute, $elm$time$Time$utc, posix),
		a6: A2($elm$time$Time$toSecond, $elm$time$Time$utc, posix)
	};
};
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$fromPosix = function (timePosix) {
	return {
		a: $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$fromPosix(timePosix),
		c: $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$fromPosix(timePosix)
	};
};
var $PanagiotisGeorgiadis$elm_datetime$DateTime$fromPosix = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$fromPosix;
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {V: col, aO: contextStack, aq: problem, ay: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.ay, s.V, x, s.e));
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.b),
			s.d) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.b);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.d, offset) < 0,
					0,
					{V: col, e: s0.e, f: s0.f, d: offset, ay: row, b: s0.b});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.d, s.ay, s.V, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.d, s1.d, s0.b),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$core$Basics$round = _Basics_round;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$core$String$toFloat = _String_toFloat;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$fractionsOfASecondInMs = A2(
	$elm$parser$Parser$andThen,
	function (str) {
		if ($elm$core$String$length(str) <= 9) {
			var _v0 = $elm$core$String$toFloat('0.' + str);
			if (!_v0.$) {
				var floatVal = _v0.a;
				return $elm$parser$Parser$succeed(
					$elm$core$Basics$round(floatVal * 1000));
			} else {
				return $elm$parser$Parser$problem('Invalid float: \"' + (str + '\"'));
			}
		} else {
			return $elm$parser$Parser$problem(
				'Expected at most 9 digits, but got ' + $elm$core$String$fromInt(
					$elm$core$String$length(str)));
		}
	},
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompWhile($elm$core$Char$isDigit)));
var $rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts = F6(
	function (monthYearDayMs, hour, minute, second, ms, utcOffsetMinutes) {
		return $elm$time$Time$millisToPosix((((monthYearDayMs + (((hour * 60) * 60) * 1000)) + (((minute - utcOffsetMinutes) * 60) * 1000)) + (second * 1000)) + ms);
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$core$String$append = _String_append;
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.d, s.b);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{V: 1, e: s.e, f: s.f, d: s.d + 1, ay: s.ay + 1, b: s.b}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{V: s.V + 1, e: s.e, f: s.f, d: newOffset, ay: s.ay, b: s.b}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt = function (quantity) {
	var helper = function (str) {
		if (_Utils_eq(
			$elm$core$String$length(str),
			quantity)) {
			var _v0 = $elm$core$String$toInt(str);
			if (!_v0.$) {
				var intVal = _v0.a;
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$Done,
					$elm$parser$Parser$succeed(intVal));
			} else {
				return $elm$parser$Parser$problem('Invalid integer: \"' + (str + '\"'));
			}
		} else {
			return A2(
				$elm$parser$Parser$map,
				function (nextChar) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$String$append, str, nextChar));
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
		}
	};
	return A2($elm$parser$Parser$loop, '', helper);
};
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.d, s.ay, s.V, s.b);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{V: newCol, e: s.e, f: s.f, d: newOffset, ay: newRow, b: s.b});
	};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear = 1970;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay = function (day) {
	return $elm$parser$Parser$problem(
		'Invalid day: ' + $elm$core$String$fromInt(day));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear = function (year) {
	return (!A2($elm$core$Basics$modBy, 4, year)) && ((!(!A2($elm$core$Basics$modBy, 100, year))) || (!A2($elm$core$Basics$modBy, 400, year)));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore = function (y1) {
	var y = y1 - 1;
	return (((y / 4) | 0) - ((y / 100) | 0)) + ((y / 400) | 0);
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerDay = 86400000;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerYear = 31536000000;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$yearMonthDay = function (_v0) {
	var year = _v0.a;
	var month = _v0.b;
	var dayInMonth = _v0.c;
	if (dayInMonth < 0) {
		return $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth);
	} else {
		var succeedWith = function (extraMs) {
			var yearMs = $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerYear * (year - $rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear);
			var days = ((month < 3) || (!$rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear(year))) ? (dayInMonth - 1) : dayInMonth;
			var dayMs = $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerDay * (days + ($rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore(year) - $rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore($rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear)));
			return $elm$parser$Parser$succeed((extraMs + yearMs) + dayMs);
		};
		switch (month) {
			case 1:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(0);
			case 2:
				return ((dayInMonth > 29) || ((dayInMonth === 29) && (!$rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear(year)))) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(2678400000);
			case 3:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(5097600000);
			case 4:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(7776000000);
			case 5:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(10368000000);
			case 6:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(13046400000);
			case 7:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(15638400000);
			case 8:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(18316800000);
			case 9:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(20995200000);
			case 10:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(23587200000);
			case 11:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(26265600000);
			case 12:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(28857600000);
			default:
				return $elm$parser$Parser$problem(
					'Invalid month: \"' + ($elm$core$String$fromInt(month) + '\"'));
		}
	}
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$monthYearDayInMs = A2(
	$elm$parser$Parser$andThen,
	$rtfeldman$elm_iso8601_date_strings$Iso8601$yearMonthDay,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F3(
						function (year, month, day) {
							return _Utils_Tuple3(year, month, day);
						})),
				$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(4)),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed($elm$core$Basics$identity),
							$elm$parser$Parser$symbol('-')),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
					]))),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($elm$core$Basics$identity),
						$elm$parser$Parser$symbol('-')),
					$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
					$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
				]))));
var $rtfeldman$elm_iso8601_date_strings$Iso8601$utcOffsetInMinutes = function () {
	var utcOffsetMinutesFromParts = F3(
		function (multiplier, hours, minutes) {
			return (multiplier * (hours * 60)) + minutes;
		});
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return 0;
					},
					$elm$parser$Parser$symbol('Z')),
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed(utcOffsetMinutesFromParts),
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$map,
										function (_v1) {
											return 1;
										},
										$elm$parser$Parser$symbol('+')),
										A2(
										$elm$parser$Parser$map,
										function (_v2) {
											return -1;
										},
										$elm$parser$Parser$symbol('-'))
									]))),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$ignorer,
									$elm$parser$Parser$succeed($elm$core$Basics$identity),
									$elm$parser$Parser$symbol(':')),
								$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
								$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2),
								$elm$parser$Parser$succeed(0)
							]))),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(0),
					$elm$parser$Parser$end)
				])));
}();
var $rtfeldman$elm_iso8601_date_strings$Iso8601$iso8601 = A2(
	$elm$parser$Parser$andThen,
	function (datePart) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed(
											$rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts(datePart)),
										$elm$parser$Parser$symbol('T')),
									$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
								$elm$parser$Parser$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$keeper,
											A2(
												$elm$parser$Parser$ignorer,
												$elm$parser$Parser$succeed($elm$core$Basics$identity),
												$elm$parser$Parser$symbol(':')),
											$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
											$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
										]))),
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$keeper,
										A2(
											$elm$parser$Parser$ignorer,
											$elm$parser$Parser$succeed($elm$core$Basics$identity),
											$elm$parser$Parser$symbol(':')),
										$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
										$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
									]))),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$symbol('.')),
									$rtfeldman$elm_iso8601_date_strings$Iso8601$fractionsOfASecondInMs),
									$elm$parser$Parser$succeed(0)
								]))),
					A2($elm$parser$Parser$ignorer, $rtfeldman$elm_iso8601_date_strings$Iso8601$utcOffsetInMinutes, $elm$parser$Parser$end)),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A6($rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts, datePart, 0, 0, 0, 0, 0)),
					$elm$parser$Parser$end)
				]));
	},
	$rtfeldman$elm_iso8601_date_strings$Iso8601$monthYearDayInMs);
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {V: col, aq: problem, ay: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.ay, p.V, p.aq);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{V: 1, e: _List_Nil, f: 1, d: 0, ay: 1, b: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $rtfeldman$elm_iso8601_date_strings$Iso8601$toTime = function (str) {
	return A2($elm$parser$Parser$run, $rtfeldman$elm_iso8601_date_strings$Iso8601$iso8601, str);
};
var $author$project$DataDecoding$parseTimestamp = function (timestampStr) {
	var isoTimestampStr = A3(
		$elm$core$String$replace,
		' ',
		'T',
		A3($elm$core$String$replace, '/', '-', timestampStr));
	return A2(
		$elm$core$Maybe$map,
		$PanagiotisGeorgiadis$elm_datetime$DateTime$fromPosix,
		$elm$core$Result$toMaybe(
			$rtfeldman$elm_iso8601_date_strings$Iso8601$toTime(isoTimestampStr)));
};
var $author$project$DataDecoding$parseCsvRow = F2(
	function (_v0, row) {
		var timestampIdx = _v0.a;
		var nodeIdIdx = _v0.b;
		var parameterIdx = _v0.c;
		var maybeTimestampStr = A2($elm_community$list_extra$List$Extra$getAt, timestampIdx, row);
		var maybeTimestamp = A2($elm$core$Maybe$andThen, $author$project$DataDecoding$parseTimestamp, maybeTimestampStr);
		var maybeParameter = A2($elm_community$list_extra$List$Extra$getAt, parameterIdx, row);
		var maybeNodeId = A2($elm_community$list_extra$List$Extra$getAt, nodeIdIdx, row);
		return A4(
			$elm$core$Maybe$map3,
			F3(
				function (timestamp, nodeId, parameter) {
					return {ai: nodeId, am: parameter, aE: timestamp};
				}),
			maybeTimestamp,
			maybeNodeId,
			maybeParameter);
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm_community$maybe_extra$Maybe$Extra$traverse = function (f) {
	return A2(
		$elm$core$List$foldr,
		function (x) {
			return A2(
				$elm$core$Maybe$map2,
				$elm$core$List$cons,
				f(x));
		},
		$elm$core$Maybe$Just(_List_Nil));
};
var $author$project$DataDecoding$parseCsvRows = F2(
	function (records, indicies) {
		return A2(
			$elm_community$maybe_extra$Maybe$Extra$traverse,
			$author$project$DataDecoding$parseCsvRow(indicies),
			records);
	});
var $author$project$DataDecoding$parseSensorMeasurements = function (content) {
	var csv = $lovasoa$elm_csv$Csv$parse(content);
	var maybeNodeIdIdx = A2($elm_community$list_extra$List$Extra$elemIndex, 'node_id', csv.K);
	var maybeParameterIdx = A2($elm_community$list_extra$List$Extra$elemIndex, 'parameter', csv.K);
	var maybeTimestampIdx = A2($elm_community$list_extra$List$Extra$elemIndex, 'timestamp', csv.K);
	var maybeIndicies = A4(
		$elm$core$Maybe$map3,
		F3(
			function (timestampIdx, nodeIdIdx, parameterIdx) {
				return _Utils_Tuple3(timestampIdx, nodeIdIdx, parameterIdx);
			}),
		maybeTimestampIdx,
		maybeNodeIdIdx,
		maybeParameterIdx);
	return A2(
		$elm$core$Maybe$andThen,
		$author$project$DataDecoding$parseCsvRows(csv.a4),
		maybeIndicies);
};
var $elm$file$File$toString = _File_toString;
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var minLengthStr = msg.a;
				var _v1 = A2(
					$elm_community$maybe_extra$Maybe$Extra$filter,
					function (x) {
						return x > 0;
					},
					$elm$core$String$toInt(minLengthStr));
				if (!_v1.$) {
					var newMinLength = _v1.a;
					return _Utils_Tuple2(
						$author$project$Main$UploadForm(newMinLength),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 1:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$file$File$Select$file,
						_List_fromArray(
							['text/csv']),
						$author$project$Main$CsvSelected));
			case 2:
				var file = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$perform,
						$author$project$Main$CsvLoaded,
						$elm$file$File$toString(file)));
			default:
				var content = msg.a;
				var minOutageLength = function () {
					if (!model.$) {
						var v = model.a;
						return v;
					} else {
						return 0;
					}
				}();
				var _v2 = $author$project$DataDecoding$parseSensorMeasurements(content);
				if (!_v2.$) {
					var measurements = _v2.a;
					var outages = A2($author$project$OutageDetection$detectAllOutages, minOutageLength, measurements);
					var numMeasurements = $elm$core$List$length(measurements);
					var groupedOutages = A2(
						$elm_community$dict_extra$Dict$Extra$groupBy,
						function ($) {
							return $.aK;
						},
						outages);
					var outagesPerNode = A2(
						$elm$core$Dict$map,
						F2(
							function (_v4, nodeOutages) {
								return $elm$core$List$length(nodeOutages);
							}),
						groupedOutages);
					var sortedGroupedOutages = A2(
						$elm$core$Dict$map,
						F2(
							function (_v3, os) {
								return A2(
									$elm$core$List$sortWith,
									F2(
										function (o1, o2) {
											return A2($PanagiotisGeorgiadis$elm_datetime$DateTime$compare, o1.Q, o2.Q);
										}),
									os);
							}),
						groupedOutages);
					return _Utils_Tuple2(
						$author$project$Main$Uploaded(
							{ah: minOutageLength, aj: numMeasurements, al: sortedGroupedOutages}),
						$author$project$Visualization$elmToJS(
							A2($author$project$Visualization$allSummaryVisualizations, outages, outagesPerNode)));
				} else {
					return _Utils_Tuple2($author$project$Main$UploadError, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Main$ChangeMinOutageLength = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$CsvRequested = {$: 1};
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getDate = function (_v0) {
	var date = _v0.a;
	return date;
};
var $PanagiotisGeorgiadis$elm_datetime$Calendar$getDay = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$dayToInt, $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getDay);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getDay = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Calendar$getDay, $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getDate);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$getDay = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getDay;
var $PanagiotisGeorgiadis$elm_datetime$Clock$getHours = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$hoursToInt, $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getHours);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getTime = function (_v0) {
	var time = _v0.c;
	return time;
};
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getHours = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Clock$getHours, $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getTime);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$getHours = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getHours;
var $PanagiotisGeorgiadis$elm_datetime$Clock$getMinutes = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$minutesToInt, $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getMinutes);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getMinutes = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Clock$getMinutes, $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getTime);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$getMinutes = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getMinutes;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$getMonth = $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getMonth;
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getMonth = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Calendar$getMonth, $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getDate);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$getMonth = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getMonth;
var $PanagiotisGeorgiadis$elm_datetime$Clock$getSeconds = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$secondsToInt, $PanagiotisGeorgiadis$elm_datetime$Clock$Internal$getSeconds);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getSeconds = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Clock$getSeconds, $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getTime);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$getSeconds = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getSeconds;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$getYear = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$yearToInt, $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$getYear);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getYear = A2($elm$core$Basics$composeL, $PanagiotisGeorgiadis$elm_datetime$Calendar$getYear, $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getDate);
var $PanagiotisGeorgiadis$elm_datetime$DateTime$getYear = $PanagiotisGeorgiadis$elm_datetime$DateTime$Internal$getYear;
var $PanagiotisGeorgiadis$elm_datetime$Calendar$monthToInt = $PanagiotisGeorgiadis$elm_datetime$Calendar$Internal$monthToInt;
var $author$project$Main$padNum = function (n) {
	return (n < 10) ? ('0' + $elm$core$String$fromInt(n)) : $elm$core$String$fromInt(n);
};
var $author$project$Main$viewDateTime = function (timestamp) {
	var y = $author$project$Main$padNum(
		$PanagiotisGeorgiadis$elm_datetime$DateTime$getYear(timestamp));
	var s = $author$project$Main$padNum(
		$PanagiotisGeorgiadis$elm_datetime$DateTime$getSeconds(timestamp));
	var mon = $author$project$Main$padNum(
		$PanagiotisGeorgiadis$elm_datetime$Calendar$monthToInt(
			$PanagiotisGeorgiadis$elm_datetime$DateTime$getMonth(timestamp)));
	var min = $author$project$Main$padNum(
		$PanagiotisGeorgiadis$elm_datetime$DateTime$getMinutes(timestamp));
	var h = $author$project$Main$padNum(
		$PanagiotisGeorgiadis$elm_datetime$DateTime$getHours(timestamp));
	var d = $author$project$Main$padNum(
		$PanagiotisGeorgiadis$elm_datetime$DateTime$getDay(timestamp));
	return y + ('/' + (mon + ('/' + (d + (' ' + (h + (':' + (min + (':' + s)))))))));
};
var $author$project$Main$viewDuration = function (duration) {
	var durationMs = $elm$time$Time$posixToMillis(duration);
	var sec = (durationMs / 1000) | 0;
	var minutes = (sec / 60) | 0;
	var remSec = sec - (minutes * 60);
	return $elm$core$String$fromInt(minutes) + ('min ' + ($author$project$Main$padNum(remSec) + 'sec'));
};
var $author$project$Main$viewNodeOutages = F2(
	function (nodeId, outages) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('affected node ' + nodeId)
						])),
					A2(
					$elm$html$Html$table,
					_List_Nil,
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('start timestamp')
										])),
									A2(
									$elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('duration')
										]))
								])),
						A2(
							$elm$core$List$map,
							function (outage) {
								return A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													$author$project$Main$viewDateTime(outage.Q))
												])),
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													$author$project$Main$viewDuration(outage.aR))
												]))
										]));
							},
							outages)))
				]));
	});
var $author$project$Main$viewOutages = function (groupedOutages) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2(
			$elm$core$List$map,
			function (_v0) {
				var nodeId = _v0.a;
				var outages = _v0.b;
				return A2($author$project$Main$viewNodeOutages, nodeId, outages);
			},
			$elm$core$Dict$toList(groupedOutages)));
};
var $author$project$Main$view = function (model) {
	switch (model.$) {
		case 0:
			var minOutageLength = model.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin', '2em')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Minimum outage length in minutes')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('number'),
								$elm$html$Html$Attributes$min('1'),
								$elm$html$Html$Attributes$placeholder('Outage length in minutes'),
								$elm$html$Html$Attributes$value(
								$elm$core$String$fromInt(minOutageLength)),
								$elm$html$Html$Events$onInput($author$project$Main$ChangeMinOutageLength)
							]),
						_List_Nil),
						A2($elm$html$Html$br, _List_Nil, _List_Nil),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$CsvRequested)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Load CSV file')
							]))
					]));
		case 1:
			return $elm$html$Html$text('Upload error!');
		default:
			var numMeasurements = model.a.aj;
			var minOutageLength = model.a.ah;
			var outages = model.a.al;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin', '2em')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'we have ' + ($elm$core$String$fromInt(numMeasurements) + ' measurement(s)'))
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'we display only outages of at least ' + ($elm$core$String$fromInt(minOutageLength) + ' minute(s)'))
							])),
						$author$project$Main$viewOutages(outages)
					]));
	}
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{aX: $author$project$Main$init, a7: $author$project$Main$subscriptions, a9: $author$project$Main$update, ba: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));